import pytest
from httpx import AsyncClient
import asyncio
from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_concurrent_appointment_overlap_doctor(client: AsyncClient, doctor_auth_headers: dict, db_patient, doctor_user, db_session):
    start_time = datetime.now(timezone.utc) + timedelta(days=1)
    end_time = start_time + timedelta(hours=1)
    
    payload = {
        "patientId": str(db_patient.id),
        "doctorId": str(doctor_user.id),
        "treatment": "Concurrent Exam",
        "startsAt": start_time.isoformat(),
        "endsAt": end_time.isoformat()
    }
    
    # Send two simultaneous requests for the same slot
    reqs = [
        client.post("/api/v1/appointments", json=payload, headers=doctor_auth_headers),
        client.post("/api/v1/appointments", json=payload, headers=doctor_auth_headers)
    ]
    
    responses = await asyncio.gather(*reqs)
    
    # Exactly one should succeed, one should fail with 409
    status_codes = [r.status_code for r in responses]
    
    assert 201 in status_codes
    assert 409 in status_codes

@pytest.mark.asyncio
async def test_concurrent_appointment_overlap_patient(client: AsyncClient, doctor_auth_headers: dict, db_patient, doctor_user, db_session):
    start_time = datetime.now(timezone.utc) + timedelta(days=2)
    end_time = start_time + timedelta(hours=1)
    
    payload = {
        "patientId": str(db_patient.id),
        "doctorId": str(doctor_user.id),
        "treatment": "Concurrent Exam",
        "startsAt": start_time.isoformat(),
        "endsAt": end_time.isoformat()
    }
    
    reqs = [
        client.post("/api/v1/appointments", json=payload, headers=doctor_auth_headers),
        client.post("/api/v1/appointments", json=payload, headers=doctor_auth_headers)
    ]
    
    responses = await asyncio.gather(*reqs)
    
    status_codes = [r.status_code for r in responses]
    assert 201 in status_codes
    assert 409 in status_codes
