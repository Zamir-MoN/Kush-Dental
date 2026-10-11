import pytest
from httpx import AsyncClient
import asyncio
from datetime import datetime, timedelta, timezone
import uuid

@pytest.mark.asyncio
async def test_concurrent_public_booking_patient_uniqueness(client: AsyncClient, db_session, patch_redis_from_url, clear_fake_redis):
    # Two simultaneous requests with different idempotency keys but same phone number
    # They should both result in exactly ONE patient created.
    phone = "+19998887777"
    
    start_time = datetime.now(timezone.utc) + timedelta(days=5)
    end_time = start_time + timedelta(hours=1)
    
    payload1 = {
        "name": "Jane Doe",
        "phone": phone,
        "email": "jane@example.com",
        "desiredTreatment": "Exam",
        "startsAt": start_time.isoformat(),
        "endsAt": end_time.isoformat(),
        "captcha_token": "valid_dummy_token"
    }
    
    payload2 = {
        "name": "Jane Doe Two",
        "phone": phone,
        "email": "jane2@example.com",
        "desiredTreatment": "Exam",
        "startsAt": start_time.isoformat(),
        "endsAt": end_time.isoformat(),
        "captcha_token": "valid_dummy_token"
    }
    
    reqs = [
        client.post("/api/v1/public/leads", json=payload1, headers={"Idempotency-Key": str(uuid.uuid4())}),
        client.post("/api/v1/public/leads", json=payload2, headers={"Idempotency-Key": str(uuid.uuid4())})
    ]
    
    responses = await asyncio.gather(*reqs)
    
    # Both should be accepted by the API (since API only inserts Lead and OutboxEvent)
    for r in responses:
        assert r.status_code == 202

    # Now we need to manually process the outbox events using process_public_booking
    # To simulate the Celery workers picking them up concurrently
    from sqlalchemy import select, cast, String
    from app.models import OutboxEvent
    events_query = await db_session.execute(
        select(OutboxEvent)
        .where(OutboxEvent.status == 'PENDING', cast(OutboxEvent.payload['phone'], String) == f'"{phone}"')
        .order_by(OutboxEvent.createdAt.desc())
        .limit(2)
    )
    events = events_query.scalars().all()
    
    assert len(events) == 2
    
    from app.services.public_booking_service import process_public_booking
    from app.schemas.lead import PublicLeadCreate
    import json
    
    async def run_worker(event):
        try:
            # We must use separate sessions for concurrent tasks to truly test DB concurrency
            from app.db.session import AsyncSessionLocal
            async with AsyncSessionLocal() as session:
                lead_data = PublicLeadCreate(**event.payload)
                await process_public_booking(session, event.aggregateId, lead_data)
        except Exception as e:
            return e
            
    worker_results = await asyncio.gather(run_worker(events[0]), run_worker(events[1]))
    print(f"Worker results: {worker_results}")
    
    # One should succeed, one should fail due to Appointment overlap 409 Conflict
    # Let's verify exactly one Patient exists
    from app.models import Patient
    patients_query = await db_session.execute(select(Patient).where(Patient.phone == phone))
    patients = patients_query.scalars().all()
    
    assert len(patients) == 1
    
    # And verify one appointment exists
    from app.models import Appointment
    apts_query = await db_session.execute(select(Appointment).where(Appointment.patientId == patients[0].id))
    apts = apts_query.scalars().all()
    
    assert len(apts) == 1
    
    # And verify one contact exists
    from app.models import Contact
    contacts_query = await db_session.execute(select(Contact).where(Contact.patientId == patients[0].id))
    contacts = contacts_query.scalars().all()
    
    assert len(contacts) == 1
