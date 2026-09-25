from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID
from app.db.session import get_db
from app.api.dependencies import require_roles
from app.models import User, Role, ContactStatus
from app.schemas.contact import ContactListResponse, ContactResponse, ContactCreate, ContactUpdate
from app.services import contact_service

router = APIRouter()

@router.get("", response_model=ContactListResponse)
async def list_contacts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[ContactStatus] = None,
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF]))
):
    contacts, total = await contact_service.get_contacts(db, skip, limit, status, q)
    return ContactListResponse(
        total=total,
        skip=skip,
        limit=limit,
        data=contacts
    )

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF]))
):
    return await contact_service.get_contact(db, contact_id)

@router.post("", response_model=ContactResponse)
async def create_contact(
    contact_in: ContactCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF]))
):
    try:
        contact = await contact_service.create_contact(db, contact_in, actor_id=current_user.id)
        await db.commit()
        return contact
    except Exception as e:
        await db.rollback()
        raise e

@router.patch("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_in: ContactUpdate,
    contact_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF]))
):
    try:
        contact = await contact_service.update_contact(db, contact_id, contact_in, actor_id=current_user.id)
        await db.commit()
        return contact
    except Exception as e:
        await db.rollback()
        raise e

from app.schemas.contact import ContactUpdateStatus

@router.patch("/{contact_id}/status", response_model=ContactResponse)
async def update_contact_status(
    status_update: ContactUpdateStatus,
    contact_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF]))
):
    try:
        contact = await contact_service.update_contact_status(db, contact_id, status_update, actor_id=current_user.id)
        await db.commit()
        return contact
    except Exception as e:
        await db.rollback()
        raise e

@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Role.DOCTOR]))
):
    try:
        await contact_service.delete_contact(db, contact_id, actor_id=current_user.id)
        await db.commit()
        return {"detail": "Contact deleted"}
    except Exception as e:
        await db.rollback()
        raise e
