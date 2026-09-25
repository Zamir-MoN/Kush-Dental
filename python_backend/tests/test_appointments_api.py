import pytest
from httpx import AsyncClient
from app.models import AppointmentStatus

@pytest.mark.asyncio
async def test_list_appointments_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/appointments")
    assert response.status_code in (401, 403)

@pytest.mark.asyncio
async def test_list_appointments_authorized(client: AsyncClient, doctor_auth_headers: dict, db_appointment):
    response = await client.get(
        "/api/v1/appointments",
        headers=doctor_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    # Check deterministic ordering is at least valid list
    assert "id" in data[0]

@pytest.mark.asyncio
async def test_get_appointment_detail(client: AsyncClient, staff_auth_headers: dict, db_appointment):
    response = await client.get(
        f"/api/v1/appointments/{db_appointment.id}",
        headers=staff_auth_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == str(db_appointment.id)

@pytest.mark.asyncio
async def test_get_appointment_not_found(client: AsyncClient, staff_auth_headers: dict):
    import uuid
    random_id = uuid.uuid4()
    response = await client.get(
        f"/api/v1/appointments/{random_id}",
        headers=staff_auth_headers
    )
    assert response.status_code == 404
