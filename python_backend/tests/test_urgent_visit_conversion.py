import pytest
import uuid
from httpx import AsyncClient
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Lead, Contact, LeadStatus, Priority, Source, Patient, Appointment

pytestmark = pytest.mark.asyncio

async def test_urgent_contact_response_includes_lead_data(
    client: AsyncClient,
    db_session: AsyncSession,
    doctor_auth_headers: dict
):
    # 1. Create a Lead
    lead = Lead(
        name="Urgent Bob",
        phone="555-URG-123",
        email="bob@urgent.com",
        status=LeadStatus.NEW,
        priority=Priority.URGENT,
        source=Source.URGENT_VISIT,
        notes="Urgent tooth pain",
        updatedAt=datetime.now(timezone.utc)
    )
    db_session.add(lead)
    await db_session.commit()
    await db_session.refresh(lead)

    # 2. Create a Contact tied only to the Lead
    contact = Contact(
        leadId=lead.id,
        status="OPEN",
        priority=Priority.URGENT,
        source=Source.URGENT_VISIT,
        notes="Needs help fast",
        updatedAt=datetime.now(timezone.utc)
    )
    db_session.add(contact)
    await db_session.commit()
    await db_session.refresh(contact)

    # Fetch Contact
    res = await client.get(f"/api/v1/contacts/{contact.id}", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    
    assert data["patient"] is None
    assert data["lead"] is not None
    assert data["lead"]["id"] == str(lead.id)
    assert data["lead"]["name"] == "Urgent Bob"
    assert data["lead"]["phone"] == "555-URG-123"
    assert data["lead"]["email"] == "bob@urgent.com"
    assert data["lead"]["notes"] == "Urgent tooth pain"
    assert data["lead"]["status"] == "NEW"

async def test_convert_urgent_lead_creates_patient_and_updates_contact(
    client: AsyncClient,
    db_session: AsyncSession,
    staff_auth_headers: dict
):
    unique_phone = f"+1234{str(uuid.uuid4().int)[:6]}"
    # Create Lead and Contact
    lead = Lead(
        name="Urgent Sarah",
        phone=unique_phone,
        status=LeadStatus.NEW,
        priority=Priority.URGENT,
        source=Source.URGENT_VISIT,
        updatedAt=datetime.now(timezone.utc)
    )
    db_session.add(lead)
    await db_session.commit()
    await db_session.refresh(lead)

    contact = Contact(
        leadId=lead.id,
        status="OPEN",
        priority=Priority.URGENT,
        source=Source.URGENT_VISIT,
        updatedAt=datetime.now(timezone.utc)
    )
    db_session.add(contact)
    await db_session.commit()
    await db_session.refresh(contact)

    # Convert Lead as STAFF
    res = await client.post(f"/api/v1/leads/{lead.id}/convert", headers=staff_auth_headers)
    assert res.status_code == 200

    # Verify Lead is CONVERTED
    await db_session.refresh(lead)
    assert lead.status.name == "CONVERTED"

    # Verify Contact is updated with patientId
    await db_session.refresh(contact)
    assert contact.patientId is not None
    
    # Verify Patient is created
    result = await db_session.execute(select(Patient).where(Patient.id == contact.patientId))
    patient = result.scalar_one_or_none()
    assert patient is not None
    assert patient.fullName == "Urgent Sarah"

    # Verify NO Appointment was created
    apt_res = await db_session.execute(select(Appointment).where(Appointment.patientId == patient.id))
    assert apt_res.scalar_one_or_none() is None

async def test_convert_lead_unauthorized(
    client: AsyncClient,
    db_session: AsyncSession
):
    lead = Lead(
        name="Hacker Bob",
        phone="555-HACK",
        status=LeadStatus.NEW,
        updatedAt=datetime.now(timezone.utc)
    )
    db_session.add(lead)
    await db_session.commit()
    await db_session.refresh(lead)

    res = await client.post(f"/api/v1/leads/{lead.id}/convert")
    assert res.status_code in [401, 403]
