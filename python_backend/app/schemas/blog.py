from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models import BlogStatus

def validate_url_scheme(v: Optional[str]) -> Optional[str]:
    if v:
        v_stripped = v.strip()
        lower_v = v_stripped.lower()
        if not (lower_v.startswith('http://') or lower_v.startswith('https://')):
            raise ValueError("URL must start with http:// or https://")
        return v_stripped
    return v

class BlogBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    excerpt: Optional[str] = Field(default=None, max_length=1000)
    content: str = Field(min_length=1)
    coverImage: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

    @field_validator('coverImage', mode='before')
    @classmethod
    def validate_cover_image(cls, v):
        return validate_url_scheme(v)

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

    @field_validator('coverImage', mode='before')
    @classmethod
    def validate_cover_image(cls, v):
        return validate_url_scheme(v)

class BlogResponse(BlogBase):
    id: UUID
    authorId: UUID
    status: BlogStatus
    publishedAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
