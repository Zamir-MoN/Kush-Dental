from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from typing import List
import uuid
from datetime import datetime, timezone
import logging

from app.db.session import get_db
from app.models import Blog, BlogStatus, Role, AuditResult, User
from app.schemas.blog import BlogCreate, BlogUpdate, BlogResponse
from app.schemas.dxgen import DXGenGenerateRequest, DXGenGenerateResponse
from app.api.dependencies import require_roles
from app.utils.sanitization import sanitize_html
from app.repositories.audit_repo import log_event
from app.services.dxgen_service import generate_blog as dxgen_generate_blog

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate", response_model=DXGenGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_blog_draft(
    request: DXGenGenerateRequest,
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Generate a blog post draft using AI. DOCTOR only."""
    return await dxgen_generate_blog(request)

@router.get("", response_model=List[BlogResponse])
async def list_blogs(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """List all blogs (Draft & Published). DOCTOR only."""
    result = await db.execute(
        select(Blog).where(Blog.deletedAt.is_(None)).order_by(Blog.createdAt.desc())
    )
    return result.scalars().all()

@router.get("/{id}", response_model=BlogResponse)
async def get_blog(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Get a specific blog by ID."""
    result = await db.execute(select(Blog).where(Blog.id == id, Blog.deletedAt.is_(None)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
async def create_blog(
    blog_in: BlogCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Create a new blog post as DRAFT."""
    # Check duplicate slug
    existing = await db.execute(select(Blog).where(Blog.slug == blog_in.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")

    sanitized_content = sanitize_html(blog_in.content)

    new_blog = Blog(
        title=blog_in.title,
        slug=blog_in.slug,
        excerpt=blog_in.excerpt,
        content=sanitized_content,
        coverImage=blog_in.coverImage,
        authorId=user.id,
        status=BlogStatus.DRAFT,
        updatedAt=datetime.now(timezone.utc),
    )
    db.add(new_blog)
    try:
        await db.commit()
        await db.refresh(new_blog)
        await log_event(db, "BLOG_CREATED", "Blog", AuditResult.SUCCESS, user.id, new_blog.id)
        return new_blog
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating blog: {e}")
        await log_event(db, "BLOG_CREATED", "Blog", AuditResult.FAILURE, user.id, None)
        raise HTTPException(status_code=500, detail="Failed to create blog post")

@router.patch("/{id}", response_model=BlogResponse)
async def update_blog(
    id: uuid.UUID,
    blog_in: BlogUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Update a blog post."""
    result = await db.execute(select(Blog).where(Blog.id == id, Blog.deletedAt.is_(None)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")

    if blog_in.slug and blog_in.slug != blog.slug:
        existing = await db.execute(select(Blog).where(Blog.slug == blog_in.slug))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Slug already exists")

    update_data = blog_in.model_dump(exclude_unset=True)
    if 'content' in update_data:
        update_data['content'] = sanitize_html(update_data['content'])

    update_data['updatedAt'] = datetime.now(timezone.utc)

    for key, value in update_data.items():
        setattr(blog, key, value)

    try:
        await db.commit()
        await db.refresh(blog)
        await log_event(db, "BLOG_UPDATED", "Blog", AuditResult.SUCCESS, user.id, blog.id)
        return blog
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating blog: {e}")
        await log_event(db, "BLOG_UPDATED", "Blog", AuditResult.FAILURE, user.id, blog.id)
        raise HTTPException(status_code=500, detail="Failed to update blog post")

@router.post("/{id}/publish", response_model=BlogResponse)
async def publish_blog(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Publish a blog post."""
    result = await db.execute(select(Blog).where(Blog.id == id, Blog.deletedAt.is_(None)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")

    if blog.status == BlogStatus.PUBLISHED:
        return blog

    blog.status = BlogStatus.PUBLISHED
    blog.publishedAt = datetime.now(timezone.utc)
    blog.updatedAt = datetime.now(timezone.utc)

    try:
        await db.commit()
        await db.refresh(blog)
        await log_event(db, "BLOG_PUBLISHED", "Blog", AuditResult.SUCCESS, user.id, blog.id)
        return blog
    except Exception as e:
        await db.rollback()
        logger.error(f"Error publishing blog: {e}")
        await log_event(db, "BLOG_PUBLISHED", "Blog", AuditResult.FAILURE, user.id, blog.id)
        raise HTTPException(status_code=500, detail="Failed to publish blog post")

@router.post("/{id}/unpublish", response_model=BlogResponse)
async def unpublish_blog(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Unpublish a blog post (set to DRAFT)."""
    result = await db.execute(select(Blog).where(Blog.id == id, Blog.deletedAt.is_(None)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")

    if blog.status == BlogStatus.DRAFT:
        return blog

    blog.status = BlogStatus.DRAFT
    blog.updatedAt = datetime.now(timezone.utc)
    # We do not clear publishedAt to preserve the history of when it was originally published, 
    # but the status DRAFT will hide it from the public API.

    try:
        await db.commit()
        await db.refresh(blog)
        await log_event(db, "BLOG_UNPUBLISHED", "Blog", AuditResult.SUCCESS, user.id, blog.id)
        return blog
    except Exception as e:
        await db.rollback()
        logger.error(f"Error unpublishing blog: {e}")
        await log_event(db, "BLOG_UNPUBLISHED", "Blog", AuditResult.FAILURE, user.id, blog.id)
        raise HTTPException(status_code=500, detail="Failed to unpublish blog post")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles([Role.DOCTOR]))
):
    """Soft delete a blog post."""
    result = await db.execute(select(Blog).where(Blog.id == id, Blog.deletedAt.is_(None)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")

    blog.deletedAt = datetime.now(timezone.utc)
    
    try:
        await db.commit()
        await log_event(db, "BLOG_DELETED", "Blog", AuditResult.SUCCESS, user.id, blog.id)
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting blog: {e}")
        await log_event(db, "BLOG_DELETED", "Blog", AuditResult.FAILURE, user.id, blog.id)
        raise HTTPException(status_code=500, detail="Failed to delete blog post")
