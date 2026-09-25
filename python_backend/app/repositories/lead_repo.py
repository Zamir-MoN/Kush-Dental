from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timezone
from app.models import Lead, LeadStatus
from app.schemas.lead import LeadCreate, LeadUpdate

async def get_by_id(db: AsyncSession, lead_id: UUID) -> Optional[Lead]:
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    return result.scalars().first()

async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Lead]:
    result = await db.execute(
        select(Lead)
        .order_by(Lead.createdAt.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())

async def create(db: AsyncSession, lead: LeadCreate) -> Lead:
    db_lead = Lead(
        name=lead.name,
        phone=lead.phone,
        email=lead.email,
        status=LeadStatus.NEW,
        desiredTreatment=lead.desiredTreatment,
        notes=lead.notes,
        idempotencyKey=lead.idempotencyKey,
        payloadFingerprint=lead.payloadFingerprint,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc)
    )
    db.add(db_lead)
    await db.flush()
    return db_lead

async def update(db: AsyncSession, db_lead: Lead, updates: LeadUpdate) -> Lead:
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_lead, key, value)
    db_lead.updatedAt = datetime.now(timezone.utc)
    await db.flush()
    return db_lead

async def soft_delete(db: AsyncSession, db_lead: Lead) -> Lead:
    db_lead.deletedAt = datetime.now(timezone.utc)
    db_lead.updatedAt = datetime.now(timezone.utc)
    await db.flush()
    return db_lead
