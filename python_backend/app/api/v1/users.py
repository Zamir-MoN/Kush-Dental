from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.db.session import get_db
from app.schemas.user import UserResponse, UserCreate, UserUpdate, UserListResponse
from app.repositories import user_repo
from app.models import Role, User
from app.api.dependencies import require_roles, verify_csrf_token
from app.utils.security import get_password_hash

router = APIRouter()

class UserResponseStaff(BaseModel):
    id: UUID
    email: str
    role: Role
    
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=UserListResponse)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    total, users = await user_repo.get_users_paginated(db, skip=skip, limit=limit)
    return UserListResponse(
        total=total,
        skip=skip,
        limit=limit,
        data=users
    )

@router.get("/{user_id}", response_model=UserResponseStaff)
async def get_user(
    user_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    user = await user_repo.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_csrf_token)])
async def create_user(
    user_in: UserCreate,
    current_user: User = Depends(require_roles([Role.DOCTOR])), # Only DOCTOR
    db: AsyncSession = Depends(get_db)
):
    try:
        hashed_password = get_password_hash(user_in.password)
        user = await user_repo.create(db, user_in, hashed_password)
        await db.commit()
        return user
    except Exception as e:
        await db.rollback()
        raise e

from app.services import user_service

@router.patch("/{user_id}", response_model=UserResponse, dependencies=[Depends(verify_csrf_token)])
async def update_user(
    user_id: UUID,
    update_data: UserUpdate,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    return await user_service.update_user(db, user_id, update_data, current_user.id)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(verify_csrf_token)])
async def delete_user(
    user_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    await user_service.deactivate_user(db, user_id, current_user.id)
