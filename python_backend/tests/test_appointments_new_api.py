import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta, timezone
from app.models import AppointmentStatus
from app.schemas.appointment import AppointmentCreate

@pytest.mark.asyncio
async def test_patient_lookup(client: AsyncClient, staff_auth_headers: dict, db_patient):
    # Staff allowed
    res = await client.get(f"/api/v1/appointments/patient-lookup?phone={db_patient.phone}", headers=staff_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["fullName"] == db_patient.fullName
    assert "deletedAt" not in data
    
    # Not found
    res = await client.get(f"/api/v1/appointments/patient-lookup?phone=999-999999", headers=staff_auth_headers)
    assert res.status_code == 404

    # Unauthenticated denied
    res = await client.get(f"/api/v1/appointments/patient-lookup?phone={db_patient.phone}")
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_doctor_lookup(client: AsyncClient, staff_auth_headers: dict, doctor_user):
    res = await client.get("/api/v1/appointments/doctors", headers=staff_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert any(d["id"] == str(doctor_user.id) for d in data)

@pytest.mark.asyncio
async def test_patch_appointment(client: AsyncClient, staff_auth_headers: dict, doctor_auth_headers: dict, db_patient, doctor_user, db_session):
    from app.services.appointment_service import create_appointment
    
    now = datetime.now(timezone.utc)
    apt = await create_appointment(db_session, AppointmentCreate(patientId=db_patient.id, doctorId=doctor_user.id, treatment="Exam", startsAt=now, endsAt=now+timedelta(hours=1)), doctor_user.id)
    await db_session.commit()
    
    # Staff can modify timing
    new_start = (now + timedelta(days=1)).isoformat().replace('+00:00', 'Z')
    new_end = (now + timedelta(days=1, hours=1)).isoformat().replace('+00:00', 'Z')
    
    res = await client.patch(
        f"/api/v1/appointments/{apt.id}", 
        headers={**staff_auth_headers, "X-CSRF-Token": "test-csrf-token"},
        cookies={"csrf_token": "test-csrf-token"},
        json={"startsAt": new_start, "endsAt": new_end}
    )
    assert res.status_code == 200
    
    # Staff treatment modification blocked
    res = await client.patch(
        f"/api/v1/appointments/{apt.id}", 
        headers={**staff_auth_headers, "X-CSRF-Token": "test-csrf-token"},
        cookies={"csrf_token": "test-csrf-token"},
        json={"treatment": "Surgery"}
    )
    assert res.status_code == 403
    
    # Doctor can modify treatment
    res = await client.patch(
        f"/api/v1/appointments/{apt.id}", 
        headers={**doctor_auth_headers, "X-CSRF-Token": "test-csrf-token"},
        cookies={"csrf_token": "test-csrf-token"},
        json={"treatment": "Surgery"}
    )
    assert res.status_code == 200
    assert res.json()["treatment"] == "Surgery"

@pytest.mark.asyncio
async def test_date_filters(client: AsyncClient, staff_auth_headers: dict, db_patient, doctor_user, db_session):
    from app.services.appointment_service import create_appointment
    now = datetime.now(timezone.utc)
    apt = await create_appointment(db_session, AppointmentCreate(patientId=db_patient.id, doctorId=doctor_user.id, treatment="Exam", startsAt=now, endsAt=now+timedelta(hours=1)), doctor_user.id)
    await db_session.commit()
    
    start = (now - timedelta(days=1)).isoformat().replace('+00:00', 'Z')
    end = (now + timedelta(days=1)).isoformat().replace('+00:00', 'Z')
    
    res = await client.get(f"/api/v1/appointments?startDate={start}&endDate={end}", headers=staff_auth_headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    
    start_future = (now + timedelta(days=10)).isoformat().replace('+00:00', 'Z')
    end_future = (now + timedelta(days=11)).isoformat().replace('+00:00', 'Z')
    res = await client.get(f"/api/v1/appointments?startDate={start_future}&endDate={end_future}", headers=staff_auth_headers)
    assert res.status_code == 200
    assert len(res.json()) == 0
