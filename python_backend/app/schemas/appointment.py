from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models import AppointmentStatus

class AppointmentBase(BaseModel):
    patientId: UUID
    doctorId: Optional[UUID] = None
    treatment: str
    startsAt: datetime
    endsAt: datetime

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: UUID
    status: AppointmentStatus
    cancellationReason: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)

class AppointmentUpdateStatus(BaseModel):
    status: AppointmentStatus
    cancellationReason: Optional[str] = None

class AppointmentUpdate(BaseModel):
    startsAt: Optional[datetime] = None
    endsAt: Optional[datetime] = None
    doctorId: Optional[UUID] = None
    treatment: Optional[str] = None

class PatientLookupResponse(BaseModel):
    id: UUID
    fullName: str
    phone: str
    email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DoctorLookupResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)

