from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Optional, List, Tuple
from uuid import UUID
from datetime import datetime, timezone

from app.models import Contact, ContactStatus, Patient, Lead, Appointment
from app.schemas.contact import ContactCreate, ContactUpdate

async def get_by_id(db: AsyncSession, contact_id: UUID) -> Optional[Tuple[Contact, Optional[Patient], Optional[Lead], Optional[Appointment]]]:
    query = select(Contact, Patient, Lead, Appointment)\
        .outerjoin(Patient, Contact.patientId == Patient.id)\
        .outerjoin(Lead, Contact.leadId == Lead.id)\
        .outerjoin(Appointment, Contact.appointmentId == Appointment.id)\
        .where(Contact.id == contact_id, Contact.deletedAt.is_(None))
    result = await db.execute(query)
    row = result.first()
    if row:
        return row.Contact, row.Patient, row.Lead, row.Appointment
    return None

async def get_by_id_for_update(db: AsyncSession, contact_id: UUID) -> Optional[Contact]:
    query = select(Contact).where(Contact.id == contact_id, Contact.deletedAt.is_(None)).with_for_update()
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def get_contacts(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[ContactStatus] = None,
    q: Optional[str] = None
) -> Tuple[List[Tuple[Contact, Optional[Patient], Optional[Lead], Optional[Appointment]]], int]:
    base_query = select(Contact, Patient, Lead, Appointment)\
        .outerjoin(Patient, Contact.patientId == Patient.id)\
        .outerjoin(Lead, Contact.leadId == Lead.id)\
        .outerjoin(Appointment, Contact.appointmentId == Appointment.id)\
        .where(Contact.deletedAt.is_(None))
    
    count_base = select(Contact).where(Contact.deletedAt.is_(None))
    
    if status:
        base_query = base_query.where(Contact.status == status)
        count_base = count_base.where(Contact.status == status)

    if q:
        search_term = f"%{q}%"
        search_cond = (
            Patient.fullName.ilike(search_term) |
            Patient.phone.ilike(search_term) |
            Lead.name.ilike(search_term) |
            Lead.phone.ilike(search_term)
        )
        base_query = base_query.where(search_cond)
        
        # for count, need to join manually if searching
        count_base = count_base.outerjoin(Patient, Contact.patientId == Patient.id)\
                               .outerjoin(Lead, Contact.leadId == Lead.id)\
                               .where(search_cond)

    count_query = select(func.count()).select_from(count_base.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    query = base_query.order_by(
        Contact.nextFollowUpAt.asc().nulls_last(),
        Contact.createdAt.desc()
    ).offset(skip).limit(limit)

    results = await db.execute(query)
    rows = results.all()
    contacts = [(row.Contact, row.Patient, row.Lead, row.Appointment) for row in rows]
    
    return contacts, total

from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

async def create(db: AsyncSession, contact_in: ContactCreate) -> Contact:
    contact = Contact(**contact_in.model_dump())
    contact.updatedAt = datetime.now(timezone.utc)
    db.add(contact)
    try:
        async with db.begin_nested():
            await db.flush()
    except IntegrityError as e:
        if 'Contact_leadId_key' in str(e):
            raise HTTPException(status_code=409, detail="A contact for this lead already exists.") from e
        raise e
    return contact

async def update(db: AsyncSession, db_contact: Contact, contact_in: ContactUpdate) -> Contact:
    update_data = contact_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)
    
    db_contact.updatedAt = datetime.now(timezone.utc)
    db.add(db_contact)
    await db.flush()
    return db_contact
