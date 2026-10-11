import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.worker import process_booking_task
import uuid
from pydantic_core._pydantic_core import ValidationError



@pytest.mark.asyncio
async def test_worker_handles_pydantic_validation_error(db_session: AsyncSession):
    from datetime import datetime, timezone
    
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'public_booking_requested', :agg_id, :idem_key, '{"test": "payload"}', 'DISPATCHED'::"OutboxStatus", 0, :now, :now)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "now": datetime.now(timezone.utc)
    })
    await db_session.commit()
    
    lead_data_dict = {
        "name": "test",
        "email": "test@test.com",
        "phone": "+919999999999",
        "startedWhen": "2 hours ago" # Invalid field
    }
    
    process_booking_task.push_request(id="test-task", retries=0)
    process_booking_task.default_retry_delay = 5
    
    import asyncio
    
    try:
        with patch.object(process_booking_task, 'retry', side_effect=Exception("Retried with countdown 5")):
            with pytest.raises(Exception) as exc_info:
                await asyncio.to_thread(process_booking_task, lead_id, lead_data_dict)
        assert "validation" in str(exc_info.value).lower() or "extra_forbidden" in str(exc_info.value).lower()
    finally:
        process_booking_task.pop_request()
    
    # Wait a bit for the async thread to finish db changes if any (though it's a synchronous failure in the main thread)
    
    result = await db_session.execute(text("SELECT status FROM \"OutboxEvent\" WHERE \"aggregateId\" = :lead_id"), {"lead_id": lead_id})
    row = result.fetchone()
    assert row[0] == "FAILED"

@pytest.mark.asyncio
async def test_worker_handles_transient_error(db_session: AsyncSession):
    from datetime import datetime, timezone
    
    lead_id = str(uuid.uuid4())
    event_id = uuid.uuid4()
    
    await db_session.execute(text('DELETE FROM "OutboxEvent"'))
    await db_session.commit()
    await db_session.execute(text("""
        INSERT INTO "OutboxEvent" (id, "eventType", "aggregateId", "idempotencyKey", payload, status, "attemptCount", "createdAt", "updatedAt")
        VALUES (:id, 'public_booking_requested', :agg_id, :idem_key, '{"test": "payload"}', 'DISPATCHED'::"OutboxStatus", 0, :now, :now)
    """), {
        "id": event_id,
        "agg_id": lead_id,
        "idem_key": uuid.uuid4(),
        "now": datetime.now(timezone.utc)
    })
    await db_session.commit()
    
    lead_data_dict = {
        "name": "test",
        "email": "test@test.com",
        "phone": "+919999999999",
        "desiredTreatment": "Consultation",
        "captcha_token": "token"
    }
    
    process_booking_task.push_request(id="test-task", retries=0)
    process_booking_task.default_retry_delay = 5
    
    import asyncio
    
    try:
        with patch("app.services.public_booking_service.process_public_booking", side_effect=Exception("Database connection failed")):
            with patch.object(process_booking_task, 'retry', side_effect=Exception("Retried with countdown 5")):
                with pytest.raises(Exception, match="Retried with countdown 5"):
                    await asyncio.to_thread(process_booking_task, lead_id, lead_data_dict)
    finally:
        process_booking_task.pop_request()
    
    result = await db_session.execute(text("SELECT status FROM \"OutboxEvent\" WHERE \"aggregateId\" = :lead_id"), {"lead_id": lead_id})
    row = result.fetchone()
    assert row[0] == "DISPATCHED" # Status remains DISPATCHED during retry
