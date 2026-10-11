import pytest
from datetime import datetime, timezone, timedelta
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from unittest.mock import patch, MagicMock
import uuid

from app.dispatcher import dispatch_events

@pytest.fixture(autouse=True)
def mock_session_local(db_session):
    # Mock AsyncSessionLocal to yield the test db_session
    class MockSessionLocal:
        async def __aenter__(self):
            return db_session
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass # db_session lifecycle is managed by the fixture

    with patch("app.dispatcher.AsyncSessionLocal", return_value=MockSessionLocal()):
        yield

@pytest.mark.asyncio
async def test_dispatcher_claims_and_publishes(db_session: AsyncSession):
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    now = datetime.now(timezone.utc)
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'public_booking', :agg_id, :idem_key, '{"test": "payload"}', 'PENDING'::"OutboxStatus", 0, :now, :now)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "now": now
    })
    await db_session.commit()
    
    with patch("app.dispatcher.process_booking_task.delay") as mock_delay:
        class MockResult:
            id = "test-celery-task-id"
        mock_delay.return_value = MockResult()
        
        processed = await dispatch_events()
        assert processed is True
        mock_delay.assert_called_once_with(lead_id, {"test": "payload"})
    
    result = await db_session.execute(text("SELECT status, \"celeryTaskId\" FROM \"OutboxEvent\" WHERE id = :id"), {"id": event_id})
    row = result.fetchone()
    assert row[0] == "DISPATCHED"
    assert row[1] == "test-celery-task-id"

@pytest.mark.asyncio
async def test_dispatcher_handles_publication_failure(db_session: AsyncSession):
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    now = datetime.now(timezone.utc)
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'public_booking', :agg_id, :idem_key, '{"test": "payload"}', 'PENDING'::"OutboxStatus", 0, :now, :now)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "now": now
    })
    await db_session.commit()
    
    with patch("app.dispatcher.process_booking_task.delay", side_effect=Exception("Redis offline")):
        processed = await dispatch_events()
        assert processed is True
    
    result = await db_session.execute(text("SELECT status, \"attemptCount\", \"nextAttemptAt\" FROM \"OutboxEvent\" WHERE id = :id"), {"id": event_id})
    row = result.fetchone()
    assert row[0] == "PENDING"
    assert row[1] == 1
    assert row[2] > now

@pytest.mark.asyncio
async def test_dispatcher_claims_stale_dispatching(db_session: AsyncSession):
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    now = datetime.now(timezone.utc)
    stale_time = now - timedelta(minutes=6)
    
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'public_booking', :agg_id, :idem_key, '{"test": "payload"}', 'DISPATCHING'::"OutboxStatus", 0, :stale, :stale)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "stale": stale_time
    })
    await db_session.commit()
    
    with patch("app.dispatcher.process_booking_task.delay") as mock_delay:
        class MockResult:
            id = "test-celery-task-id"
        mock_delay.return_value = MockResult()
        
        processed = await dispatch_events()
        assert processed is True
        
    result = await db_session.execute(text("SELECT status FROM \"OutboxEvent\" WHERE id = :id"), {"id": event_id})
    row = result.fetchone()
    assert row[0] == "DISPATCHED"

@pytest.mark.asyncio
async def test_duplicate_task_delivery_idempotent(db_session: AsyncSession):
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    now = datetime.now(timezone.utc)
    starts = now + timedelta(days=2)
    ends = starts + timedelta(hours=1)
    
    from app.schemas.lead import LeadCreate
    from app.repositories import lead_repo
    from app.services.public_booking_service import process_public_booking
    from app.schemas.lead import PublicLeadCreate
    
    unique_phone = f"+1555{uuid.uuid4().int % 10000000:07d}"
    
    lead_in = LeadCreate(
        name="Idempotent Test",
        email="idem@example.com",
        phone=unique_phone,
        desiredTreatment="Cleaning",
        idempotencyKey=uuid.uuid4()
    )
    lead = await lead_repo.create(db_session, lead_in)
    await db_session.commit()
    
    lead_id_str = str(lead.id)
    
    payload = PublicLeadCreate(
        name="Idempotent Test",
        email="idem@example.com",
        phone=unique_phone,
        desiredTreatment="Cleaning",
        startsAt=starts,
        endsAt=ends
    )
    
    await process_public_booking(db_session, lead_id_str, payload)
    await process_public_booking(db_session, lead_id_str, payload)
    
    result_patients = await db_session.execute(text("SELECT count(*) FROM \"Patient\" WHERE phone = :phone"), {"phone": unique_phone})
    assert result_patients.scalar() == 1
    
    result_contacts = await db_session.execute(text("SELECT count(*) FROM \"Contact\" WHERE \"leadId\" = :lid"), {"lid": lead.id})
    assert result_contacts.scalar() == 1
    
    patient_query = await db_session.execute(text("SELECT id FROM \"Patient\" WHERE phone = :phone"), {"phone": unique_phone})
    patient_id = patient_query.scalar()
    result_apts = await db_session.execute(text("SELECT count(*) FROM \"Appointment\" WHERE \"patientId\" = :pid"), {"pid": patient_id})
    assert result_apts.scalar() == 1

@pytest.mark.asyncio
async def test_dispatcher_max_retries(db_session: AsyncSession):
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    now = datetime.now(timezone.utc)
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'public_booking', :agg_id, :idem_key, '{"test": "payload"}', 'PENDING'::"OutboxStatus", 4, :now, :now)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "now": now
    })
    await db_session.commit()
    
    with patch("app.dispatcher.process_booking_task.delay", side_effect=Exception("Redis offline")):
        processed = await dispatch_events()
        assert processed is True
    
    result = await db_session.execute(text("SELECT status FROM \"OutboxEvent\" WHERE id = :id"), {"id": event_id})
    row = result.fetchone()
    assert row[0] == "FAILED"

@pytest.mark.asyncio
async def test_dispatcher_handles_urgent_visit_requested_directly(db_session: AsyncSession):
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    now = datetime.now(timezone.utc)
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'urgent_visit_requested', :agg_id, :idem_key, '{"test": "payload"}', 'PENDING'::"OutboxStatus", 0, :now, :now)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "now": now
    })
    await db_session.commit()
    
    with patch("app.dispatcher.process_booking_task.delay") as mock_delay:
        processed = await dispatch_events()
        assert processed is True
        mock_delay.assert_not_called()
    
    result = await db_session.execute(text("SELECT status, \"celeryTaskId\" FROM \"OutboxEvent\" WHERE id = :id"), {"id": event_id})
    row = result.fetchone()
    assert row[0] == "COMPLETED"
    assert row[1] is None
