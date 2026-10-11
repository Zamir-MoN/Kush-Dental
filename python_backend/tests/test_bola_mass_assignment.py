import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_mass_assignment_patient_update(client: AsyncClient, doctor_auth_headers: dict, db_session):
    # Create patient
    import uuid
    phone_1 = f"999{uuid.uuid4().int % 10000000:07d}"
    resp = await client.post("/api/v1/patients", json={"fullName": "Test P", "phone": phone_1}, headers=doctor_auth_headers)
    p_id = resp.json()["id"]

    # Try mass assignment (e.g., deletedAt or id)
    resp2 = await client.patch(f"/api/v1/patients/{p_id}", json={"fullName": "Updated", "deletedAt": "2026-01-01T00:00:00Z"}, headers={**doctor_auth_headers, "X-CSRF-Token": "test-csrf-token", "Cookie": doctor_auth_headers["Cookie"]})
    
    assert resp2.status_code == 422, "Should reject extra fields"

@pytest.mark.asyncio
async def test_appointment_mass_assignment(client: AsyncClient, doctor_auth_headers: dict, db_session):
    # Try creating appointment with internal field 'status'
    resp = await client.post("/api/v1/appointments", json={
        "patientId": "00000000-0000-0000-0000-000000000000",
        "treatment": "X",
        "startsAt": "2026-10-01T10:00:00Z",
        "endsAt": "2026-10-01T11:00:00Z",
        "status": "COMPLETED"
    }, headers={**doctor_auth_headers, "X-CSRF-Token": "test-csrf-token", "Cookie": doctor_auth_headers["Cookie"]})
    
    assert resp.status_code == 422, "Should reject extra fields like status on create"
