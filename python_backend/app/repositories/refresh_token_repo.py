from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID, uuid4
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from app.models import RefreshToken

async def get_by_hashed_token_for_update(db: AsyncSession, hashed_token: str) -> Optional[RefreshToken]:
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.hashedToken == hashed_token).with_for_update()
    )
    return result.scalar_one_or_none()

async def create(db: AsyncSession, user_id: UUID, hashed_token: str, expires_in_days: int = 7) -> RefreshToken:
    db_token = RefreshToken(
        userId=user_id,
        hashedToken=hashed_token,
        expiresAt=datetime.now(timezone.utc) + timedelta(days=expires_in_days),
        createdAt=datetime.now(timezone.utc),
        familyId=uuid4()
    )
    db.add(db_token)
    await db.flush()
    return db_token

async def create_replacement(db: AsyncSession, old_token: RefreshToken, new_hashed_token: str, expires_in_days: int = 7) -> RefreshToken:
    new_token = RefreshToken(
        userId=old_token.userId,
        hashedToken=new_hashed_token,
        expiresAt=datetime.now(timezone.utc) + timedelta(days=expires_in_days),
        createdAt=datetime.now(timezone.utc),
        familyId=old_token.familyId
    )
    db.add(new_token)
    await db.flush()
    
    old_token.revokedAt = datetime.now(timezone.utc)
    old_token.replacedBy = new_token.id
    await db.flush()
    
    return new_token

async def revoke_family(db: AsyncSession, family_id: UUID) -> None:
    # Revoke all tokens in the family that haven't been revoked yet
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.familyId == family_id)
        .where(RefreshToken.revokedAt.is_(None))
        .values(revokedAt=datetime.now(timezone.utc))
    )
    await db.flush()

async def revoke_token(db: AsyncSession, hashed_token: str) -> None:
    token = await get_by_hashed_token_for_update(db, hashed_token)
    if token and not token.revokedAt:
        token.revokedAt = datetime.now(timezone.utc)
        await db.flush()

async def revoke_all_for_user(db: AsyncSession, user_id: UUID) -> None:
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.userId == user_id)
        .where(RefreshToken.revokedAt.is_(None))
        .values(revokedAt=datetime.now(timezone.utc))
    )
    await db.flush()
