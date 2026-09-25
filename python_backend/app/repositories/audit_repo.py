from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional
from app.models import AuditLog, AuditResult

async def log_event(
    db: AsyncSession,
    action: str,
    resource_type: str,
    result: AuditResult,
    actor_id: Optional[UUID] = None,
    resource_id: Optional[UUID] = None,
    metadata_: Optional[dict] = None
) -> AuditLog:
    log_entry = AuditLog(
        actorId=actor_id,
        action=action,
        resourceType=resource_type,
        resourceId=resource_id,
        result=result,
        metadata_=metadata_,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(log_entry)
    await db.flush()
    return log_entry
