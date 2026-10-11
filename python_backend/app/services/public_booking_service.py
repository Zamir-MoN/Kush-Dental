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

async def process_public_booking(db: AsyncSession, lead_id: str, lead_data: PublicLeadCreate):
    """
    Handles the atomic creation of Patient and Appointment
    for a public booking request, using a pre-existing Lead as a durable inbox.
    """
    try:
        from app.models import Lead, Contact
        from sqlalchemy import select
        import uuid
        
        # 1. Lock the Lead to prevent concurrent duplicate processing
        lead_query = await db.execute(select(Lead).where(Lead.id == uuid.UUID(lead_id)).with_for_update())
        lead = lead_query.scalar_one_or_none()
        
        if not lead:
            raise ValueError(f"Lead {lead_id} not found during processing")
            
        # 2. Check if already processed (Idempotency safety)
        # If a Contact already exists for this lead, the queue already successfully processed it.
        contact_query = await db.execute(select(Contact).where(Contact.leadId == lead.id))
        if contact_query.scalar_one_or_none():
            logger.info(f"Lead {lead_id} already processed. Skipping.")
            return

        normalized_phone = lead.phone
        
        # 3. Resolve or Create Patient
        patient = await patient_repo.get_by_phone_and_name(db, normalized_phone, lead.name)
        
        if not patient:
            try:
                # We use a nested transaction (SAVEPOINT) so that an IntegrityError
                # on concurrent creation doesn't poison the main transaction.
                async with db.begin_nested():
                    patient_in = PatientCreate(
                        fullName=lead.name,
                        phone=normalized_phone,
                        email=lead.email
                    )
                    patient = await patient_repo.create(db, patient_in)
            except IntegrityError:
                # A concurrent transaction just created this patient.
                patient = await patient_repo.get_by_phone_and_name(db, normalized_phone, lead.name)
                if not patient:
                    raise RuntimeError("Failed to resolve patient during concurrent booking")

        # 4. Create Appointment (if dates provided)
        apt = None
        if lead_data.startsAt:
            # Auto-calculate end time (1 hour duration)
            from datetime import timedelta
            endsAt = lead_data.startsAt + timedelta(hours=1)
                
            apt_in = AppointmentCreate(
                patientId=patient.id,
                doctorId=None,
                treatment=lead.desiredTreatment or "Consultation",
                startsAt=lead_data.startsAt,
                endsAt=endsAt
            )
            
            apt = await appointment_service.create_appointment(db, apt_in, actor_id=None)
        
        # 5. Create Follow-up Contact
        from datetime import datetime, timezone
        from app.models import ContactStatus
        
        contact = Contact(
            patientId=patient.id,
            leadId=lead.id,
            appointmentId=apt.id if apt else None,
            status=ContactStatus.OPEN,
            updatedAt=datetime.now(timezone.utc)
        )
        db.add(contact)
        
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise e
