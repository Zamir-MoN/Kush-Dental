from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from uuid import UUID
from datetime import datetime, timezone
from app.models import Role, AuditResult
from app.repositories import user_repo, refresh_token_repo, audit_repo
from app.schemas.user import UserUpdate, UserResponse

async def update_user(db: AsyncSession, user_id: UUID, update_data: UserUpdate, actor_id: UUID) -> UserResponse:
    try:
        user = await user_repo.get_by_id(db, user_id)
        if not user or user.deletedAt:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
        if update_data.role and update_data.role == Role.STAFF and user_id == actor_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot downgrade own role to STAFF")

        if update_data.email and update_data.email != user.email:
            existing = await user_repo.get_by_email(db, update_data.email)
            if existing and existing.id != user_id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
            user.email = update_data.email

        if update_data.role:
            user.role = update_data.role

        user.updatedAt = datetime.now(timezone.utc)
        
        await audit_repo.log_event(db, "USER_UPDATED", "User", AuditResult.SUCCESS, actor_id=actor_id, resource_id=user.id)
        await db.commit()
        
        return UserResponse.model_validate(user)
    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise e

async def deactivate_user(db: AsyncSession, user_id: UUID, actor_id: UUID) -> None:
    if user_id == actor_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot deactivate own account")

    try:
        user = await user_repo.get_by_id(db, user_id)
        if not user or user.deletedAt:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user.deletedAt = datetime.now(timezone.utc)
        user.updatedAt = datetime.now(timezone.utc)
        await db.flush()

        await refresh_token_repo.revoke_all_for_user(db, user_id)
        
        await audit_repo.log_event(db, "USER_DEACTIVATED", "User", AuditResult.SUCCESS, actor_id=actor_id, resource_id=user.id)
        
        await db.commit()
    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise e
