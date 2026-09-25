import secrets
import hashlib
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from typing import Tuple
from datetime import datetime, timezone
from app.models import User, Role, AuditResult
from app.repositories import user_repo, refresh_token_repo, audit_repo
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.utils.security import verify_password, get_password_hash, check_needs_rehash, create_access_token

async def authenticate_user(db: AsyncSession, login_req: LoginRequest) -> Tuple[TokenResponse, str]:
    try:
        user = await user_repo.get_by_email(db, login_req.email)
        if not user:
            await audit_repo.log_event(db, "LOGIN", "User", AuditResult.FAILURE, metadata_={"email": login_req.email})
            await db.commit()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
        if user.role == Role.ADMIN:
            await audit_repo.log_event(db, "LOGIN", "User", AuditResult.FAILURE, actor_id=user.id, metadata_={"reason": "ADMIN_LOGIN_UNSUPPORTED"})
            await db.commit()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not verify_password(login_req.password, user.passwordHash):
            await audit_repo.log_event(db, "LOGIN", "User", AuditResult.FAILURE, actor_id=user.id, metadata_={"reason": "INVALID_PASSWORD"})
            await db.commit()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            
        if check_needs_rehash(user.passwordHash):
            user.passwordHash = get_password_hash(login_req.password)
            await db.flush()

        access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
        
        raw_refresh_token = secrets.token_urlsafe(32)
        hashed_refresh_token = hashlib.sha256(raw_refresh_token.encode()).hexdigest()
        
        await refresh_token_repo.create(db, user.id, hashed_refresh_token)
        
        await audit_repo.log_event(db, "LOGIN", "User", AuditResult.SUCCESS, actor_id=user.id)
        await db.commit()
        
        token_resp = TokenResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )
        return token_resp, raw_refresh_token
        
    except Exception as e:
        await db.rollback()
        raise e

async def refresh_session(db: AsyncSession, raw_refresh_token: str) -> Tuple[TokenResponse, str]:
    hashed_refresh_token = hashlib.sha256(raw_refresh_token.encode()).hexdigest()
    
    try:
        token_record = await refresh_token_repo.get_by_hashed_token_for_update(db, hashed_refresh_token)
        
        if not token_record:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            
        if token_record.expiresAt < datetime.now(timezone.utc):
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
            
        if token_record.revokedAt:
            # Token reuse detected! Revoke the whole family.
            await refresh_token_repo.revoke_family(db, token_record.familyId)
            await db.commit()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            
        # Valid token, proceed with rotation
        new_raw_refresh_token = secrets.token_urlsafe(32)
        new_hashed_refresh_token = hashlib.sha256(new_raw_refresh_token.encode()).hexdigest()
        
        await refresh_token_repo.create_replacement(db, token_record, new_hashed_refresh_token)
        
        user = await user_repo.get_by_id(db, token_record.userId)
        if not user:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
            
        access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
        
        await db.commit()
        
        token_resp = TokenResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )
        return token_resp, new_raw_refresh_token
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise e

async def logout_user(db: AsyncSession, raw_refresh_token: str) -> None:
    if not raw_refresh_token:
        return
        
    hashed_refresh_token = hashlib.sha256(raw_refresh_token.encode()).hexdigest()
    
    try:
        await refresh_token_repo.revoke_token(db, hashed_refresh_token)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise e
