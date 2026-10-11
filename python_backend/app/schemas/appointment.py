from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models import AppointmentStatus

class AppointmentBase(BaseModel):
    patientId: Optional[UUID] = None
    doctorId: Optional[UUID] = None
    treatment: str = Field(..., max_length=200)
    guestName: Optional[str] = None
    guestPhone: Optional[str] = None
    guestEmail: Optional[str] = None
    startsAt: datetime
    endsAt: datetime

class ManualPatientCreate(BaseModel):
    fullName: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    email: Optional[str] = Field(None, max_length=100)

class AppointmentCreate(AppointmentBase):
    patient: Optional[ManualPatientCreate] = None
    model_config = ConfigDict(extra="forbid")
    pass

class AppointmentNoteCreate(BaseModel):
    note: str = Field(..., min_length=1, max_length=5000)
    model_config = ConfigDict(extra="forbid")

class NoteAuthorResponse(BaseModel):
    id: UUID
    email: str
    role: str
    model_config = ConfigDict(from_attributes=True)

class AppointmentNoteResponse(BaseModel):
    id: UUID
    appointmentId: UUID
    authorId: UUID
    note: str
    createdAt: datetime
    author: Optional[NoteAuthorResponse] = None
    
    model_config = ConfigDict(from_attributes=True)

class AppointmentResponse(AppointmentBase):
    id: UUID
    status: AppointmentStatus
    cancellationReason: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    patient: Optional['PatientLookupResponse'] = None

    model_config = ConfigDict(from_attributes=True)

class AppointmentDetailResponse(AppointmentResponse):
    notes: List[AppointmentNoteResponse] = []

class AppointmentUpdateStatus(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: AppointmentStatus
    cancellationReason: Optional[str] = Field(None, max_length=1000)

class AppointmentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    startsAt: Optional[datetime] = None
    endsAt: Optional[datetime] = None
    doctorId: Optional[UUID] = None
    treatment: Optional[str] = None

class PatientLookupResponse(BaseModel):
    id: UUID
    displayId: str
    fullName: str
    phone: str
    email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DoctorLookupResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)

class AppointmentListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    data: List[AppointmentResponse]
    effectiveStartDate: Optional[datetime] = None
    effectiveEndDate: Optional[datetime] = None
    effectiveStartDateStr: Optional[str] = None
    effectiveEndDateStr: Optional[str] = None

