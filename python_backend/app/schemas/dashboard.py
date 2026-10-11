from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.models import AppointmentStatus, LeadStatus

class DashboardPatient(BaseModel):
    id: UUID
    fullName: str
    phone: str

    model_config = ConfigDict(from_attributes=True)

class DashboardDoctor(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)

class DashboardAppointment(BaseModel):
    id: UUID
    startsAt: datetime
    endsAt: datetime
    treatment: str
    status: AppointmentStatus
    patient: Optional[DashboardPatient] = None
    guestName: Optional[str] = None
    guestPhone: Optional[str] = None
    guestEmail: Optional[str] = None
    doctor: Optional[DashboardDoctor] = None

    model_config = ConfigDict(from_attributes=True)

class DashboardLead(BaseModel):
    id: UUID
    name: str
    phone: str
    desiredTreatment: Optional[str] = None
    status: LeadStatus
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)

class DashboardSummary(BaseModel):
    todayAppointments: int
    requestedAppointments: int
    confirmedToday: int
    newLeads: int
    openFollowUps: int
    inProgressFollowUps: int
    urgentVisits: int
    totalAppointments: Optional[int] = 0
    totalConfirmed: Optional[int] = 0
    totalCompleted: Optional[int] = 0

class DashboardResponse(BaseModel):
    summary: DashboardSummary
    todayAppointments: List[DashboardAppointment]
    requestedAppointments: List[DashboardAppointment]
    upcomingAppointments: List[DashboardAppointment]
    recentAppointments: Optional[List[DashboardAppointment]] = []
    recentLeads: List[DashboardLead]
    effectiveDate: datetime
    effectiveDateStr: str
