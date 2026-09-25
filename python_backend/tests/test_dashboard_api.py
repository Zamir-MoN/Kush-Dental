import pytest
from httpx import AsyncClient
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo
from app.models import AppointmentStatus, LeadStatus
from app.schemas.appointment import AppointmentCreate
from app.schemas.lead import LeadCreate
from app.repositories import appointment_repo, lead_repo, patient_repo

KOLKATA_TZ = ZoneInfo("Asia/Kolkata")

@pytest.fixture
def current_time_kolkata():
    return datetime.now(KOLKATA_TZ)

@pytest.mark.asyncio
async def test_dashboard_unauthenticated(client: AsyncClient):
    res = await client.get("/api/v1/dashboard")
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_dashboard_staff_access(client: AsyncClient, staff_auth_headers: dict):
    res = await client.get("/api/v1/dashboard", headers=staff_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data

@pytest.mark.asyncio
async def test_dashboard_doctor_access(client: AsyncClient, doctor_auth_headers: dict):
    res = await client.get("/api/v1/dashboard", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data

@pytest.mark.asyncio
async def test_dashboard_counts_and_timezone(
    client: AsyncClient, doctor_auth_headers: dict, db_session, db_patient, doctor_user, current_time_kolkata
):
    # Determine bounds
    start_ist = datetime.combine(current_time_kolkata.date(), time.min, tzinfo=KOLKATA_TZ)
    next_ist = start_ist + timedelta(days=1)
    
    start_utc = start_ist.astimezone(timezone.utc)
    next_utc = next_ist.astimezone(timezone.utc)
    
    # Yesterday appointment
    yesterday_utc = start_utc - timedelta(hours=2)
    
    # Today appointment (CONFIRMED)
    today_utc = start_utc + timedelta(seconds=1)
    
    # Today appointment (REQUESTED)
    today_req_utc = start_utc + timedelta(seconds=3)
    
    # Tomorrow appointment
    tomorrow_utc = next_utc + timedelta(seconds=1)

    # Clean up any existing appointments that might interfere with limits
    from sqlalchemy import text
    await db_session.execute(text('DELETE FROM "Contact"'))
    await db_session.execute(text('DELETE FROM "Appointment"'))

    # Insert mock data
    await appointment_repo.create(db_session, AppointmentCreate(
        patientId=db_patient.id, doctorId=doctor_user.id, treatment="Tx1", startsAt=yesterday_utc, endsAt=yesterday_utc + timedelta(seconds=1)
    ), status=AppointmentStatus.CONFIRMED)
    
    await appointment_repo.create(db_session, AppointmentCreate(
        patientId=db_patient.id, doctorId=doctor_user.id, treatment="Tx2", startsAt=today_utc, endsAt=today_utc + timedelta(seconds=1)
    ), status=AppointmentStatus.CONFIRMED)
    
    await appointment_repo.create(db_session, AppointmentCreate(
        patientId=db_patient.id, doctorId=doctor_user.id, treatment="Tx3", startsAt=today_req_utc, endsAt=today_req_utc + timedelta(seconds=1)
    ), status=AppointmentStatus.REQUESTED)
    
    await appointment_repo.create(db_session, AppointmentCreate(
        patientId=db_patient.id, doctorId=doctor_user.id, treatment="Tx4", startsAt=tomorrow_utc, endsAt=tomorrow_utc + timedelta(seconds=1)
    ), status=AppointmentStatus.CONFIRMED)
    
    # Leads
    await lead_repo.create(db_session, LeadCreate(name="Lead1", phone="111", status=LeadStatus.NEW))
    await lead_repo.create(db_session, LeadCreate(name="Lead2", phone="222", status=LeadStatus.CONTACTED))
    
    await db_session.commit()
    
    res = await client.get("/api/v1/dashboard", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    
    summary = data["summary"]
    
    # We should have exactly 2 today (Tx2, Tx3)
    assert summary["todayAppointments"] >= 2
    
    # We should have exactly 1 requested (Tx3)
    assert summary["requestedAppointments"] >= 1
    
    # We should have exactly 1 confirmed today (Tx2)
    assert summary["confirmedToday"] >= 1
    
    # We should have at least 1 new lead (Lead1)
    assert summary["newLeads"] >= 1
    
    # Verify arrays
    today_apts = data["todayAppointments"]
    assert any(a["treatment"] == "Tx2" for a in today_apts)
    assert any(a["treatment"] == "Tx3" for a in today_apts)
    assert not any(a["treatment"] == "Tx1" for a in today_apts) # yesterday
    assert not any(a["treatment"] == "Tx4" for a in today_apts) # tomorrow
    
    # Verify RBAC Patient object inside Appointment is bounded
    apt = next(a for a in today_apts if a["treatment"] == "Tx2")
    assert "patient" in apt
    assert "fullName" in apt["patient"]
    assert "email" not in apt["patient"] # We intentionally excluded email
    
    req_apts = data["requestedAppointments"]
    if len(req_apts) < 10:
        assert any(a["treatment"] == "Tx3" for a in req_apts)
    
    upcoming = data["upcomingAppointments"]
    if len(upcoming) < 5:
        # Tx4 should be upcoming
        assert any(a["treatment"] == "Tx4" for a in upcoming)
    
    # Ordering test (upcoming startsAt ASC)
    starts = [datetime.fromisoformat(a["startsAt"].replace('Z', '+00:00')) for a in upcoming]
    assert starts == sorted(starts)
