import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models import Blog, BlogStatus, LeadStatus
from app.schemas.lead import PublicLeadCreate, PublicLeadResponse, LeadCreate
from app.schemas.blog import BlogResponse
from app.services import lead_service
from app.api.rate_limiter import check_public_lead_rate_limit
from app.api.dependencies import verify_body_size

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/leads",
    response_model=PublicLeadResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(check_public_lead_rate_limit), Depends(verify_body_size)]
)
async def create_public_lead(
    lead_data: PublicLeadCreate,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db)
):
    import uuid
    try:
        uuid_obj = uuid.UUID(idempotency_key)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Idempotency-Key format. Must be a UUID.")
        
    try:
        # Process the booking atomically (creates Patient, Lead, Appointment)
        from app.services.public_booking_service import process_public_booking
        await process_public_booking(db, lead_data, str(uuid_obj))
        
        return PublicLeadResponse(
            success=True,
            message="Your appointment request has been received."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating public lead/booking: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit appointment request")

@router.get("/blog", response_model=List[BlogResponse])
async def list_public_blogs(
    db: AsyncSession = Depends(get_db)
):
    """List published blogs for the public website."""
    result = await db.execute(
        select(Blog)
        .where(Blog.deletedAt.is_(None), Blog.status == BlogStatus.PUBLISHED)
        .order_by(Blog.publishedAt.desc().nullslast())
    )
    return result.scalars().all()

@router.get("/blog/{slug}", response_model=BlogResponse)
async def get_public_blog(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific published blog by slug."""
    result = await db.execute(
        select(Blog)
        .where(Blog.slug == slug, Blog.deletedAt.is_(None), Blog.status == BlogStatus.PUBLISHED)
    )
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog
