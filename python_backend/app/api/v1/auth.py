import secrets
from fastapi import APIRouter, Depends, Response, Request, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import verify_csrf_token, get_current_user
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services import auth_service
from app.models import User

from app.api.rate_limiter import check_login_rate_limit, record_login_failure, record_login_success
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=TokenResponse, dependencies=[Depends(check_login_rate_limit)])
async def login(
    request: Request,
    login_req: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    try:
        token_resp, raw_refresh_token = await auth_service.authenticate_user(db, login_req)
        record_login_success(request)
    except HTTPException as e:
        record_login_failure(request)
        raise e
    
    # Set Refresh Token HttpOnly Cookie
    response.set_cookie(
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/v1/auth"
    )
    
    # Set CSRF Token Cookie (stateless double-submit)
    csrf_token = secrets.token_urlsafe(32)
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/"
    )
    
    return token_resp

@router.post("/refresh", response_model=TokenResponse, dependencies=[Depends(verify_csrf_token)])
async def refresh(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    raw_refresh_token = request.cookies.get("refresh_token")
    if not raw_refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
        
    token_resp, new_raw_refresh_token = await auth_service.refresh_session(db, raw_refresh_token)
    
    response.set_cookie(
        key="refresh_token",
        value=new_raw_refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/v1/auth"
    )
    
    return token_resp

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(verify_csrf_token), Depends(get_current_user)])
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    raw_refresh_token = request.cookies.get("refresh_token")
    if raw_refresh_token:
        await auth_service.logout_user(db, raw_refresh_token)
        
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth",
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite="lax"
    )
    
    response.delete_cookie(
        key="csrf_token",
        path="/",
        secure=settings.COOKIE_SECURE,
        httponly=False,
        samesite="lax"
    )
    
    return None
