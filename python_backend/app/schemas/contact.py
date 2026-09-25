from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models import ContactStatus

class ContactPatient(BaseModel):
    id: UUID
    fullName: str
    phone: str

class ContactLead(BaseModel):
    id: UUID
    status: str
    desiredTreatment: Optional[str] = None

class ContactAppointment(BaseModel):
    id: UUID
    status: str
    startsAt: datetime

class ContactBase(BaseModel):
    patientId: Optional[UUID] = None
    leadId: Optional[UUID] = None
    appointmentId: Optional[UUID] = None
    status: ContactStatus = ContactStatus.OPEN
    notes: Optional[str] = None
    outcome: Optional[str] = None
    nextFollowUpAt: Optional[datetime] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    notes: Optional[str] = None
    outcome: Optional[str] = None
    nextFollowUpAt: Optional[datetime] = None

    model_config = ConfigDict(extra='forbid')

class ContactUpdateStatus(BaseModel):
    status: ContactStatus
    outcome: Optional[str] = None

class ContactResponse(ContactBase):
    id: UUID
    createdAt: datetime
    updatedAt: datetime
    deletedAt: Optional[datetime] = None

    patient: Optional[ContactPatient] = None
    lead: Optional[ContactLead] = None
    appointment: Optional[ContactAppointment] = None

    model_config = ConfigDict(from_attributes=True)

class ContactListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    data: list[ContactResponse]
