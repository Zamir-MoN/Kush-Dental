from pydantic import BaseModel, ConfigDict, Field, model_validator
from uuid import UUID
from datetime import datetime
from typing import Optional, Any
from app.models import LeadStatus, Priority, Source, LeadQualification
from app.schemas.appointment import PatientLookupResponse

class LeadBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=1, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    desiredTreatment: Optional[str] = Field(None, max_length=200)
    notes: Optional[str] = Field(None, max_length=5000)

class LeadCreate(LeadBase):
    model_config = ConfigDict(extra="forbid")
    idempotencyKey: Optional[UUID] = None
    payloadFingerprint: Optional[str] = None
    priority: Optional[Priority] = Priority.NORMAL
    source: Optional[Source] = Source.INQUIRY

class PublicLeadCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20, pattern=r"^\+?[\d\s\-\(\)]+$")
    email: Optional[str] = Field(None, max_length=100, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    desiredTreatment: Optional[str] = Field(None, max_length=200)
    website_url: Optional[str] = Field(None, max_length=500)
    captcha_token: Optional[str] = None
    startsAt: Optional[datetime] = None
    endsAt: Optional[datetime] = None

class PublicUrgentVisitCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20, pattern=r"^\+?[\d\s\-\(\)]+$")
    email: str = Field(..., max_length=100, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    problemDescription: str = Field(..., min_length=5, max_length=5000)
    startedWhen: Optional[str] = Field(None, max_length=200)
    preferredContactMethod: Optional[str] = Field(None, max_length=50)
    website_url: Optional[str] = Field(None, max_length=500)
    captcha_token: Optional[str] = None

class PublicLeadResponse(BaseModel):
    success: bool
    message: str

class LeadUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=1, max_length=20)
    email: Optional[str] = None
    desiredTreatment: Optional[str] = Field(None, max_length=200)
    status: Optional[LeadStatus] = None
    priority: Optional[Priority] = None
    source: Optional[Source] = None
    notes: Optional[str] = None
    leadQualification: Optional[LeadQualification] = None
    negativeReason: Optional[str] = Field(None, max_length=1000)

    @model_validator(mode='after')
    def validate_qualification(self) -> 'LeadUpdate':
        if self.leadQualification == LeadQualification.NEGATIVE:
            if not self.negativeReason or not self.negativeReason.strip():
                raise ValueError("negativeReason is required when lead is marked NEGATIVE")
        elif self.leadQualification in (LeadQualification.POSITIVE, LeadQualification.UNREVIEWED):
            self.negativeReason = None
        return self

class LeadResponse(LeadBase):
    id: UUID
    status: LeadStatus
    priority: Priority
    source: Source
    createdAt: datetime
    updatedAt: datetime
    deletedAt: Optional[datetime] = None
    leadQualification: LeadQualification
    negativeReason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class LeadDetailResponse(LeadResponse):
    existingPatient: Optional[PatientLookupResponse] = None
