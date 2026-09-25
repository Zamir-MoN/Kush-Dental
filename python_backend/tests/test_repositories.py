import pytest
from app.repositories import patient_repo
from app.schemas.patient import PatientCreate
from app.models import Patient
import uuid

@pytest.mark.asyncio
async def test_patient_soft_delete(db_session):
    pat_in = PatientCreate(fullName="Delete Me", phone=f"555{str(uuid.uuid4().int)[:7]}")
    pat = await patient_repo.create(db_session, pat_in)
    assert pat.deletedAt is None
    
    pat_id = pat.id
    # Soft delete
    await patient_repo.soft_delete(db_session, pat)
    
    # Assert get_by_id returns None (because of soft delete filter)
    fetched = await patient_repo.get_by_id(db_session, pat_id)
    assert fetched is None
    
    # Direct DB query to prove it physically exists
    from sqlalchemy.future import select
    res = await db_session.execute(select(Patient).where(Patient.id == pat_id))
    real_pat = res.scalar_one_or_none()
    assert real_pat is not None
    assert real_pat.deletedAt is not None
