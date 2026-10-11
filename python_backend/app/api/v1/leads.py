from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from app.db.session import get_db
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse, LeadDetailResponse
from app.services import lead_service
from app.repositories import patient_repo
from app.utils.phone import normalize_phone
from app.models import Role, User
from app.api.dependencies import require_roles, verify_csrf_token

router = APIRouter()

# DOCTOR has full access, STAFF has limited access as specified.
# Leads: STAFF: CREATE, READ, UPDATE, CONVERT. No DELETE. DOCTOR can do all.

@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_csrf_token)])
async def create_lead(
    lead_data: LeadCreate,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    return await lead_service.create_lead(db, lead_data)

@router.get("/{lead_id}", response_model=LeadDetailResponse)
async def get_lead(
    lead_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    lead = await lead_service.get_lead(db, lead_id)
    
    # Check for exact duplicate existing patient
    normalized_phone = normalize_phone(lead.phone)
    existing_patient = await patient_repo.get_by_phone_and_name(db, normalized_phone, lead.name)
    
    # We must construct a dictionary or Pydantic model to include the extra field since 'lead' is an ORM object
    lead_dict = LeadResponse.model_validate(lead).model_dump()
    lead_dict["existingPatient"] = existing_patient
    
    return lead_dict

@router.get("", response_model=List[LeadResponse])
async def list_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    return await lead_service.get_all_leads(db, skip=skip, limit=limit)

@router.patch("/{lead_id}", response_model=LeadDetailResponse, dependencies=[Depends(verify_csrf_token)])
async def update_lead(
    lead_id: UUID,
    lead_update: LeadUpdate,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    updated_lead = await lead_service.update_lead(db, lead_id, lead_update, current_user)
    
    normalized_phone = normalize_phone(updated_lead.phone)
    existing_patient = await patient_repo.get_by_phone_and_name(db, normalized_phone, updated_lead.name)
    
    lead_dict = LeadResponse.model_validate(updated_lead).model_dump()
    lead_dict["existingPatient"] = existing_patient
    
    return lead_dict

@router.post("/{lead_id}/convert", response_model=LeadDetailResponse, dependencies=[Depends(verify_csrf_token)])
async def convert_lead(
    lead_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    converted_lead = await lead_service.convert_lead(db, lead_id, current_user=current_user)
    
    normalized_phone = normalize_phone(converted_lead.phone)
    existing_patient = await patient_repo.get_by_phone_and_name(db, normalized_phone, converted_lead.name)
    
    lead_dict = LeadResponse.model_validate(converted_lead).model_dump()
    lead_dict["existingPatient"] = existing_patient
    
    return lead_dict

@router.delete("/{lead_id}", response_model=LeadResponse, dependencies=[Depends(verify_csrf_token)])
async def delete_lead(
    lead_id: UUID,
    current_user: User = Depends(require_roles([Role.DOCTOR])), # Only DOCTOR can delete
    db: AsyncSession = Depends(get_db)
):
    return await lead_service.soft_delete_lead(db, lead_id)
