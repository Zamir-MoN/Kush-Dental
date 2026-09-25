from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.db.session import get_db
from app.schemas.appointment import (
    AppointmentCreate, 
    AppointmentUpdateStatus, 
    AppointmentUpdate,
    AppointmentResponse,
    PatientLookupResponse,
    DoctorLookupResponse
)
from app.models import Role, User, AppointmentStatus
from app.repositories import appointment_repo, patient_repo, user_repo
from app.services import appointment_service
from app.api.dependencies import require_roles, verify_csrf_token

router = APIRouter()

# STAFF MUST NOT: CONFIRMED -> COMPLETED, CONFIRMED -> NO_SHOW, modify treatment, create treatment, modify clinical information.
# DOCTOR has full access.

@router.get("/patient-lookup", response_model=PatientLookupResponse)
async def patient_lookup(
    phone: str,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    patient = await patient_repo.get_by_phone(db, phone)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return patient

@router.get("/doctors", response_model=List[DoctorLookupResponse])
async def list_doctors(
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    doctors = await user_repo.get_doctors(db)
    return [{"id": d.id, "name": d.email.split('@')[0]} for d in doctors] # assuming name mapping for now, actually better to just return email as name if no name exists or we could query profile if we had one. But schema wants name.

@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_csrf_token)])
async def create_appointment(
    apt_in: AppointmentCreate,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    try:
        apt = await appointment_service.create_appointment(db, apt_in, current_user.id)
        await db.commit()
        return apt
    except Exception as e:
        await db.rollback()
        raise e

@router.get("/{apt_id}", response_model=AppointmentResponse)
async def get_appointment(
    apt_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    apt = await appointment_repo.get_by_id(db, apt_id)
    if not apt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    return apt

@router.patch("/{apt_id}", response_model=AppointmentResponse, dependencies=[Depends(verify_csrf_token)])
async def update_appointment(
    apt_id: UUID,
    apt_update: AppointmentUpdate,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role == Role.STAFF and apt_update.treatment is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff cannot modify treatment")
        
    try:
        apt = await appointment_service.update_appointment(db, apt_id, apt_update, current_user.id)
        await db.commit()
        return apt
    except Exception as e:
        await db.rollback()
        raise e

@router.get("", response_model=List[AppointmentResponse])
async def list_appointments(
    skip: int = 0,
    limit: int = 100,
    startDate: Optional[datetime] = None,
    endDate: Optional[datetime] = None,
    doctorId: Optional[UUID] = None,
    patientId: Optional[UUID] = None,
    orderDesc: bool = False,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    if patientId and current_user.role == Role.STAFF:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff cannot access patient appointment history")
        
    if startDate and endDate and startDate >= endDate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="startDate must be before endDate")
        
    return await appointment_repo.get_all(
        db, 
        skip=skip, 
        limit=limit, 
        start_date=startDate, 
        end_date=endDate, 
        doctor_id=doctorId,
        patient_id=patientId,
        order_desc=orderDesc
    )

@router.patch("/{apt_id}/status", response_model=AppointmentResponse, dependencies=[Depends(verify_csrf_token)])
async def update_appointment_status(
    apt_id: UUID,
    status_update: AppointmentUpdateStatus,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    # Enforce STAFF restrictions
    if current_user.role == Role.STAFF:
        if status_update.status in (AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff cannot transition to COMPLETED or NO_SHOW")

    try:
        apt = await appointment_service.update_appointment_status(db, apt_id, status_update, current_user.id)
        await db.commit()
        return apt
    except Exception as e:
        await db.rollback()
        raise e
