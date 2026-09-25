from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
import secrets
from uuid import UUID
from app.core.config import settings
from app.db.session import get_db
from app.models import User, Role
from app.repositories import user_repo
from app.utils.security import decode_access_token

security = HTTPBearer(auto_error=False)

async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = await user_repo.get_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    return user

def require_roles(allowed_roles: list[Role]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        return current_user
    return role_checker

async def verify_csrf_token(request: Request):
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        return
        
    csrf_cookie = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("x-csrf-token")
    
    if not csrf_cookie or not csrf_header:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token missing")
        
    if not secrets.compare_digest(csrf_cookie, csrf_header):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token mismatch")
        
    # Origin validation as defense-in-depth
    origin = request.headers.get("origin")
    if origin and origin != settings.CORS_ORIGIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Origin")

async def verify_body_size(request: Request):
    # Check Content-Length first
    cl = request.headers.get('content-length')
    if cl and int(cl) > settings.MAX_REQUEST_BODY_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Payload Too Large")
    
    # Check actual body size while streaming to prevent Content-Length spoofing
    body_bytes = b""
    async for chunk in request.stream():
        body_bytes += chunk
        if len(body_bytes) > settings.MAX_REQUEST_BODY_SIZE:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Payload Too Large")
    # Store for FastAPI to use
    request._body = body_bytes
