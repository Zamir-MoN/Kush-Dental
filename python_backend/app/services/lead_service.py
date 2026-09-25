from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.models import Lead, LeadStatus, User
from app.repositories import lead_repo
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

async def update_lead(db: AsyncSession, lead_id: UUID, lead_update: LeadUpdate) -> Lead:
    lead = await get_lead(db, lead_id)
    
    try:
        lead = await lead_repo.update(db, lead, lead_update)
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

async def convert_lead(db: AsyncSession, lead_id: UUID) -> Lead:
    try:
        # Lock Lead
        result = await db.execute(select(Lead).where(Lead.id == lead_id).with_for_update())
        lead = result.scalar_one_or_none()
        if not lead:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

        if lead.status == LeadStatus.CONVERTED:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Lead is already converted")

        # Create Patient
        try:
            patient_data = PatientCreate(fullName=lead.name, phone=lead.phone, email=lead.email)
            await patient_repo.create(db, patient_data)
            
            # Mark Lead CONVERTED
            lead.status = LeadStatus.CONVERTED
            lead.updatedAt = datetime.now(timezone.utc)
            await db.flush()
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Patient with this phone already exists")

        await db.commit()
        return lead
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise e
