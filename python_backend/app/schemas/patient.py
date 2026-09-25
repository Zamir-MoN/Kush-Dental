from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class PatientBase(BaseModel):
    fullName: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=10)
    email: Optional[EmailStr] = None

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: UUID
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)

class PatientUpdate(BaseModel):
    fullName: Optional[str] = Field(None, min_length=1)
    phone: Optional[str] = Field(None, min_length=10)
    email: Optional[EmailStr] = None

from app.schemas.appointment import PatientLookupResponse

class PatientSearchResponse(BaseModel):
    total: int
    skip: int
    limit: int
    data: List[PatientLookupResponse]
