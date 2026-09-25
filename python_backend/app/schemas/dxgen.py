from pydantic import BaseModel, Field, constr
from typing import Optional, List, Union, Any

class DXGenGenerateRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500)
    contentType: Optional[str] = Field(None, max_length=100)
    platform: Optional[str] = Field(None, max_length=100)
    tone: Optional[str] = Field(None, max_length=100)
    customTone: Optional[str] = Field(None, max_length=500)
    length: Optional[Union[int, str]] = None
    language: Optional[str] = Field(None, max_length=50)
    keywords: Optional[List[str]] = None
    audience: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=100)
    customInstructions: Optional[str] = Field(None, max_length=1000)
    seo: Optional[Any] = None

    class Config:
        extra = "ignore"

class DXGenHealthResponse(BaseModel):
    status: Optional[str] = None
    service: Optional[str] = None
    version: Optional[str] = None
    database: Optional[str] = None
    aiModel: Optional[str] = None

class DXGenContent(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    slug: Optional[str] = None
    keywords: Optional[List[str]] = None
    faq: Optional[Any] = None
    hashtags: Optional[List[str]] = None
    cta: Optional[str] = None
    wordCount: Optional[int] = None
    readingTimeMinutes: Optional[int] = None

class DXGenUsage(BaseModel):
    model: Optional[str] = None
    inputTokens: Optional[int] = None
    outputTokens: Optional[int] = None
    generationTimeMs: Optional[int] = None
    promptTokens: Optional[int] = None
    completionTokens: Optional[int] = None
    totalTokens: Optional[int] = None
    creditsUsed: Optional[float] = None

class DXGenGenerateResponse(BaseModel):
    success: Optional[bool] = None
    requestId: Optional[str] = None
    contentId: Optional[str] = None
    content: Optional[DXGenContent] = None
    usage: Optional[DXGenUsage] = None
