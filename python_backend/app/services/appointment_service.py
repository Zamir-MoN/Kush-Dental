from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import Optional
from uuid import UUID
from app.models import AppointmentStatus, Appointment, AuditResult
from app.schemas.appointment import AppointmentCreate, AppointmentUpdateStatus, AppointmentUpdate
from app.repositories import appointment_repo, patient_repo, user_repo, audit_repo
from app.core.exceptions import ConflictException, NotFoundException, ValidationException

async def create_appointment(db: AsyncSession, apt_in: AppointmentCreate, actor_id: Optional[UUID]) -> Appointment:
    patient = await patient_repo.get_by_id(db, apt_in.patientId)
    if not patient:
        raise NotFoundException("Patient", str(apt_in.patientId))
        
    if apt_in.doctorId:
        doctor = await user_repo.get_by_id(db, apt_in.doctorId)
        if not doctor:
            raise NotFoundException("User", str(apt_in.doctorId))
            
    if apt_in.endsAt <= apt_in.startsAt:
        raise ValidationException("Appointment endsAt must be after startsAt")

    try:
        apt = await appointment_repo.create(db, apt_in, AppointmentStatus.REQUESTED)
        await audit_repo.log_event(db, "APPOINTMENT_CREATED", "Appointment", AuditResult.SUCCESS, resource_id=apt.id, actor_id=actor_id)
        await db.flush()
        return apt
    except IntegrityError as e:
        if "no_overlapping_appointments" in str(e):
            raise ConflictException("The selected time slot overlaps with an existing appointment.")
        raise

async def update_appointment_status(db: AsyncSession, apt_id: UUID, status_update: AppointmentUpdateStatus, actor_id: UUID) -> Appointment:
    apt = await appointment_repo.get_by_id(db, apt_id)
    if not apt:
        raise NotFoundException("Appointment", str(apt_id))
        
    current = apt.status
    target = status_update.status
    
    if current in (AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW):
        raise ConflictException(f"Cannot transition from terminal state {current.name}")
        
    valid = False
    if current == AppointmentStatus.REQUESTED:
        if target in (AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED):
            valid = True
    elif current == AppointmentStatus.CONFIRMED:
        if target in (AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW):
            valid = True
            
    if not valid:
        raise ConflictException(f"Invalid transition from {current.name} to {target.name}")
        
    if target == AppointmentStatus.CANCELLED and not status_update.cancellationReason:
        raise ValidationException("Cancellation reason is required when cancelling an appointment")
        
    apt = await appointment_repo.update_status(db, apt, target, status_update.cancellationReason)
    
    # Audit logging
    action = f"APPOINTMENT_{target.name}"
    await audit_repo.log_event(db, action, "Appointment", AuditResult.SUCCESS, resource_id=apt.id, actor_id=actor_id)
    
    return apt

async def update_appointment(db: AsyncSession, apt_id: UUID, apt_update: AppointmentUpdate, actor_id: UUID) -> Appointment:
    apt = await appointment_repo.get_by_id(db, apt_id)
    if not apt:
        raise NotFoundException("Appointment", str(apt_id))
        
    update_data = apt_update.model_dump(exclude_unset=True)
    if not update_data:
        return apt
        
    # Validation
    if "doctorId" in update_data and update_data["doctorId"]:
        doctor = await user_repo.get_by_id(db, update_data["doctorId"])
        if not doctor:
            raise NotFoundException("User", str(update_data["doctorId"]))
            
    new_starts_at = update_data.get("startsAt", apt.startsAt)
    new_ends_at = update_data.get("endsAt", apt.endsAt)
    
    if new_ends_at <= new_starts_at:
        raise ValidationException("Appointment endsAt must be after startsAt")
        
    # Audit logging for specific changes
    if "startsAt" in update_data or "endsAt" in update_data:
        await audit_repo.log_event(db, "APPOINTMENT_RESCHEDULED", "Appointment", AuditResult.SUCCESS, resource_id=apt.id, actor_id=actor_id)
        
    if "doctorId" in update_data and update_data["doctorId"] != apt.doctorId:
        await audit_repo.log_event(db, "APPOINTMENT_DOCTOR_CHANGED", "Appointment", AuditResult.SUCCESS, resource_id=apt.id, actor_id=actor_id)

    if "treatment" in update_data and update_data["treatment"] != apt.treatment:
        await audit_repo.log_event(db, "APPOINTMENT_TREATMENT_CHANGED", "Appointment", AuditResult.SUCCESS, resource_id=apt.id, actor_id=actor_id)
        
    try:
        apt = await appointment_repo.update(db, apt, update_data)
        return apt
    except IntegrityError as e:
        if "no_overlapping_appointments" in str(e):
            raise ConflictException("The selected time slot overlaps with an existing appointment.")
        raise
