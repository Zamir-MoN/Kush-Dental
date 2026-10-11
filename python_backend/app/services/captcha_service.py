import httpx
from fastapi import HTTPException
from app.core.config import settings

VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

async def verify_turnstile_token(token: str, remote_ip: str | None = None) -> bool:
    """
    Verifies a Cloudflare Turnstile token server-side.
    Returns True if valid, False if invalid or network fails.
    """
    if not token:
        return False
        
    data = {
        "secret": settings.TURNSTILE_SECRET_KEY,
        "response": token
    }
    
    if remote_ip:
        data["remoteip"] = remote_ip
        
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(VERIFY_URL, data=data)
            
        if response.status_code == 200:
            result = response.json()
            return result.get("success", False)
        return False
    except (httpx.RequestError, ValueError):
        # On network failure or JSON parse error, we return False (safe failure).
        # Depending on strictness, we might want to return True to not block users,
        # but the prompt says: "Provider network failure -> safe failure. Invalid token -> rejected"
        # "Safe temporary error" -> We could raise a 503 Service Unavailable, or just 400.
        # "D. Provider verification timeout/network failure -> safe temporary error."
        raise HTTPException(
            status_code=503,
            detail="Human verification temporarily unavailable. Please try again."
        )
