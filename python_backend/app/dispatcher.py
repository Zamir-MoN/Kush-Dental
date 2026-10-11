import asyncio
import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, text
from app.db.session import AsyncSessionLocal
from app.models import OutboxStatus
from app.worker import process_booking_task
from app.core.config import settings

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

STALE_TIMEOUT_MINUTES = 5
MAX_ATTEMPTS = 5
BATCH_SIZE = 50

async def dispatch_events():
    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)
        stale_threshold = now - timedelta(minutes=STALE_TIMEOUT_MINUTES)
        
        # Claim records using SKIP LOCKED to support concurrent dispatchers safely
        query = text("""
            UPDATE "OutboxEvent"
            SET status = 'DISPATCHING'::"OutboxStatus",
                "updatedAt" = :now
            WHERE id IN (
                SELECT id FROM "OutboxEvent"
                WHERE (
                    status = 'PENDING'::"OutboxStatus" AND ("nextAttemptAt" IS NULL OR "nextAttemptAt" <= :now)
                ) OR (
                    status = 'DISPATCHING'::"OutboxStatus" AND "updatedAt" <= :stale_threshold
                )
                ORDER BY "createdAt" ASC
                FOR UPDATE SKIP LOCKED
                LIMIT :batch_size
            )
            RETURNING id, "aggregateId", payload, "attemptCount", "eventType"
        """)
        
        result = await db.execute(query, {
            "now": now,
            "stale_threshold": stale_threshold,
            "batch_size": BATCH_SIZE
        })
        claimed_events = result.fetchall()
        
        if not claimed_events:
            return False
            
        await db.commit() # Commit the claims to the database
        
        logger.info(f"Claimed {len(claimed_events)} outbox events for dispatch.")
        
        # Publish to Celery and update status
        for event in claimed_events:
            event_id = event[0]
            aggregate_id = event[1]
            payload = event[2]
            attempt_count = event[3]
            event_type = event[4]
            
            if event_type == 'urgent_visit_requested':
                try:
                    update_q = text("""
                        UPDATE "OutboxEvent"
                        SET status = 'COMPLETED'::"OutboxStatus",
                            "processedAt" = :now,
                            "updatedAt" = :now
                        WHERE id = :id
                    """)
                    async with AsyncSessionLocal() as update_db:
                        await update_db.execute(update_q, {
                            "now": datetime.now(timezone.utc),
                            "id": event_id
                        })
                        await update_db.commit()
                    logger.info(f"Successfully completed urgent_visit_requested OutboxEvent {event_id} directly")
                except Exception as e:
                    logger.error(f"Failed to complete urgent_visit_requested OutboxEvent {event_id}: {e}")
                continue
            
            try:
                # Publish the existing Celery task
                task_result = process_booking_task.delay(aggregate_id, payload)
                celery_task_id = task_result.id
                
                # Mark DISPATCHED
                update_q = text("""
                    UPDATE "OutboxEvent"
                    SET status = 'DISPATCHED'::"OutboxStatus",
                        "celeryTaskId" = :celery_id,
                        "updatedAt" = :now
                    WHERE id = :id
                """)
                async with AsyncSessionLocal() as update_db:
                    await update_db.execute(update_q, {
                        "celery_id": celery_task_id,
                        "now": datetime.now(timezone.utc),
                        "id": event_id
                    })
                    await update_db.commit()
                logger.info(f"Successfully dispatched OutboxEvent {event_id} -> Celery Task {celery_task_id}")
                
            except Exception as e:
                logger.error(f"Failed to dispatch OutboxEvent {event_id}: {e}")
                
                new_attempt_count = attempt_count + 1
                if new_attempt_count >= MAX_ATTEMPTS:
                    new_status = "'FAILED'"
                    next_attempt = None
                else:
                    new_status = "'PENDING'"
                    # Bounded exponential backoff: 5s * 2^attempt, max 5 mins
                    backoff_seconds = min(5 * (2 ** new_attempt_count), 300)
                    next_attempt = datetime.now(timezone.utc) + timedelta(seconds=backoff_seconds)
                
                update_q = text(f"""
                    UPDATE "OutboxEvent"
                    SET status = {new_status}::"OutboxStatus",
                        "attemptCount" = :attempt_count,
                        "nextAttemptAt" = :next_attempt,
                        "lastError" = :error,
                        "updatedAt" = :now
                    WHERE id = :id
                """)
                async with AsyncSessionLocal() as update_db:
                    try:
                        await update_db.execute(update_q, {
                            "attempt_count": new_attempt_count,
                            "next_attempt": next_attempt,
                            "error": str(e),
                            "now": datetime.now(timezone.utc),
                            "id": event_id
                        })
                        await update_db.commit()
                    except Exception as ex:
                        logger.exception(f"Failed to update db: {ex}")
                    
        return True

async def run_dispatcher():
    logger.info("Starting Kush Dental Outbox Dispatcher...")
    while True:
        try:
            processed = await dispatch_events()
            if not processed:
                await asyncio.sleep(2.0)
        except Exception as e:
            logger.error(f"Unexpected error in dispatcher loop: {e}")
            await asyncio.sleep(5.0)

if __name__ == "__main__":
    asyncio.run(run_dispatcher())
