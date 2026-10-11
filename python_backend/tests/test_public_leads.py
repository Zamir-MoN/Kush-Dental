import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta, timezone
import uuid
import asyncio

@pytest.mark.asyncio
async def test_1_home_inquiry(client: AsyncClient, db_session: AsyncSession):
    """TEST 1 - HOME INQUIRY: POST valid inquiry payload WITHOUT startsAt to /leads."""
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+1{random_digits}"
    payload = {
        "name": "Inquiry User",
        "email": "inquiry@example.com",
        "phone": phone,
        "captcha_token": "1x00000000000000000000AA"
    }
    
    # Get initial counts
    res_lead = await db_session.execute(text('SELECT count(*) FROM "Lead"'))
    initial_leads = res_lead.scalar()
    res_apt = await db_session.execute(text('SELECT count(*) FROM "Appointment"'))
    initial_apts = res_apt.scalar()
    
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"X-Forwarded-For": "100.1.1.1", "Idempotency-Key": str(uuid.uuid4())}
    )
    
    assert response.status_code == 202
    data = response.json()
    assert data["success"] is True
    
    # Verify exactly 1 Lead was created
    res_lead = await db_session.execute(text('SELECT count(*) FROM "Lead"'))
    assert res_lead.scalar() == initial_leads + 1
    
    # Verify Lead source is INQUIRY
    phone_norm = payload["phone"].replace("-", "")
    result = await db_session.execute(text('SELECT id, name, status, source FROM "Lead" WHERE phone = :p'), {"p": phone_norm})
    row = result.fetchone()
    assert row is not None
    assert row[1] == "Inquiry User"
    assert row[2] == "NEW"
    assert row[3] == "INQUIRY"
    
    # Verify Appointment count unchanged
    res_apt = await db_session.execute(text('SELECT count(*) FROM "Appointment"'))
    assert res_apt.scalar() == initial_apts


@pytest.mark.asyncio
async def test_2_public_booking(client: AsyncClient, db_session: AsyncSession):
    """TEST 2 - PUBLIC BOOKING: POST valid booking payload WITH startsAt to /appointments."""
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=1)
    
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+1{random_digits}"
    payload = {
        "name": "Booking User",
        "email": "booking@example.com",
        "phone": phone,
        "desiredTreatment": "Checkup",
        "captcha_token": "1x00000000000000000000AA",
        "startsAt": starts.isoformat()
    }
    
    # Get initial counts
    res_lead = await db_session.execute(text('SELECT count(*) FROM "Lead"'))
    initial_leads = res_lead.scalar()
    res_apt = await db_session.execute(text('SELECT count(*) FROM "Appointment"'))
    initial_apts = res_apt.scalar()
    
    response = await client.post(
        "/api/v1/public/appointments", 
        json=payload, 
        headers={"X-Forwarded-For": "100.1.1.2", "Idempotency-Key": str(uuid.uuid4())}
    )
    
    assert response.status_code == 202
    
    # Verify exactly 1 Appointment was created
    res_apt = await db_session.execute(text('SELECT count(*) FROM "Appointment"'))
    assert res_apt.scalar() == initial_apts + 1
    
    # Verify Appointment is REQUESTED
    phone_norm = payload["phone"].replace("-", "")
    result = await db_session.execute(text('SELECT id, status, "guestName" FROM "Appointment" WHERE "guestPhone" = :p'), {"p": phone_norm})
    row = result.fetchone()
    assert row is not None
    assert row[1] == "REQUESTED"
    assert row[2] == "Booking User"
    
    # Verify Lead count unchanged
    res_lead = await db_session.execute(text('SELECT count(*) FROM "Lead"'))
    assert res_lead.scalar() == initial_leads


@pytest.mark.asyncio
async def test_3_booking_validation(client: AsyncClient, db_session: AsyncSession):
    """TEST 3 - BOOKING VALIDATION: Submit an invalid appointment booking WITHOUT startsAt."""
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+1{random_digits}"
    payload = {
        "name": "Invalid Booking",
        "email": "invalid@example.com",
        "phone": phone,
        "captcha_token": "1x00000000000000000000AA"
        # Missing startsAt
    }
    
    response = await client.post(
        "/api/v1/public/appointments", 
        json=payload, 
        headers={"X-Forwarded-For": "100.1.1.3", "Idempotency-Key": str(uuid.uuid4())}
    )
    
    assert response.status_code == 400
    data = response.json()
    assert "startsAt is required for an appointment booking" in data["detail"]


@pytest.mark.asyncio
async def test_4_workflow_separation(client: AsyncClient, db_session: AsyncSession):
    """TEST 4 - WORKFLOW SEPARATION: Ensure Home Page inquiry endpoint cannot enter booking workflow."""
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=2)
    
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+1{random_digits}"
    payload = {
        "name": "Separation User",
        "email": "separation@example.com",
        "phone": phone,
        "captcha_token": "1x00000000000000000000AA",
        "startsAt": starts.isoformat() # Providing startsAt to /leads should still just create a Lead
    }
    
    res_apt = await db_session.execute(text('SELECT count(*) FROM "Appointment"'))
    initial_apts = res_apt.scalar()
    
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"X-Forwarded-For": "100.1.1.4", "Idempotency-Key": str(uuid.uuid4())}
    )
    
    assert response.status_code == 202
    
    # Ensure no appointment was created
    res_apt = await db_session.execute(text('SELECT count(*) FROM "Appointment"'))
    assert res_apt.scalar() == initial_apts

