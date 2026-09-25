from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from app.db.session import get_db
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse, PatientSearchResponse
from app.schemas.appointment import PatientLookupResponse
from app.repositories import patient_repo
from app.models import Role, User
from app.api.dependencies import require_roles, verify_csrf_token

router = APIRouter()

# STAFF: CREATE/READ/UPDATE demographics only. no clinical history. no DELETE.

@router.get("/search", response_model=PatientSearchResponse)
async def search_patients(
    q: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    """
    Search patients by phone or name.
    """
    patients, total = await patient_repo.search_patients(db, q, skip=skip, limit=limit)
    return PatientSearchResponse(
        total=total,
        skip=skip,
        limit=limit,
        data=patients
    )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_csrf_token)])
async def create_patient(
    patient_in: PatientCreate,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    try:
        patient = await patient_repo.create(db, patient_in)
        await db.commit()
        return patient
    except Exception as e:
        await db.rollback()
        raise e

@router.get("", response_model=List[PatientResponse])
async def list_patients(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    return await patient_repo.get_all(db, skip=skip, limit=limit)

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    patient = await patient_repo.get_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return patient

@router.patch("/{patient_id}", response_model=PatientResponse, dependencies=[Depends(verify_csrf_token)])
async def update_patient(
    patient_id: UUID,
    patient_update: PatientUpdate,
    current_user: User = Depends(require_roles([Role.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    patient = await patient_repo.get_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    try:
        patient = await patient_repo.update(db, patient, patient_update)
        await db.commit()
        return patient
    except Exception as e:
        await db.rollback()
        raise e
