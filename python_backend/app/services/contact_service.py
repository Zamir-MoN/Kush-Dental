from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Optional, List, Tuple
from fastapi import HTTPException
from app.models import ContactStatus, AuditResult, Role
from app.schemas.contact import ContactCreate, ContactUpdate, ContactUpdateStatus, ContactResponse, ContactPatient, ContactLead, ContactAppointment
from app.repositories import contact_repo, audit_repo

def map_to_response(row: Tuple) -> ContactResponse:
    contact, patient, lead, appointment = row
    
    patient_data = None
    if patient:
        patient_data = ContactPatient(id=patient.id, fullName=patient.fullName, phone=patient.phone)
        
    lead_data = None
    if lead:
        lead_data = ContactLead(id=lead.id, status=lead.status.value, desiredTreatment=lead.desiredTreatment)
        
    apt_data = None
    if appointment:
        apt_data = ContactAppointment(id=appointment.id, status=appointment.status.value, startsAt=appointment.startsAt)
        
    contact_dict = {
        "id": contact.id,
        "patientId": contact.patientId,
        "leadId": contact.leadId,
        "appointmentId": contact.appointmentId,
        "status": contact.status,
        "notes": contact.notes,
        "outcome": contact.outcome,
        "nextFollowUpAt": contact.nextFollowUpAt,
        "createdAt": contact.createdAt,
        "updatedAt": contact.updatedAt,
        "deletedAt": contact.deletedAt,
        "patient": patient_data,
        "lead": lead_data,
        "appointment": apt_data
    }
    
    return ContactResponse.model_validate(contact_dict)

async def get_contacts(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    status: Optional[ContactStatus] = None,
    q: Optional[str] = None
) -> Tuple[List[ContactResponse], int]:
    rows, total = await contact_repo.get_contacts(db, skip, limit, status, q)
    return [map_to_response(row) for row in rows], total

async def get_contact(db: AsyncSession, contact_id: UUID) -> ContactResponse:
    row = await contact_repo.get_by_id(db, contact_id)
    if not row:
        raise HTTPException(status_code=404, detail="Contact not found")
    return map_to_response(row)

async def create_contact(db: AsyncSession, contact_in: ContactCreate, actor_id: UUID) -> ContactResponse:
    if contact_in.patientId is None and contact_in.leadId is None and contact_in.appointmentId is None:
        raise HTTPException(status_code=422, detail="Contact must reference at least one patient, lead, or appointment.")
        
    contact = await contact_repo.create(db, contact_in)
    await audit_repo.log_event(
        db=db,
        action="CONTACT_CREATED",
        resource_type="Contact",
        result=AuditResult.SUCCESS,
        actor_id=actor_id,
        resource_id=contact.id
    )
    # Refetch to get joins (though normally manual creations might only have IDs, fetching handles None joins gracefully)
    row = await contact_repo.get_by_id(db, contact.id)
    return map_to_response(row)

async def update_contact(db: AsyncSession, contact_id: UUID, contact_in: ContactUpdate, actor_id: UUID) -> ContactResponse:
    row = await contact_repo.get_by_id(db, contact_id)
    if not row:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact, _, _, _ = row
    
    if contact.status in TERMINAL_STATES and contact_in.nextFollowUpAt is not None:
        contact_in.nextFollowUpAt = None
        
    updated_contact = await contact_repo.update(db, contact, contact_in)
    
    await audit_repo.log_event(
        db=db,
        action="CONTACT_UPDATED",
        resource_type="Contact",
        result=AuditResult.SUCCESS,
        actor_id=actor_id,
        resource_id=contact.id,
        metadata_={"updates": contact_in.model_dump(exclude_unset=True, mode='json')}
    )
    
    await db.flush()
    
    updated_row = await contact_repo.get_by_id(db, contact_id)
    return map_to_response(updated_row)

async def delete_contact(db: AsyncSession, contact_id: UUID, actor_id: UUID) -> None:
    row = await contact_repo.get_by_id(db, contact_id)
    if not row:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact, _, _, _ = row
    
    from datetime import datetime, timezone
    contact.deletedAt = datetime.now(timezone.utc)
    
    await db.flush()
    
    await audit_repo.log_event(
        db=db,
        action="CONTACT_DELETED",
        resource_type="Contact",
        result=AuditResult.SUCCESS,
        actor_id=actor_id,
        resource_id=contact.id
    )

ALLOWED_TRANSITIONS = {
    ContactStatus.OPEN: {ContactStatus.IN_PROGRESS, ContactStatus.CONTACTED, ContactStatus.COMPLETED, ContactStatus.CANCELLED},
    ContactStatus.IN_PROGRESS: {ContactStatus.CONTACTED, ContactStatus.COMPLETED, ContactStatus.NO_RESPONSE, ContactStatus.CANCELLED},
    ContactStatus.CONTACTED: {ContactStatus.COMPLETED, ContactStatus.NO_RESPONSE, ContactStatus.IN_PROGRESS},
    ContactStatus.COMPLETED: set(),
    ContactStatus.NO_RESPONSE: set(),
    ContactStatus.CANCELLED: set(),
}

TERMINAL_STATES = {ContactStatus.COMPLETED, ContactStatus.NO_RESPONSE, ContactStatus.CANCELLED}

async def update_contact_status(
    db: AsyncSession, 
    contact_id: UUID, 
    status_update: ContactUpdateStatus, 
    actor_id: UUID
) -> ContactResponse:
    from datetime import datetime, timezone
    
    # 1. Lock the row for update
    contact = await contact_repo.get_by_id_for_update(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    current_status = contact.status
    target_status = status_update.status
    
    # 2. Validate transition
    if current_status == target_status:
        raise HTTPException(status_code=409, detail=f"Contact is already in {target_status.value} state")
        
    allowed_next_states = ALLOWED_TRANSITIONS.get(current_status, set())
    if target_status not in allowed_next_states:
        raise HTTPException(status_code=409, detail=f"Invalid transition from {current_status.value} to {target_status.value}")
        
    # 3. Validate outcome for terminal states
    if target_status in TERMINAL_STATES:
        outcome = status_update.outcome.strip() if status_update.outcome else ""
        if not outcome:
            raise HTTPException(status_code=422, detail="Outcome is required when moving to a terminal state")
        contact.outcome = outcome
    else:
        if status_update.outcome is not None:
            contact.outcome = status_update.outcome
            
    # 4. Clear nextFollowUpAt if terminal
    if target_status in TERMINAL_STATES:
        contact.nextFollowUpAt = None
        
    # 5. Update status
    contact.status = target_status
    contact.updatedAt = datetime.now(timezone.utc)
    
    db.add(contact)
    await db.flush()
    
    # 6. Write AuditLog
    await audit_repo.log_event(
        db=db,
        action="CONTACT_STATUS_CHANGED",
        resource_type="Contact",
        result=AuditResult.SUCCESS,
        actor_id=actor_id,
        resource_id=contact.id,
        metadata_={
            "old_status": current_status.value,
            "new_status": target_status.value
        }
    )
    
    # Refetch to get related entities
    updated_row = await contact_repo.get_by_id(db, contact_id)
    return map_to_response(updated_row)
