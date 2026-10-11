import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models import Blog, BlogStatus, LeadStatus
from app.schemas.lead import PublicLeadCreate, PublicLeadResponse, LeadCreate
from app.schemas.blog import BlogResponse
from app.services import lead_service
from app.api.dependencies import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

from app.api.rate_limiter import check_public_lead_rate_limit

@router.post(
    "/leads",
    response_model=PublicLeadResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(check_public_lead_rate_limit)]
)
async def create_public_lead(
    request: Request,
    lead_data: PublicLeadCreate,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db)
):
    import uuid
    try:
        uuid_obj = uuid.UUID(idempotency_key)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Idempotency-Key format. Must be a UUID.")
        
    if lead_data.website_url:
        # Honeypot triggered. Silently reject.
        return {"success": True, "message": "Booking request received."}
        
    try:
        from app.worker import process_booking_task
        from app.core.config import settings
        from app.utils.idempotency import get_payload_fingerprint
        from sqlalchemy.exc import IntegrityError
        from app.schemas.lead import LeadCreate
        from app.repositories import lead_repo
        from app.utils.phone import normalize_phone
        from app.services.captcha_service import verify_turnstile_token
        from app.api.rate_limiter import get_client_ip
        
        # Verify CAPTCHA token
        ip = get_client_ip(request)
        is_human = await verify_turnstile_token(lead_data.captcha_token, remote_ip=ip)
        if not is_human:
            raise HTTPException(status_code=400, detail="Human verification failed. Please try again.")
        from sqlalchemy import select
        from app.models import Lead, OutboxEvent, OutboxStatus, Source
        from datetime import datetime, timezone
        
        fingerprint = get_payload_fingerprint(lead_data)
        normalized_phone = normalize_phone(lead_data.phone)
        source_val = Source.INQUIRY
        
        try:
            # Atomic durable inbox insertion
            internal_lead = LeadCreate(
                name=lead_data.name,
                email=lead_data.email,
                phone=normalized_phone,
                desiredTreatment=lead_data.desiredTreatment,
                notes=None,
                idempotencyKey=uuid_obj,
                payloadFingerprint=fingerprint,
                source=source_val
            )
            created_lead = await lead_repo.create(db, internal_lead)
            await db.commit()
            lead_id = str(created_lead.id)
        except IntegrityError as e:
            await db.rollback()
            if 'idempotencyKey' in str(e):
                # Request was already durably recorded
                existing = await db.execute(select(Lead).where(Lead.idempotencyKey == uuid_obj))
                existing_lead = existing.scalar_one_or_none()
                if not existing_lead:
                    raise HTTPException(status_code=500, detail="Idempotency key collision but record missing")
                
                if existing_lead.payloadFingerprint != fingerprint:
                    raise HTTPException(status_code=409, detail="Idempotency key already used with a different payload.")
                
                lead_id = str(existing_lead.id)
            else:
                raise

        if settings.NODE_ENV == 'test':
            from app.services.public_booking_service import process_public_booking
            try:
                pass # Sync processing removed in this phase, outbox testing will handle it
            except HTTPException:
                raise
            except Exception as e:
                import logging
                logging.error(f"Background task failed in test mode: {e}")
        else:
            # Removed direct .delay() call - outbox dispatcher will handle this.
            pass
            
            
        return PublicLeadResponse(
            success=True,
            message="Your request has been received. Our team will contact you shortly."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error enqueuing public lead: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit request")

@router.post(
    "/appointments",
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(check_public_lead_rate_limit)]
)
async def create_public_appointment(
    request: Request,
    lead_data: PublicLeadCreate,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db)
):
    import uuid
    try:
        uuid_obj = uuid.UUID(idempotency_key)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Idempotency-Key format. Must be a UUID.")
        
    if lead_data.website_url:
        return {"success": True, "message": "Booking request received."}
        
    try:
        from app.utils.idempotency import get_payload_fingerprint
        from sqlalchemy.exc import IntegrityError
        from app.utils.phone import normalize_phone
        from app.services.captcha_service import verify_turnstile_token
        from app.api.rate_limiter import get_client_ip
        from sqlalchemy import select
        from app.models import Appointment, AppointmentStatus
        from datetime import timedelta, datetime, timezone
        
        # Verify CAPTCHA token
        ip = get_client_ip(request)
        is_human = await verify_turnstile_token(lead_data.captcha_token, remote_ip=ip)
        if not is_human:
            raise HTTPException(status_code=400, detail="Human verification failed. Please try again.")
        
        normalized_phone = normalize_phone(lead_data.phone)
        
        if not lead_data.startsAt:
            raise HTTPException(status_code=400, detail="startsAt is required for an appointment booking")
            
        try:
            apt = Appointment(
                patientId=None,
                treatment=lead_data.desiredTreatment or "Consultation",
                startsAt=lead_data.startsAt,
                endsAt=lead_data.startsAt + timedelta(hours=1),
                status=AppointmentStatus.REQUESTED,
                guestName=lead_data.name,
                guestPhone=normalized_phone,
                guestEmail=lead_data.email,
                idempotencyKey=uuid_obj,
                updatedAt=datetime.now(timezone.utc)
            )
            db.add(apt)
            await db.commit()
        except IntegrityError as e:
            await db.rollback()
            if getattr(e.orig, 'pgcode', None) == '23505' and ('idempotencyKey' in str(e.orig) or 'idempotencykey' in str(e.orig).lower()):
                pass # Already processed
            else:
                raise
                
        return {"success": True, "message": "Booking request received. Our team will contact you shortly."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating public appointment: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit appointment request")

@router.get("/blog", response_model=List[BlogResponse])
async def list_public_blogs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List published blogs for the public website."""
    result = await db.execute(
        select(Blog)
        .where(Blog.deletedAt.is_(None), Blog.status == BlogStatus.PUBLISHED)
        .order_by(Blog.publishedAt.desc().nullslast())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/blog/{slug}", response_model=BlogResponse)
async def get_public_blog(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific published blog by slug."""
    result = await db.execute(
        select(Blog)
        .where(Blog.slug == slug, Blog.deletedAt.is_(None), Blog.status == BlogStatus.PUBLISHED)
    )
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog


from app.schemas.lead import PublicUrgentVisitCreate

@router.post(
    "/urgent-visits",
    response_model=PublicLeadResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(check_public_lead_rate_limit)]
)
async def create_urgent_visit(
    request: Request,
    urgent_data: PublicUrgentVisitCreate,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db)
):
    import uuid
    try:
        uuid_obj = uuid.UUID(idempotency_key)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Idempotency-Key format. Must be a UUID.")
        
    if urgent_data.website_url:
        # Honeypot triggered. Silently reject.
        return {"success": True, "message": "Your urgent visit request has been received. Our team will contact you as soon as possible."}
        
    try:
        from app.utils.idempotency import get_payload_fingerprint
        from sqlalchemy.exc import IntegrityError
        from app.utils.phone import normalize_phone
        from app.services.captcha_service import verify_turnstile_token
        from app.api.rate_limiter import get_client_ip
        from app.models import Lead, Contact, ContactStatus, Priority, Source, OutboxEvent, OutboxStatus
        from datetime import datetime, timezone
        from sqlalchemy import select
        
        # Verify CAPTCHA token
        ip = get_client_ip(request)
        is_human = await verify_turnstile_token(urgent_data.captcha_token, remote_ip=ip)
        if not is_human:
            raise HTTPException(status_code=400, detail="Human verification failed. Please try again.")
            
        fingerprint = get_payload_fingerprint(urgent_data)
        normalized_phone = normalize_phone(urgent_data.phone)
        
        try:
            # Atomic transaction for Lead, Contact, and OutboxEvent
            lead = Lead(
                name=urgent_data.name,
                email=urgent_data.email,
                phone=normalized_phone,
                desiredTreatment=None,
                notes=f"Problem: {urgent_data.problemDescription}\nStarted: {urgent_data.startedWhen}\nPreferred Contact: {urgent_data.preferredContactMethod}",
                status=LeadStatus.NEW,
                priority=Priority.URGENT,
                source=Source.URGENT_VISIT,
                idempotencyKey=uuid_obj,
                payloadFingerprint=fingerprint,
                updatedAt=datetime.now(timezone.utc)
            )
            db.add(lead)
            await db.flush() # get lead.id
            
            contact = Contact(
                leadId=lead.id,
                status=ContactStatus.OPEN,
                priority=Priority.URGENT,
                source=Source.URGENT_VISIT,
                notes=f"Problem: {urgent_data.problemDescription}",
                updatedAt=datetime.now(timezone.utc)
            )
            db.add(contact)
            
            outbox_event = OutboxEvent(
                eventType='urgent_visit_requested',
                aggregateId=str(lead.id),
                idempotencyKey=uuid_obj,
                payload=urgent_data.model_dump(mode='json'),
                status=OutboxStatus.PENDING,
                updatedAt=datetime.now(timezone.utc)
            )
            db.add(outbox_event)
            
            # Audit log
            from app.models import AuditLog, AuditResult
            audit_log = AuditLog(
                action="URGENT_VISIT_CREATED",
                resourceType="Lead",
                resourceId=lead.id,
                result=AuditResult.SUCCESS,
                metadata_={"phone_hash": hash(normalized_phone)} # Or safe metadata
            )
            db.add(audit_log)
            
            await db.commit()
            
        except IntegrityError as e:
            await db.rollback()
            if 'Lead_idempotencyKey_key' in str(e):
                existing = await db.execute(select(Lead).where(Lead.idempotencyKey == uuid_obj))
                existing_lead = existing.scalar_one_or_none()
                if not existing_lead:
                    raise HTTPException(status_code=500, detail="Idempotency key collision but record missing")
                
                if existing_lead.payloadFingerprint != fingerprint:
                    raise HTTPException(status_code=409, detail="Idempotency key already used with a different payload.")
            else:
                raise
                
        return PublicLeadResponse(
            success=True,
            message="Your urgent visit request has been received. Our team will contact you as soon as possible."
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

