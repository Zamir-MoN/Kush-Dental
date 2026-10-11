import asyncio
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "kush_dental_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone=settings.CLINIC_TIMEZONE,
    enable_utc=True,
    task_always_eager=(settings.NODE_ENV == 'test'),
    # Configure retry policy implicitly using Celery defaults (which we will configure on the task decorator)
)

# We will define the task in this file to keep it simple, or we can import it.
# We'll define it right here.

@celery_app.task(
    bind=True,
    name="app.worker.process_booking_task",
    max_retries=3,
    default_retry_delay=5,  # 5 seconds backoff initially
    rate_limit=settings.CELERY_TASK_RATE_LIMIT
)
def process_booking_task(self, lead_id: str, lead_data_dict: dict):
    """
    Task to process the public booking/lead request asynchronously.
    """
    from app.schemas.lead import PublicLeadCreate
    from app.db.session import AsyncSessionLocal
    import logging
    from app.services.public_booking_service import process_public_booking
    
    logger = logging.getLogger(__name__)
    
    
    async def _main():
        try:
            lead_data = PublicLeadCreate(**lead_data_dict)
            async with AsyncSessionLocal() as db:
                await process_public_booking(db, lead_id, lead_data)
                
                from sqlalchemy import text
                from datetime import datetime, timezone
                await db.execute(text("""
                    UPDATE "OutboxEvent"
                    SET status = 'COMPLETED'::"OutboxStatus",
                        "processedAt" = :now,
                        "updatedAt" = :now
                    WHERE "aggregateId" = :lead_id
                """), {
                    "now": datetime.now(timezone.utc),
                    "lead_id": lead_id
                })
                await db.commit()
        except Exception as exc:
            logger.error(f"Error processing booking for task {self.request.id}: {exc}")
            
            is_validation_error = 'validation' in str(exc).lower() or 'pydantic' in str(type(exc)).lower()
            if is_validation_error or 'Idempotency key already used' in str(exc) or '409' in str(exc) or 'invalid' in str(exc).lower() or '400' in str(exc):
                try:
                    async with AsyncSessionLocal() as db:
                        from sqlalchemy import text
                        from datetime import datetime, timezone
                        await db.execute(text("""
                            UPDATE "OutboxEvent"
                            SET status = 'FAILED'::"OutboxStatus",
                                "lastError" = :error,
                                "updatedAt" = :now
                            WHERE "aggregateId" = :lead_id
                        """), {
                            "error": str(exc),
                            "now": datetime.now(timezone.utc),
                            "lead_id": lead_id
                        })
                        await db.commit()
                except Exception as db_exc:
                    logger.error(f"Failed to mark DB as FAILED for {lead_id}: {db_exc}")
                raise exc
            raise exc
    try:
        asyncio.run(_main())
    except Exception as exc:
        is_validation_error = 'validation' in str(exc).lower() or 'pydantic' in str(type(exc)).lower()
        if is_validation_error or 'Idempotency key already used' in str(exc) or '409' in str(exc) or 'invalid' in str(exc).lower() or '400' in str(exc):
            raise exc
        
        delay = self.default_retry_delay * (2 ** self.request.retries)
        raise self.retry(exc=exc, countdown=delay)

