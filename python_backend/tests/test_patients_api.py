import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_patients_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/patients")
    assert response.status_code in (401, 403)

@pytest.mark.asyncio
async def test_list_patients_authorized(client: AsyncClient, doctor_auth_headers: dict, db_patient, db_session):
    # Clean up any bad data from other tests that bypass validation
    from app.models import Patient
    from sqlalchemy import delete, func
    await db_session.execute(delete(Patient).where(func.length(Patient.phone) < 10))
    await db_session.commit()
    
    response = await client.get(
        "/api/v1/patients",
        headers=doctor_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "id" in data[0]
