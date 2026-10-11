import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_contact_mismatched_relationships(client: AsyncClient, doctor_auth_headers: dict, db_session):
    # Create patient 1
    phone_1 = f"123{uuid.uuid4().int % 10000000:07d}"
    resp = await client.post("/api/v1/patients", json={"fullName": "Patient A", "phone": phone_1}, headers=doctor_auth_headers)
    patient_a = resp.json()["id"]

    # Create patient 2
    phone_2 = f"555{uuid.uuid4().int % 10000000:07d}"
    resp = await client.post("/api/v1/patients", json={"fullName": "Patient B", "phone": phone_2}, headers=doctor_auth_headers)
    patient_b = resp.json()["id"]

    # Create appointment for patient B
    resp = await client.post("/api/v1/appointments", json={
        "patientId": patient_b,
        "treatment": "Cleaning",
        "startsAt": "2026-10-01T10:00:00Z",
        "endsAt": "2026-10-01T11:00:00Z"
    }, headers=doctor_auth_headers)
    apt_b = resp.json()["id"]

    # Now create a Contact linking Patient A with Appointment B (which belongs to B)
    resp = await client.post("/api/v1/contacts", json={
        "patientId": patient_a,
        "appointmentId": apt_b
    }, headers=doctor_auth_headers)
    
    assert resp.status_code == 400 or resp.status_code == 422, "Should reject mismatched relationships"
