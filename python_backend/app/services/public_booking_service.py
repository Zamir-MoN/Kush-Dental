from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.schemas.lead import PublicLeadCreate, LeadCreate
from app.schemas.patient import PatientCreate
from app.schemas.appointment import AppointmentCreate
from app.models import AppointmentStatus
from app.repositories import patient_repo
from app.services import lead_service, appointment_service
from app.utils.phone import normalize_phone
import logging

logger = logging.getLogger(__name__)

async def process_public_booking(db: AsyncSession, lead_data: PublicLeadCreate, idempotency_key: str):
    """
    Handles the atomic creation of Patient, Lead, and Appointment
    for a public booking request.
    """
    import json
    import hashlib
    
    try:
        normalized_phone = normalize_phone(lead_data.phone)
        
        # 4. Canonical Payload Fingerprint
        # Normalize fields for deterministic hashing
        payload_dict = {
            "name": lead_data.name.strip().lower(),
            "phone": normalized_phone,
            "email": lead_data.email.strip().lower() if lead_data.email else None,
            "desiredTreatment": lead_data.desiredTreatment.strip() if lead_data.desiredTreatment else None,
        }
        
        if lead_data.startsAt and lead_data.endsAt:
            payload_dict["startsAt"] = lead_data.startsAt.isoformat()
            payload_dict["endsAt"] = lead_data.endsAt.isoformat()
            
        canonical_json = json.dumps(payload_dict, sort_keys=True)
        fingerprint = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
        
        # 1. Resolve or Create Patient
        patient = await patient_repo.get_by_phone(db, normalized_phone)
        
        if not patient:
            try:
                # We use a nested transaction (SAVEPOINT) so that an IntegrityError
                # on concurrent creation doesn't poison the main transaction.
                async with db.begin_nested():
                    patient_in = PatientCreate(
                        fullName=lead_data.name,
                        phone=normalized_phone,
                        email=lead_data.email
                    )
                    patient = await patient_repo.create(db, patient_in)
            except IntegrityError:
                # A concurrent transaction just created this patient.
                # The nested transaction rolled back safely.
                # We can now fetch the patient.
                patient = await patient_repo.get_by_phone(db, normalized_phone)
                if not patient:
                    # Should theoretically never happen unless deleted immediately
                    raise RuntimeError("Failed to resolve patient during concurrent booking")

        # 2. Create Lead
        import uuid
        from fastapi import HTTPException
        from sqlalchemy import select
        from app.models import Lead
        
        from app.repositories import lead_repo
        
        internal_lead = LeadCreate(
            name=lead_data.name,
            email=lead_data.email,
            phone=normalized_phone,
            desiredTreatment=lead_data.desiredTreatment,
            notes=None,
            idempotencyKey=uuid.UUID(idempotency_key),
            payloadFingerprint=fingerprint
        )
        
        try:
            async with db.begin_nested():
                internal_lead_created = await lead_repo.create(db, internal_lead)
        except IntegrityError as e:
            if 'idempotencyKey' in str(e):
                # We found a concurrent or past identical request!
                existing = await db.execute(select(Lead).where(Lead.idempotencyKey == uuid.UUID(idempotency_key)))
                existing_lead = existing.scalar_one()
                if existing_lead.payloadFingerprint != fingerprint:
                    raise HTTPException(status_code=409, detail="Idempotency key already used with a different payload.")
                
                # Because we caught this, we should abort the CURRENT booking attempt
                # and just return success without executing the rest.
                # The outer db.commit() will still run and commit the Patient if it was created, which is safe.
                return
            raise e

        # 3. Create Appointment (if dates provided)
        apt = None
        if lead_data.startsAt and lead_data.endsAt:
            if lead_data.endsAt <= lead_data.startsAt:
                raise ValueError("End time must be strictly after start time")
                
            apt_in = AppointmentCreate(
                patientId=patient.id,
                doctorId=None,
                treatment=lead_data.desiredTreatment or "Consultation",
                startsAt=lead_data.startsAt,
                endsAt=lead_data.endsAt
            )
            
            # Create the appointment via service to ensure audit log and overlaps are handled
            apt = await appointment_service.create_appointment(db, apt_in, actor_id=None)
        
        # 4. Create Follow-up Contact
        from datetime import datetime, timezone
        from app.models import Contact, ContactStatus
        
        lead_id = internal_lead_created.id if 'internal_lead_created' in locals() else None
        
        try:
            async with db.begin_nested():
                contact = Contact(
                    patientId=patient.id,
                    leadId=lead_id,
                    appointmentId=apt.id if apt else None,
                    status=ContactStatus.OPEN,
                    updatedAt=datetime.now(timezone.utc)
                )
                db.add(contact)
                await db.flush()
        except IntegrityError as e:
            if 'Contact_leadId_key' in str(e):
                # A contact for this lead already exists. Safe to ignore.
                pass
            else:
                raise e
        
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise e
