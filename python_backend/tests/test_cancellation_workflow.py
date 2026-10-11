import pytest
from httpx import AsyncClient
from uuid import uuid4
from app.models import AppointmentStatus, Role, AuditResult

@pytest.fixture
async def sample_patient(db_session):
    from app.models import Patient
    patient = Patient(
        id=uuid4(),
        full_name="Cancel Test Patient",
        phone="555-000-1111",
        email="cancel@example.com"
    )
    db_session.add(patient)
    await db_session.commit()
    return patient

@pytest.fixture
async def requested_appointment(db_session, sample_patient):
    from app.models import Appointment
    from datetime import datetime, timedelta, timezone
    now = datetime.now(timezone.utc)
    apt = Appointment(
        id=uuid4(),
        patient_id=sample_patient.id,
        treatment="Test Treatment",
        status=AppointmentStatus.REQUESTED,
        starts_at=now + timedelta(days=1),
        ends_at=now + timedelta(days=1, hours=1)
    )
    db_session.add(apt)
    await db_session.commit()
    return apt

@pytest.fixture
async def guest_appointment(db_session):
    from app.models import Appointment
    from datetime import datetime, timedelta, timezone
    now = datetime.now(timezone.utc)
    apt = Appointment(
        id=uuid4(),
        patient_id=None,
        guest_name="Guest Cancel",
        guest_phone="555-999-9999",
        treatment="Guest Treatment",
        status=AppointmentStatus.REQUESTED,
        starts_at=now + timedelta(days=2),
        ends_at=now + timedelta(days=2, hours=1)
    )
    db_session.add(apt)
    await db_session.commit()
    return apt


@pytest.mark.asyncio
async def test_cancel_requested_appointment(client: AsyncClient, admin_token_headers, requested_appointment, db_session):
    """TEST 1 — CANCEL REQUESTED APPOINTMENT"""
    response = await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": "Patient requested cancellation"},
        headers=admin_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "CANCELLED"
    assert data["cancellationReason"] == "Patient requested cancellation"

    # TEST 7 — AUDIT
    # Check audit log
    from app.models import AuditEvent
    from sqlalchemy.future import select
    result = await db_session.execute(
        select(AuditEvent).where(AuditEvent.resource_id == requested_appointment.id, AuditEvent.action == "APPOINTMENT_CANCELLED")
    )
    audit = result.scalars().first()
    assert audit is not None
    assert audit.result == AuditResult.SUCCESS

@pytest.mark.asyncio
async def test_cancel_empty_reason(client: AsyncClient, admin_token_headers, requested_appointment):
    """TEST 2 — EMPTY REASON"""
    response = await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": ""},
        headers=admin_token_headers
    )
    assert response.status_code == 422 # Because backend throws ValidationException which Maps to 422

@pytest.mark.asyncio
async def test_cancel_whitespace_reason(client: AsyncClient, admin_token_headers, requested_appointment):
    """TEST 3 — WHITESPACE REASON"""
    response = await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": "   "},
        headers=admin_token_headers
    )
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_cancel_patient_appointment(client: AsyncClient, admin_token_headers, requested_appointment, db_session):
    """TEST 4 — PATIENT APPOINTMENT & TEST 9 — STATUS PRESERVATION & TEST 6 — NO UNINTENDED WORKFLOWS"""
    # Cancel it
    response = await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": "Testing patient link"},
        headers=admin_token_headers
    )
    assert response.status_code == 200
    
    # Reload from DB
    from app.models import Appointment
    await db_session.refresh(requested_appointment)
    assert requested_appointment.status == AppointmentStatus.CANCELLED
    assert requested_appointment.patient_id is not None # Link intact
    assert requested_appointment.cancellation_reason == "Testing patient link"

@pytest.mark.asyncio
async def test_cancel_guest_appointment(client: AsyncClient, admin_token_headers, guest_appointment, db_session):
    """TEST 5 — GUEST APPOINTMENT"""
    response = await client.patch(
        f"/api/v1/appointments/{guest_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": "Guest no longer coming"},
        headers=admin_token_headers
    )
    assert response.status_code == 200
    
    await db_session.refresh(guest_appointment)
    assert guest_appointment.status == AppointmentStatus.CANCELLED
    assert guest_appointment.patient_id is None
    assert guest_appointment.guest_name == "Guest Cancel"

@pytest.mark.asyncio
async def test_confirm_regression(client: AsyncClient, admin_token_headers, requested_appointment, db_session):
    """TEST 8 — CONFIRM REGRESSION"""
    response = await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CONFIRMED"},
        headers=admin_token_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "CONFIRMED"

@pytest.mark.asyncio
async def test_error_handling(client: AsyncClient, admin_token_headers, requested_appointment):
    """TEST 10 — ERROR HANDLING"""
    # Cancel an already cancelled appointment
    await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": "First"},
        headers=admin_token_headers
    )
    
    # Try cancelling again
    response = await client.patch(
        f"/api/v1/appointments/{requested_appointment.id}/status",
        json={"status": "CANCELLED", "cancellationReason": "Second"},
        headers=admin_token_headers
    )
    assert response.status_code == 409 # Conflict
    assert "terminal state" in response.json()["detail"]

