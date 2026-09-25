import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta, timezone
import uuid
import asyncio

@pytest.mark.asyncio
async def test_create_public_lead_success(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=1)
    ends = starts + timedelta(hours=1)
    
    payload = {
        "name": "Public User",
        "email": "public@example.com",
        "phone": "+1-555-123-9999",
        "desiredTreatment": "Checkup",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    response = await client.post("/api/v1/public/leads", json=payload, headers={"X-Forwarded-For": "100.1.1.1", "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    
    # Verify in DB - Lead
    result = await db_session.execute(text("SELECT name, status, \"desiredTreatment\" FROM \"Lead\" WHERE phone = '+15551239999'"))
    row = result.fetchone()
    assert row is not None
    assert row[0] == "Public User"
    assert row[1] == "NEW"
    
    # Verify in DB - Patient
    result_p = await db_session.execute(text("SELECT id, \"fullName\" FROM \"Patient\" WHERE phone = '+15551239999'"))
    row_p = result_p.fetchone()
    assert row_p is not None
    patient_id = row_p[0]
    
    # Verify in DB - Appointment
    result_a = await db_session.execute(text("SELECT status FROM \"Appointment\" WHERE \"patientId\" = :pid"), {"pid": patient_id})
    row_a = result_a.fetchone()
    assert row_a is not None
    assert row_a[0] == "REQUESTED"

    # Verify in DB - Contact
    result_c = await db_session.execute(text("SELECT status, \"createdAt\", \"updatedAt\" FROM \"Contact\" WHERE \"patientId\" = :pid"), {"pid": patient_id})
    row_c = result_c.fetchone()
    assert row_c is not None
    assert row_c[0] == "OPEN"
    assert row_c[1] is not None
    assert row_c[2] is not None

@pytest.mark.asyncio
async def test_public_booking_reuses_patient(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=2)
    ends = starts + timedelta(hours=1)
    
    # Use random phone to avoid state collisions across test runs
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+91{random_digits}"
    patient_id = uuid.uuid4()
    await db_session.execute(text("""
        INSERT INTO "Patient" (id, "fullName", phone, "updatedAt") 
        VALUES (:id, 'Existing Patient', :phone, :now)
    """), {"id": patient_id, "phone": phone, "now": now})
    await db_session.commit()
    
    payload = {
        "name": "Different Name Booking",
        "email": "diff@example.com",
        "phone": f"+91 ({random_digits[:3]}) {random_digits[3:6]}-{random_digits[6:]}",
        "desiredTreatment": "Implants",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    response = await client.post("/api/v1/public/leads", json=payload, headers={"X-Forwarded-For": "100.1.1.9", "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 201
    
    # Verify patient was NOT duplicated, count should be 1
    result = await db_session.execute(text("SELECT count(*) FROM \"Patient\" WHERE phone = :phone"), {"phone": phone})
    assert result.scalar() == 1
    
    # Verify patient name was NOT overwritten
    result_p = await db_session.execute(text("SELECT \"fullName\" FROM \"Patient\" WHERE phone = :phone"), {"phone": phone})
    assert result_p.scalar() == "Existing Patient"
    
    # Verify appointment links to existing patient
    result_a = await db_session.execute(text("SELECT id FROM \"Appointment\" WHERE \"patientId\" = :pid"), {"pid": patient_id})
    assert len(result_a.fetchall()) == 1

@pytest.mark.asyncio
async def test_create_public_lead_validation_errors(client: AsyncClient):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=1)
    ends = starts + timedelta(hours=1)
    
    # Missing name
    response = await client.post("/api/v1/public/leads", json={
        "email": "a@b.com", "phone": "555-1234", "desiredTreatment": "Fix", "startsAt": starts.isoformat(), "endsAt": ends.isoformat()
    }, headers={"X-Forwarded-For": "100.1.1.2", "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 422
    
    # Invalid time (endsAt < startsAt) should fail cleanly and rollback
    response = await client.post("/api/v1/public/leads", json={
        "name": "Test Time", "email": "a@b.com", "phone": "555-999-8888", "desiredTreatment": "Fix", 
        "startsAt": ends.isoformat(), "endsAt": starts.isoformat()
    }, headers={"X-Forwarded-For": "100.1.1.4", "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 500 # Unhandled ValueError becomes 500 as per global exception handler, but let's just assert it failed

@pytest.mark.asyncio
async def test_public_lead_rate_limiting(client: AsyncClient):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=3)
    ends = starts + timedelta(hours=1)
    
    payload = {
        "name": "Rate Limit",
        "email": "rate@example.com",
        "phone": "+1-555-000-0000",
        "desiredTreatment": "Testing",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    headers = {"X-Forwarded-For": "100.100.100.100"}
    
    for _ in range(3):
        response = await client.post("/api/v1/public/leads", json=payload, headers={**headers, "Idempotency-Key": str(uuid.uuid4())})
        assert response.status_code == 201
        
    response = await client.post("/api/v1/public/leads", json=payload, headers={**headers, "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 429

@pytest.mark.asyncio
async def test_public_lead_trusted_proxy(client: AsyncClient):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=1)
    ends = starts + timedelta(hours=1)
    
    payload = {
        "name": "Proxy User",
        "email": "proxy@example.com",
        "phone": "+1-555-999-0000",
        "desiredTreatment": "Checkup",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    # Simulate a proxy chain where the first IP is the real client IP
    headers = {"X-Forwarded-For": "100.2.2.2, 192.168.1.1"}
    
    response = await client.post("/api/v1/public/leads", json=payload, headers={**headers, "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 201
    assert response.json()["success"] is True

@pytest.mark.asyncio
async def test_public_lead_max_body_size(client: AsyncClient):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=1)
    ends = starts + timedelta(hours=1)
    
    payload = {
        "name": "A",
        "email": "big@example.com",
        "phone": "+1-555-888-0000",
        "desiredTreatment": "Checkup",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat(),
        "notes": "A" * 1050000 # Intentionally large to exceed 1MB max body size
    }
    
    headers = {"X-Forwarded-For": "100.3.3.3"}
    response = await client.post("/api/v1/public/leads", json=payload, headers={**headers, "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 413 # Payload Too Large

@pytest.mark.asyncio
async def test_public_booking_idempotency_success_retry(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=5)
    ends = starts + timedelta(hours=1)
    idem_key = str(uuid.uuid4())
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+1{random_digits}"
    
    payload = {
        "name": "Idempotent User",
        "email": "idem@example.com",
        "phone": phone,
        "desiredTreatment": "Checkup",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    # First request
    r1 = await client.post("/api/v1/public/leads", json=payload, headers={"X-Forwarded-For": "100.4.4.4", "Idempotency-Key": idem_key})
    assert r1.status_code == 201
    
    # Second request (Retry)
    r2 = await client.post("/api/v1/public/leads", json=payload, headers={"X-Forwarded-For": "100.4.4.4", "Idempotency-Key": idem_key})
    assert r2.status_code == 201
    
    # Verify exactly ONE Lead was created
    result = await db_session.execute(text("SELECT count(*) FROM \"Lead\" WHERE \"idempotencyKey\" = :k"), {"k": idem_key})
    assert result.scalar() == 1
    
    # Verify exactly ONE Contact was created
    result_p = await db_session.execute(text("SELECT id FROM \"Patient\" WHERE phone = :phone"), {"phone": phone})
    pid = result_p.scalar()
    result_c = await db_session.execute(text("SELECT count(*) FROM \"Contact\" WHERE \"patientId\" = :pid"), {"pid": pid})
    assert result_c.scalar() == 1

@pytest.mark.asyncio
async def test_public_booking_idempotency_payload_mismatch(client: AsyncClient):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=6)
    ends = starts + timedelta(hours=1)
    idem_key = str(uuid.uuid4())
    
    payload1 = {
        "name": "Mismatch User",
        "email": "mismatch@example.com",
        "phone": "+1-555-666-6666",
        "desiredTreatment": "Checkup",
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    payload2 = {
        **payload1,
        "desiredTreatment": "Implants"
    }
    
    r1 = await client.post("/api/v1/public/leads", json=payload1, headers={"X-Forwarded-For": "100.5.5.5", "Idempotency-Key": idem_key})
    assert r1.status_code == 201
    
    r2 = await client.post("/api/v1/public/leads", json=payload2, headers={"X-Forwarded-For": "100.5.5.5", "Idempotency-Key": idem_key})
    assert r2.status_code == 409
    assert "different payload" in r2.json()["detail"]

@pytest.mark.asyncio
async def test_public_booking_concurrent_idempotency(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=7)
    ends = starts + timedelta(hours=1)
    idem_key = str(uuid.uuid4())
    random_digits = str(uuid.uuid4().int)[:10]
    phone = f"+1{random_digits}"
    
    payload = {
        "name": "Concurrent User",
        "phone": phone,
        "startsAt": starts.isoformat(),
        "endsAt": ends.isoformat()
    }
    
    # Fire 3 requests simultaneously
    reqs = [
        client.post("/api/v1/public/leads", json=payload, headers={"X-Forwarded-For": f"100.6.6.{i}", "Idempotency-Key": idem_key})
        for i in range(3)
    ]
    responses = await asyncio.gather(*reqs)
    
    for r in responses:
        assert r.status_code == 201
        
    result = await db_session.execute(text("SELECT count(*) FROM \"Lead\" WHERE \"idempotencyKey\" = :k"), {"k": idem_key})
    assert result.scalar() == 1
    
    result_p = await db_session.execute(text("SELECT id FROM \"Patient\" WHERE phone = :phone"), {"phone": phone})
    pid = result_p.scalar()
    result_c = await db_session.execute(text("SELECT count(*) FROM \"Contact\" WHERE \"patientId\" = :pid"), {"pid": pid})
    assert result_c.scalar() == 1

@pytest.mark.asyncio
async def test_create_public_inquiry_no_appointment(client: AsyncClient, db_session: AsyncSession):
    payload = {
        "name": "Inquiry User",
        "email": "inquiry@example.com",
        "phone": "+1-555-222-3333",
        "desiredTreatment": "Question about services"
    }
    
    response = await client.post("/api/v1/public/leads", json=payload, headers={"X-Forwarded-For": "100.1.1.2", "Idempotency-Key": str(uuid.uuid4())})
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    
    # Verify in DB - Lead
    result = await db_session.execute(text("SELECT name, status, \"desiredTreatment\" FROM \"Lead\" WHERE phone = '+15552223333'"))
    row = result.fetchone()
    assert row is not None
    assert row[0] == "Inquiry User"
    
    # Verify in DB - Patient
    result_p = await db_session.execute(text("SELECT id, \"fullName\" FROM \"Patient\" WHERE phone = '+15552223333'"))
    row_p = result_p.fetchone()
    assert row_p is not None
    patient_id = row_p[0]
    
    # Verify in DB - Appointment (should NOT exist)
    result_a = await db_session.execute(text("SELECT status FROM \"Appointment\" WHERE \"patientId\" = :pid"), {"pid": patient_id})
    assert result_a.fetchone() is None

    # Verify in DB - Contact
    result_c = await db_session.execute(text("SELECT status, \"appointmentId\" FROM \"Contact\" WHERE \"patientId\" = :pid"), {"pid": patient_id})
    row_c = result_c.fetchone()
    assert row_c is not None
    assert row_c[0] == "OPEN"
    assert row_c[1] is None
