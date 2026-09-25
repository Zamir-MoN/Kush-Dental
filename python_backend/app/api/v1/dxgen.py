from fastapi import APIRouter, Depends, status
from typing import Any
import logging

from app.models import Role, User
from app.api.dependencies import require_roles
from app.schemas.dxgen import DXGenGenerateRequest, DXGenGenerateResponse, DXGenHealthResponse, DXGenUsage
from app.services import dxgen_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_universal(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Generate generic content using AI. DOCTOR only."""
    return await dxgen_service.generate(request)

@router.post("/generate/blog", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_blog(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Generate blog content using AI. DOCTOR only."""
    return await dxgen_service.generate_blog(request)

@router.post("/generate/social", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_social(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Generate social media content using AI. DOCTOR only."""
    return await dxgen_service.generate_social(request)

@router.post("/generate/business", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_business(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Generate business content using AI. DOCTOR only."""
    return await dxgen_service.generate_business(request)

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
