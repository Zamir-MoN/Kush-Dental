from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from uuid import UUID
from typing import Optional, List, Tuple
from datetime import datetime, timezone
from app.models import Patient
from app.schemas.patient import PatientCreate, PatientUpdate
from app.utils.phone import normalize_phone

async def get_by_id(db: AsyncSession, patient_id: UUID) -> Optional[Patient]:
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.deletedAt.is_(None)))
    return result.scalar_one_or_none()

async def get_by_phone(db: AsyncSession, phone: str) -> Optional[Patient]:
    normalized_phone = normalize_phone(phone)
    result = await db.execute(select(Patient).where(Patient.phone == normalized_phone, Patient.deletedAt.is_(None)))
    return result.scalar_one_or_none()

async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Patient]:
    result = await db.execute(
        select(Patient)
        .where(Patient.deletedAt.is_(None))
        .order_by(Patient.createdAt.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())

async def search_patients(db: AsyncSession, query: str, skip: int = 0, limit: int = 50) -> Tuple[List[Patient], int]:
    normalized_query = normalize_phone(query)
    
    # If the query contains digits after normalization, treat it as a phone search
    if normalized_query and any(char.isdigit() for char in query):
        conditions = [Patient.phone.like(f"{normalized_query}%"), Patient.deletedAt.is_(None)]
    else:
        # Otherwise, treat as name search (case-insensitive partial match)
        conditions = [Patient.fullName.ilike(f"%{query}%"), Patient.deletedAt.is_(None)]
        
    count_query = select(func.count()).select_from(Patient).where(*conditions)
    total = await db.scalar(count_query)
    
    data_query = (
        select(Patient)
        .where(*conditions)
        .order_by(Patient.createdAt.desc(), Patient.id)
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(data_query)
    patients = list(result.scalars().all())
    
    return patients, total

async def create(db: AsyncSession, patient_in: PatientCreate) -> Patient:
    db_obj = Patient(
        fullName=patient_in.fullName,
        phone=normalize_phone(patient_in.phone),
        email=patient_in.email,
        updatedAt=datetime.now(timezone.utc)
    )
    db.add(db_obj)
    await db.flush()
    return db_obj

async def update(db: AsyncSession, db_obj: Patient, patient_in: PatientUpdate) -> Patient:
    update_data = patient_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db_obj.updatedAt = datetime.now(timezone.utc)
    db.add(db_obj)
    await db.flush()
    return db_obj

async def soft_delete(db: AsyncSession, db_obj: Patient) -> Patient:
    db_obj.deletedAt = datetime.now(timezone.utc)
    db.add(db_obj)
    await db.flush()
    return db_obj
