from pydantic import BaseModel, constr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models import BlogStatus

class BlogBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    excerpt: Optional[str] = Field(default=None, max_length=1000)
    content: str = Field(min_length=1)
    coverImage: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=255, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    excerpt: Optional[str] = Field(default=None, max_length=1000)
    content: Optional[str] = Field(default=None, min_length=1)
    coverImage: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class BlogResponse(BlogBase):
    id: UUID
    authorId: UUID
    status: BlogStatus
    publishedAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
