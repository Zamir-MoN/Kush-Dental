from fastapi import APIRouter, Depends, HTTPException, status as fastapi_status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from datetime import datetime, time, timezone, timedelta
from zoneinfo import ZoneInfo
from app.db.session import get_db
from sqlalchemy.future import select
from app.schemas.appointment import (
    AppointmentCreate, 
    AppointmentUpdateStatus, 
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentDetailResponse,
    AppointmentNoteCreate,
    AppointmentNoteResponse,
    AppointmentListResponse,
    PatientLookupResponse,
    DoctorLookupResponse
)
from app.models import Role, User, AppointmentStatus, Appointment
from app.repositories import appointment_repo, patient_repo, user_repo
from app.services import appointment_service
from app.api.dependencies import require_roles, verify_csrf_token

router = APIRouter()

# STAFF MUST NOT: CONFIRMED -> COMPLETED, CONFIRMED -> NO_SHOW, modify treatment, create treatment, modify clinical information.
# DOCTOR has full access.

@router.get("/patient-lookup", response_model=List[PatientLookupResponse])
async def patient_lookup(
    phone: str,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    patients = await patient_repo.get_all_by_phone(db, phone)
    return patients

@router.get("/doctors", response_model=List[DoctorLookupResponse])
async def list_doctors(
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    doctors = await user_repo.get_doctors(db)
    return [{"id": d.id, "name": d.email.split('@')[0]} for d in doctors] # assuming name mapping for now, actually better to just return email as name if no name exists or we could query profile if we had one. But schema wants name.

@router.post("", response_model=AppointmentResponse, status_code=fastapi_status.HTTP_201_CREATED, dependencies=[Depends(verify_csrf_token)])
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

@router.get("/{apt_id}", response_model=AppointmentDetailResponse)
async def get_appointment(
    apt_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    apt = await appointment_repo.get_by_id(db, apt_id)
    if not apt:
        raise HTTPException(status_code=fastapi_status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    return apt

@router.post("/{apt_id}/notes", response_model=AppointmentNoteResponse, status_code=fastapi_status.HTTP_201_CREATED, dependencies=[Depends(verify_csrf_token)])
async def create_appointment_note(
    apt_id: UUID,
    note_in: AppointmentNoteCreate,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    try:
        note = await appointment_service.add_internal_note(db, apt_id, note_in.note, current_user.id)
        await db.commit()
        return note
    except Exception as e:
        await db.rollback()
        raise e

@router.patch("/{apt_id}", response_model=AppointmentResponse, dependencies=[Depends(verify_csrf_token)])
async def update_appointment(
    apt_id: UUID,
    apt_update: AppointmentUpdate,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role == Role.STAFF and apt_update.treatment is not None:
        raise HTTPException(status_code=fastapi_status.HTTP_403_FORBIDDEN, detail="Staff cannot modify treatment")
        
    try:
        apt = await appointment_service.update_appointment(db, apt_id, apt_update, current_user.id)
        await db.commit()
        return apt
    except Exception as e:
        await db.rollback()
        raise e

@router.get("", response_model=AppointmentListResponse)
async def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[AppointmentStatus] = None,
    startDate: Optional[datetime] = None,
    endDate: Optional[datetime] = None,
    doctorId: Optional[UUID] = None,
    patientId: Optional[UUID] = None,
    orderDesc: bool = False,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    if startDate and endDate and startDate >= endDate:
        raise HTTPException(status_code=fastapi_status.HTTP_400_BAD_REQUEST, detail="startDate must be before endDate")
        
    effective_start = startDate
    effective_end = endDate
    effective_start_str = startDate.strftime('%Y-%m-%d') if startDate else None
    effective_end_str = endDate.strftime('%Y-%m-%d') if endDate else None

    appointments, total = await appointment_repo.get_all(
        db, 
        skip=skip, 
        limit=limit, 
        start_date=effective_start, 
        end_date=effective_end, 
        doctor_id=doctorId,
        patient_id=patientId,
        status=status,
        order_desc=orderDesc
    )
    
    return AppointmentListResponse(
        total=total,
        skip=skip,
        limit=limit,
        data=appointments,
        effectiveStartDate=effective_start,
        effectiveEndDate=effective_end,
        effectiveStartDateStr=effective_start_str,
        effectiveEndDateStr=effective_end_str
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
            raise HTTPException(status_code=fastapi_status.HTTP_403_FORBIDDEN, detail="Staff cannot transition to COMPLETED or NO_SHOW")

    try:
        apt = await appointment_service.update_appointment_status(db, apt_id, status_update, current_user.id)
        await db.commit()
        return apt
    except Exception as e:
        await db.rollback()
        raise e
