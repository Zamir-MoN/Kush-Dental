from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Union, Any

class DXGenImage(BaseModel):
    id: Optional[str] = None
    url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    model: Optional[str] = None
    provider: Optional[str] = None
    prompt: Optional[str] = None
    style: Optional[str] = None
    aspectRatio: Optional[str] = None
    generationTimeMs: Optional[int] = None
    createdAt: Optional[str] = None

class DXGenGenerateRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

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
    # New Image Parameters:
    includeImage: Optional[bool] = Field(False, description="Whether to generate an accompanying AI image")
    imageStyle: Optional[str] = Field("Commercial Photography", description="Visual style (e.g. Commercial Photography, Realistic, Minimal)")
    imageAspectRatio: Optional[str] = Field("16:9", description="Aspect ratio (16:9, 1:1, 4:5, 9:16)")
    imageModel: Optional[str] = Field("flux-schnell", description="Image model")

class DXGenImageGenerateRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    prompt: str = Field(..., min_length=3, max_length=1000)
    model: Optional[str] = "flux-schnell"
    style: Optional[str] = "Commercial Photography"
    aspectRatio: Optional[str] = "16:9"
    negativePrompt: Optional[str] = None

class DXGenImageResponse(BaseModel):
    success: Optional[bool] = None
    image: Optional[DXGenImage] = None

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
    image: Optional[DXGenImage] = None
    usage: Optional[DXGenUsage] = None
