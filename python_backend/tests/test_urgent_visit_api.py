import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Lead, Contact, OutboxEvent, Priority, Source, ContactStatus, Appointment
import uuid

@pytest.mark.asyncio
async def test_urgent_visit_success(client: AsyncClient, db_session: AsyncSession):
    appts_before = (await db_session.execute(select(Appointment))).scalars().all()
    initial_appts_count = len(appts_before)

    unique_name = f"Urgent Patient {uuid.uuid4()}"
    payload = {
        "name": unique_name,
        "phone": "+1234567890",
        "email": "urgent@example.com",
        "problemDescription": "Severe tooth pain and swelling",
        "startedWhen": "Yesterday morning",
        "preferredContactMethod": "Phone call",
        "captcha_token": "1x00000000000000000000AA"
    }
    
    headers = {"Idempotency-Key": str(uuid.uuid4())}
    response = await client.post("/api/v1/public/urgent-visits", json=payload, headers=headers)
    
    assert response.status_code == 202
    assert response.json()["success"] is True
    
    # Check DB Lead
    leads = (await db_session.execute(select(Lead).where(Lead.name == unique_name))).scalars().all()
    print("LEADS SUCCESS:", [l.id for l in leads], [l.name for l in leads])
    assert len(leads) == 1
    lead = leads[0]
    assert lead.priority == Priority.URGENT
    assert lead.source == Source.URGENT_VISIT
    
    # Check DB Contact
    contacts = (await db_session.execute(select(Contact).where(Contact.leadId == lead.id))).scalars().all()
    assert len(contacts) == 1
    contact = contacts[0]
    assert contact.priority == Priority.URGENT
    assert contact.source == Source.URGENT_VISIT
    assert contact.status == ContactStatus.OPEN
    
    # Check NO Appointment
    appts_after = (await db_session.execute(select(Appointment))).scalars().all()
    assert len(appts_after) == initial_appts_count
    
    # Check Outbox Event
    outbox_events = (await db_session.execute(select(OutboxEvent).where(OutboxEvent.aggregateId == str(lead.id)))).scalars().all()
    assert len(outbox_events) == 1
    assert outbox_events[0].eventType == "urgent_visit_requested"

@pytest.mark.asyncio
async def test_urgent_visit_missing_captcha(client: AsyncClient, db_session: AsyncSession):
    payload = {
        "name": "Urgent Patient 2",
        "phone": "+1234567890",
        "email": "urgent@example.com",
        "problemDescription": "Severe tooth pain and swelling"
    }
    headers = {"Idempotency-Key": str(uuid.uuid4())}
    
    response = await client.post("/api/v1/public/urgent-visits", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Human verification failed" in response.json()["detail"]
    
    leads = (await db_session.execute(select(Lead).where(Lead.name == "Urgent Patient 2"))).scalars().all()
    assert len(leads) == 0

@pytest.mark.asyncio
async def test_urgent_visit_honeypot(client: AsyncClient, db_session: AsyncSession):
    payload = {
        "name": "Bot Patient",
        "phone": "+1234567890",
        "email": "bot@example.com",
        "problemDescription": "Spam spam",
        "website_url": "http://spam.com",
        "captcha_token": "1x00000000000000000000AA"
    }
    headers = {"Idempotency-Key": str(uuid.uuid4())}
    
    response = await client.post("/api/v1/public/urgent-visits", json=payload, headers=headers)
    assert response.status_code == 202
    
    leads = (await db_session.execute(select(Lead).where(Lead.name == "Bot Patient"))).scalars().all()
    assert len(leads) == 0

@pytest.mark.asyncio
async def test_urgent_visit_idempotency(client: AsyncClient, db_session: AsyncSession):
    unique_name = f"Idempotent {uuid.uuid4()}"
    payload = {
        "name": unique_name,
        "phone": "+1234567890",
        "email": "idemp@example.com",
        "problemDescription": "Toothache",
        "captcha_token": "1x00000000000000000000AA"
    }
    idem_key = str(uuid.uuid4())
    headers = {"Idempotency-Key": idem_key}
    
    res1 = await client.post("/api/v1/public/urgent-visits", json=payload, headers=headers)
    assert res1.status_code == 202
    
    res2 = await client.post("/api/v1/public/urgent-visits", json=payload, headers=headers)
    assert res2.status_code == 202
    
    leads = (await db_session.execute(select(Lead).where(Lead.name == unique_name))).scalars().all()
    print("LEADS IDEMPOTENCY:", [l.id for l in leads], [l.name for l in leads])
    assert len(leads) == 1
