from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.models import Lead, LeadStatus, User, AuditResult
from app.repositories import lead_repo, audit_repo
from app.schemas.lead import LeadCreate, LeadUpdate

async def create_lead(db: AsyncSession, lead_data: LeadCreate) -> Lead:
    try:
        lead = await lead_repo.create(db, lead_data)
        await db.commit()
        return lead
    except Exception as e:
        await db.rollback()
        raise e

async def get_lead(db: AsyncSession, lead_id: UUID) -> Lead:
    lead = await lead_repo.get_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return lead

async def get_all_leads(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Lead]:
    return await lead_repo.get_all(db, skip=skip, limit=limit)

async def update_lead_status(db: AsyncSession, lead_id: UUID, new_status: LeadStatus, current_user: User) -> Lead:
    # Any staff or doctor can update status for now. RBAC is enforced at the route level.
    lead = await get_lead(db, lead_id)
    
    try:
        lead = await lead_repo.update(db, lead, LeadUpdate(status=new_status))
        await db.commit()
        return lead
    except Exception as e:
        await db.rollback()
        raise e

async def update_lead(db: AsyncSession, lead_id: UUID, lead_update: LeadUpdate, current_user: Optional[User] = None) -> Lead:
    lead = await get_lead(db, lead_id)
    
    try:
        old_qualification = lead.leadQualification
        
        lead = await lead_repo.update(db, lead, lead_update)
        
        if old_qualification != lead.leadQualification:
            event_name = f"LEAD_QUALIFIED_{lead.leadQualification.name}" if lead.leadQualification.name in ["POSITIVE", "NEGATIVE"] else "LEAD_QUALIFICATION_CHANGED"
            metadata = {
                "previous": old_qualification.name if old_qualification else None,
                "new": lead.leadQualification.name,
            }
            if lead.leadQualification.name == "NEGATIVE":
                metadata["negativeReason"] = lead.negativeReason
            
            actor_id = current_user.id if current_user else None
            await audit_repo.log_event(db, event_name, "Lead", AuditResult.SUCCESS, actor_id=actor_id, resource_id=lead.id, metadata_=metadata)
            
        await db.commit()
        return lead
    except Exception as e:
        await db.rollback()
        raise e

async def soft_delete_lead(db: AsyncSession, lead_id: UUID) -> Lead:
    lead = await get_lead(db, lead_id)
    
    try:
        lead = await lead_repo.soft_delete(db, lead)
        await db.commit()
        return lead
    except Exception as e:
        await db.rollback()
        raise e

from sqlalchemy.future import select
from app.repositories import patient_repo
from app.schemas.patient import PatientCreate
from sqlalchemy.exc import IntegrityError

async def convert_lead(db: AsyncSession, lead_id: UUID, current_user: Optional[User] = None) -> Lead:
    try:
        # Lock Lead
        result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.deletedAt.is_(None)).with_for_update())
        lead = result.scalar_one_or_none()
        if not lead:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

        if lead.status == LeadStatus.CONVERTED:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Lead is already converted")

        lead_id = lead.id

        # Check existing exact match proactively
        from app.utils.phone import normalize_phone
        normalized_phone = normalize_phone(lead.phone)
        existing_patient = await patient_repo.get_by_phone_and_name(db, normalized_phone, lead.name)

        if existing_patient:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={
                "code": "PATIENT_ALREADY_EXISTS",
                "existingPatient": {
                    "id": str(existing_patient.id),
                    "fullName": existing_patient.fullName,
                    "phone": existing_patient.phone,
                    "displayId": existing_patient.displayId or ""
                },
                "lead": {
                    "id": str(lead.id),
                    "name": lead.name,
                    "phone": lead.phone
                }
            })

        # Create Patient (Different name, or completely new phone)
        try:
            patient_data = PatientCreate(fullName=lead.name, phone=lead.phone, email=lead.email)
            patient = await patient_repo.create(db, patient_data)
            
            # Mark Lead CONVERTED
            lead.status = LeadStatus.CONVERTED
            lead.updatedAt = datetime.now(timezone.utc)
            await db.flush()
            
            # Associate existing Contacts with the new Patient
            from sqlalchemy import update
            from app.models import Contact
            await db.execute(
                update(Contact)
                .where(Contact.leadId == lead_id, Contact.deletedAt.is_(None))
                .values(patientId=patient.id, updatedAt=datetime.now(timezone.utc))
            )
            await db.flush()
            
            actor_id = current_user.id if current_user else None
            await audit_repo.log_event(db, "LEAD_CONVERTED", "Lead", AuditResult.SUCCESS, actor_id=actor_id, resource_id=lead_id)
            await audit_repo.log_event(db, "PATIENT_CREATED", "Patient", AuditResult.SUCCESS, actor_id=actor_id, resource_id=patient.id)
        except IntegrityError:
            await db.rollback()
            actor_id = current_user.id if current_user else None
            await audit_repo.log_event(db, "LEAD_CONVERTED", "Lead", AuditResult.FAILURE, actor_id=actor_id, resource_id=lead_id)
            await db.commit()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Failed to create patient due to database conflict")

        await db.commit()
        return lead
    except HTTPException:
        raise
    except Exception as e:
        actor_id = current_user.id if current_user else None
        await audit_repo.log_event(db, "LEAD_CONVERTED", "Lead", AuditResult.FAILURE, actor_id=actor_id, resource_id=lead_id)
        await db.rollback()
        raise e
