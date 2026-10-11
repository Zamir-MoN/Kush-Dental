import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import AppointmentStatus, Appointment
from app.schemas.appointment import AppointmentCreate
from app.repositories import appointment_repo, patient_repo
from datetime import datetime, timezone, timedelta
import uuid

@pytest.mark.asyncio
async def test_appointment_status_filter_and_pagination(client: AsyncClient, doctor_auth_headers, db_session: AsyncSession):
    from app.schemas.patient import PatientCreate
    
    # Clear existing
    await db_session.execute(func.count())

    patient = await patient_repo.create(db_session, PatientCreate(fullName="Filter Patient", phone=f"99{str(uuid.uuid4().int)[:8]}"))
    await db_session.commit()

    now = datetime.now(timezone.utc)
    
    # Create 35 appointments
    # Let's make 25 REQUESTED, 5 CONFIRMED, 5 CANCELLED
    # Mix them up in time so they are spread across pagination pages
    # Or just insert them. `startsAt` order determines pagination.
    
    for i in range(35):
        if i % 7 == 0:
            status = AppointmentStatus.CONFIRMED # 5 of these
        elif i % 7 == 1:
            status = AppointmentStatus.CANCELLED # 5 of these
        else:
            status = AppointmentStatus.REQUESTED # 25 of these
            
        apt_in = AppointmentCreate(
            patientId=patient.id,
            treatment=f"Treatment {i}",
            startsAt=now + timedelta(days=i),
            endsAt=now + timedelta(days=i, hours=1)
        )
        await appointment_repo.create(db_session, apt_in, status=status)
    
    await db_session.commit()

    # A. No status (unfiltered) -> Should get 20 (limit) out of 35 total
    res_all = await client.get(f"/api/v1/appointments?patientId={patient.id}&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_all.status_code == 200
    data_all = res_all.json()
    assert data_all["total"] == 35
    assert len(data_all["data"]) == 20

    # B. REQUESTED -> Should get 20 limit out of 25 total
    res_req = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=REQUESTED&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_req.status_code == 200
    data_req = res_req.json()
    assert data_req["total"] == 25
    assert len(data_req["data"]) == 20

    # C. CONFIRMED -> Should get 5 limit out of 5 total
    res_conf = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=CONFIRMED&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_conf.status_code == 200
    data_conf = res_conf.json()
    assert data_conf["total"] == 5
    assert len(data_conf["data"]) == 5
    assert all(a["status"] == "CONFIRMED" for a in data_conf["data"])

    # D. CANCELLED -> Should get 5 limit out of 5 total
    res_canc = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=CANCELLED&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_canc.status_code == 200
    data_canc = res_canc.json()
    assert data_canc["total"] == 5
    assert len(data_canc["data"]) == 5
    assert all(a["status"] == "CANCELLED" for a in data_canc["data"])

    # E. COMPLETED -> Should get 0 limit out of 0 total
    res_comp = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=COMPLETED&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_comp.status_code == 200
    assert res_comp.json()["total"] == 0

    # F. NO_SHOW -> Should get 0 limit out of 0 total
    res_ns = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=NO_SHOW&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_ns.status_code == 200
    assert res_ns.json()["total"] == 0

    # G. Invalid status -> 422
    res_inv = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=INVALID_STATUS&skip=0&limit=20", headers=doctor_auth_headers)
    assert res_inv.status_code == 422

    # H. Pagination for REQUESTED
    res_req_p2 = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=REQUESTED&skip=20&limit=20", headers=doctor_auth_headers)
    data_req_p2 = res_req_p2.json()
    assert data_req_p2["total"] == 25
    assert len(data_req_p2["data"]) == 5

    # I. Combined filters (status + date range)
    # Let's get CONFIRMED within the first 10 days
    end_date = now + timedelta(days=10)
    res_comb = await client.get(f"/api/v1/appointments?patientId={patient.id}&status=CONFIRMED&endDate={end_date.isoformat().replace('+', '%2B')}", headers=doctor_auth_headers)
    assert res_comb.status_code == 200
    # days 0 and 7 are CONFIRMED. Both are < day 10. So total=2.
    assert res_comb.json()["total"] == 2
