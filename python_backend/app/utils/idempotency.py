import json
import hashlib
from app.schemas.lead import PublicLeadCreate
from app.utils.phone import normalize_phone

def get_payload_fingerprint(lead_data) -> str:
    normalized_phone = normalize_phone(lead_data.phone)
    payload_dict = {
        "name": lead_data.name.strip().lower(),
        "phone": normalized_phone,
        "email": lead_data.email.strip().lower() if lead_data.email else None,
        "desiredTreatment": getattr(lead_data, "desiredTreatment", None).strip() if getattr(lead_data, "desiredTreatment", None) else None,
        "problemDescription": getattr(lead_data, "problemDescription", None).strip() if getattr(lead_data, "problemDescription", None) else None,
    }
    
    if getattr(lead_data, "startsAt", None) and getattr(lead_data, "endsAt", None):
        payload_dict["startsAt"] = lead_data.startsAt.isoformat()
        payload_dict["endsAt"] = lead_data.endsAt.isoformat()
        
    canonical_json = json.dumps(payload_dict, sort_keys=True)
    return hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()

async def check_idempotency_in_redis(idempotency_key: str, fingerprint: str) -> bool:
    """
    Returns True if this is a new request.
    Returns False if an identical request was already processed/queued.
    Raises HTTPException(409) if the idempotency key was used with a different payload.
    """
    import redis.asyncio as aioredis
    from fastapi import HTTPException
    from app.core.config import settings
    
    redis_client = aioredis.from_url(settings.CELERY_BROKER_URL)
    redis_key = f"idem:booking:{idempotency_key}"
    
    try:
        # Use NX to set only if it doesn't exist
        # EX=86400 to keep the key for 24 hours
        success = await redis_client.set(redis_key, fingerprint, nx=True, ex=86400)
        
        if success:
            return True
            
        # Key exists, check if payload fingerprint matches
        existing_fingerprint_bytes = await redis_client.get(redis_key)
        if existing_fingerprint_bytes:
            existing_fingerprint = existing_fingerprint_bytes.decode('utf-8')
            if existing_fingerprint != fingerprint:
                raise HTTPException(status_code=409, detail="Idempotency key already used with a different payload.")
                
        return False
    finally:
        await redis_client.aclose()
