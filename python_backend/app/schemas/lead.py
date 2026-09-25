from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models import LeadStatus

class LeadBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=1, max_length=20)
    email: Optional[str] = None
    desiredTreatment: Optional[str] = Field(None, max_length=200)
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    idempotencyKey: Optional[UUID] = None
    payloadFingerprint: Optional[str] = None

class PublicLeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, pattern=r"^[A-Za-z\s\-\']+$")
    phone: str = Field(..., min_length=7, max_length=20, pattern=r"^\+?[\d\s\-\(\)]+$")
    email: Optional[str] = Field(None, max_length=100, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    desiredTreatment: Optional[str] = Field(None, max_length=200)
    startsAt: Optional[datetime] = None
    endsAt: Optional[datetime] = None

class PublicLeadResponse(BaseModel):
    success: bool
    message: str

class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=1, max_length=20)
    email: Optional[str] = None
    desiredTreatment: Optional[str] = Field(None, max_length=200)
    status: Optional[LeadStatus] = None
    notes: Optional[str] = None

class LeadResponse(LeadBase):
    id: UUID
    status: LeadStatus
    createdAt: datetime
    updatedAt: datetime
    deletedAt: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
