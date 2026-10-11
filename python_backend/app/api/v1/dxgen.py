from fastapi import APIRouter, Depends, status
from typing import Any
import logging

from app.models import Role, User, AuditResult
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.audit_repo import log_event
from app.api.dependencies import require_roles
from app.api.rate_limiter import check_dxgen_rate_limit
from app.schemas.dxgen import (
    DXGenGenerateRequest,
    DXGenGenerateResponse,
    DXGenHealthResponse,
    DXGenUsage,
    DXGenImageGenerateRequest,
    DXGenImageResponse,
)
from app.services import dxgen_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_universal(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR])),
    _: None = Depends(check_dxgen_rate_limit),
    db: AsyncSession = Depends(get_db)
):
    """Generate generic content using AI. DOCTOR only."""
    return await dxgen_service.generate(request)

@router.post("/generate/blog", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_blog(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR])),
    _: None = Depends(check_dxgen_rate_limit),
    db: AsyncSession = Depends(get_db)
):
    """Generate blog content using AI. DOCTOR only."""
    res =     await dxgen_service.generate_blog(request)
    await log_event(db, "DXGEN_BLOG", "DXGen", AuditResult.SUCCESS, actor_id=user.id)
    await db.commit()
    return res

@router.post("/generate/social", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_social(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR])),
    _: None = Depends(check_dxgen_rate_limit),
    db: AsyncSession = Depends(get_db)
):
    """Generate social media content using AI. DOCTOR only."""
    res =     await dxgen_service.generate_social(request)
    await log_event(db, "DXGEN_SOCIAL", "DXGen", AuditResult.SUCCESS, actor_id=user.id)
    await db.commit()
    return res

@router.post("/generate/business", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_business(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR])),
    _: None = Depends(check_dxgen_rate_limit),
    db: AsyncSession = Depends(get_db)
):
    """Generate business content using AI. DOCTOR only."""
    res =     await dxgen_service.generate_business(request)
    await log_event(db, "DXGEN_BUSINESS", "DXGen", AuditResult.SUCCESS, actor_id=user.id)
    await db.commit()
    return res

@router.get("/content/{content_id}", response_model=DXGenGenerateResponse)
async def get_content(
    content_id: str,
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Fetch previously generated content. DOCTOR only."""
    return await dxgen_service.get_content(content_id)

@router.get("/usage", response_model=Any)
async def get_usage(
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Fetch usage stats. DOCTOR only."""
    return await dxgen_service.get_usage()

@router.get("/health", response_model=DXGenHealthResponse)
async def get_health(
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Check DXGen API health. DOCTOR only."""
    return await dxgen_service.get_health()

@router.post("/images/generate", response_model=DXGenImageResponse, status_code=status.HTTP_200_OK)
async def generate_image(
    request: DXGenImageGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR, Role.ADMIN])),
    _: None = Depends(check_dxgen_rate_limit),
    db: AsyncSession = Depends(get_db)
):
    """Generate an AI image using Pixazo / FLUX. DOCTOR or ADMIN only."""
    res =     await dxgen_service.generate_image(request)
    await log_event(db, "DXGEN_IMAGE", "DXGen", AuditResult.SUCCESS, actor_id=user.id)
    await db.commit()
    return res

@router.post("/images/from-content/{content_id}", response_model=DXGenImageResponse, status_code=status.HTTP_200_OK)
async def generate_image_from_content(
    content_id: str,
    style: str = "Commercial Photography",
    user: User = Depends(require_roles([Role.DOCTOR, Role.ADMIN])),
    _: None = Depends(check_dxgen_rate_limit),
    db: AsyncSession = Depends(get_db)
):
    """Generate an AI image from existing content. DOCTOR or ADMIN only."""
    res =     await dxgen_service.generate_image_from_content(content_id, style=style)
    await log_event(db, "DXGEN_IMAGE_FROM_CONTENT", "DXGen", AuditResult.SUCCESS, actor_id=user.id)
    await db.commit()
    return res

