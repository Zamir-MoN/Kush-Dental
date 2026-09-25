from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import Optional, List
from datetime import datetime, timezone
from app.models import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentCreate

async def get_by_id(db: AsyncSession, appointment_id: UUID) -> Optional[Appointment]:
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id, Appointment.deletedAt.is_(None)))
    return result.scalar_one_or_none()

async def get_all(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 100,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    doctor_id: Optional[UUID] = None,
    patient_id: Optional[UUID] = None,
    order_desc: bool = False
) -> List[Appointment]:
    query = select(Appointment).where(Appointment.deletedAt.is_(None))
    
    if start_date:
        query = query.where(Appointment.startsAt >= start_date)
    if end_date:
        query = query.where(Appointment.startsAt < end_date)
    if doctor_id:
        query = query.where(Appointment.doctorId == doctor_id)
    if patient_id:
        query = query.where(Appointment.patientId == patient_id)
        
    if order_desc:
        query = query.order_by(Appointment.startsAt.desc(), Appointment.id.asc()).offset(skip).limit(limit)
    else:
        query = query.order_by(Appointment.startsAt.asc(), Appointment.id.asc()).offset(skip).limit(limit)
        
    result = await db.execute(query)
    return list(result.scalars().all())

async def create(db: AsyncSession, apt_in: AppointmentCreate, status: AppointmentStatus = AppointmentStatus.REQUESTED) -> Appointment:
    db_obj = Appointment(
        patientId=apt_in.patientId,
        doctorId=apt_in.doctorId,
        treatment=apt_in.treatment,
        startsAt=apt_in.startsAt,
        endsAt=apt_in.endsAt,
        status=status,
        updatedAt=datetime.now(timezone.utc)
    )
    db.add(db_obj)
    await db.flush()
    return db_obj

async def update_status(db: AsyncSession, db_obj: Appointment, status: AppointmentStatus, reason: Optional[str] = None) -> Appointment:
    db_obj.status = status
    if reason is not None:
        db_obj.cancellationReason = reason
    db_obj.updatedAt = datetime.now(timezone.utc)
    db.add(db_obj)
    await db.flush()
    return db_obj

async def list_by_patient(db: AsyncSession, patient_id: UUID) -> List[Appointment]:
    result = await db.execute(select(Appointment).where(Appointment.patientId == patient_id, Appointment.deletedAt.is_(None)))
    return list(result.scalars().all())

async def update(db: AsyncSession, db_obj: Appointment, update_data: dict) -> Appointment:
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db_obj.updatedAt = datetime.now(timezone.utc)
    db.add(db_obj)
    await db.flush()
    return db_obj
