from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from uuid import UUID
from typing import Optional, Tuple, List
from datetime import datetime, timezone
from app.models import User
from app.schemas.user import UserCreate

async def get_by_id(db: AsyncSession, user_id: UUID) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def create(db: AsyncSession, user_in: UserCreate, hashed_password: str) -> User:
    db_obj = User(
        email=user_in.email,
        role=user_in.role,
        passwordHash=hashed_password,
        updatedAt=datetime.now(timezone.utc)
    )
    db.add(db_obj)
    await db.flush()
    return db_obj

async def get_doctors(db: AsyncSession):
    from app.models import Role
    result = await db.execute(select(User).where(User.role == Role.DOCTOR, User.deletedAt.is_(None)))
    return result.scalars().all()

async def get_users_paginated(db: AsyncSession, skip: int, limit: int) -> Tuple[int, List[User]]:
    base_query = select(User).where(User.deletedAt.is_(None))
    
    count_query = select(func.count()).select_from(base_query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = base_query.order_by(User.createdAt.desc(), User.id).offset(skip).limit(limit)
    result = await db.execute(query)
    users = list(result.scalars().all())
    
    return total, users
