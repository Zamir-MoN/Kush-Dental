import pytest
from httpx import AsyncClient
from datetime import datetime, timezone, time, timedelta
from zoneinfo import ZoneInfo
from app.models import AppointmentStatus
from app.schemas.patient import PatientCreate
from app.schemas.appointment import AppointmentCreate
from app.repositories import patient_repo
from app.services import appointment_service

import pytest_asyncio
pytestmark = pytest.mark.asyncio
KOLKATA_TZ = ZoneInfo("Asia/Kolkata")

@pytest_asyncio.fixture
async def base_setup(db_session, doctor_auth_headers):
    # Setup patient and doc
    import uuid
    patient = await patient_repo.create(db_session, PatientCreate(fullName="Smart Pat", phone=f"99{str(uuid.uuid4().int)[:8]}"))
    await db_session.commit()
    # Find doctor id from auth
    from app.utils.security import decode_access_token
    token = doctor_auth_headers["Authorization"].split(" ")[1]
    payload = decode_access_token(token)
    doc_id = payload["sub"]
    return patient.id, doc_id

async def make_apt(db_session, pat_id, doc_id, starts_at, status=AppointmentStatus.REQUESTED):
    apt_in = AppointmentCreate(
        patientId=pat_id,
        doctorId=doc_id,
        treatment="Test",
        startsAt=starts_at,
        endsAt=starts_at + timedelta(hours=1)
    )
    apt = await appointment_service.create_appointment(db_session, apt_in, doc_id)
    if status != AppointmentStatus.REQUESTED:
        # manual update bypass since we want to force status easily
        apt.status = status
    await db_session.commit()
    return apt

async def test_today_takes_priority(client: AsyncClient, doctor_auth_headers, db_session, base_setup):
    pat_id, doc_id = base_setup
    now_ist = datetime.now(KOLKATA_TZ)
    today_start = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    
    # 1 apt today
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(hours=5), AppointmentStatus.CONFIRMED)
    # 1 apt tomorrow
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(days=1, hours=5), AppointmentStatus.CONFIRMED)
    
    resp = await client.get(f"/api/v1/appointments?doctorId={doc_id}", headers=doctor_auth_headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) == 1
    # Check it is today's
    apt_date = datetime.fromisoformat(data[0]["startsAt"]).astimezone(KOLKATA_TZ).date()
    assert apt_date == now_ist.date()
    assert resp.json()["effectiveStartDateStr"] == now_ist.strftime('%Y-%m-%d')

async def test_nearest_future_fallback(client: AsyncClient, doctor_auth_headers, db_session, base_setup):
    pat_id, doc_id = base_setup
    now_ist = datetime.now(KOLKATA_TZ)
    today_start = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    
    # 1 apt yesterday
    await make_apt(db_session, pat_id, doc_id, today_start - timedelta(days=1, hours=5), AppointmentStatus.CONFIRMED)
    # 1 apt tomorrow
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(days=1, hours=5), AppointmentStatus.CONFIRMED)
    
    resp = await client.get(f"/api/v1/appointments?doctorId={doc_id}", headers=doctor_auth_headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) == 1
    # Check it is tomorrow
    apt_date = datetime.fromisoformat(data[0]["startsAt"]).astimezone(KOLKATA_TZ).date()
    assert apt_date == (now_ist + timedelta(days=1)).date()

async def test_no_future_returns_empty(client: AsyncClient, doctor_auth_headers, db_session, base_setup):
    pat_id, doc_id = base_setup
    now_ist = datetime.now(KOLKATA_TZ)
    today_start = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    
    # 1 apt yesterday
    await make_apt(db_session, pat_id, doc_id, today_start - timedelta(days=1, hours=5), AppointmentStatus.CONFIRMED)
    
    resp = await client.get(f"/api/v1/appointments?doctorId={doc_id}", headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()["data"]) == 0

async def test_terminal_statuses_excluded(client: AsyncClient, doctor_auth_headers, db_session, base_setup):
    pat_id, doc_id = base_setup
    now_ist = datetime.now(KOLKATA_TZ)
    today_start = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    
    # CANCELLED today
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(hours=5), AppointmentStatus.CANCELLED)
    # CONFIRMED tomorrow
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(days=1, hours=5), AppointmentStatus.CONFIRMED)
    
    resp = await client.get(f"/api/v1/appointments?doctorId={doc_id}", headers=doctor_auth_headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) == 1
    # Should skip today and go to tomorrow
    apt_date = datetime.fromisoformat(data[0]["startsAt"]).astimezone(KOLKATA_TZ).date()
    assert apt_date == (now_ist + timedelta(days=1)).date()

async def test_explicit_dates_override(client: AsyncClient, doctor_auth_headers, db_session, base_setup):
    pat_id, doc_id = base_setup
    now_ist = datetime.now(KOLKATA_TZ)
    today_start = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(hours=5), AppointmentStatus.CONFIRMED)
    
    # query yesterday explicitly
    yesterday = today_start - timedelta(days=1)
    yesterday_end = today_start
    
    resp = await client.get(f"/api/v1/appointments?doctorId={doc_id}&startDate={yesterday.isoformat().replace('+', '%2B')}&endDate={yesterday_end.isoformat().replace('+', '%2B')}", headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()["data"]) == 0
    assert resp.json().get("effectiveStartDateStr") is None

async def test_pagination_after_smart_filtering(client: AsyncClient, doctor_auth_headers, db_session, base_setup):
    pat_id, doc_id = base_setup
    now_ist = datetime.now(KOLKATA_TZ)
    today_start = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    
    # 2 apts tomorrow
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(days=1, hours=5), AppointmentStatus.CONFIRMED)
    await make_apt(db_session, pat_id, doc_id, today_start + timedelta(days=1, hours=6), AppointmentStatus.CONFIRMED)
    
    # fetch skip=1, limit=1
    resp = await client.get(f"/api/v1/appointments?doctorId={doc_id}&skip=1&limit=1", headers=doctor_auth_headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) == 1
    assert resp.json()["total"] == 2
