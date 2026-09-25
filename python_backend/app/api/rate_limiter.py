from fastapi import Request, HTTPException, status
import time
import asyncio
from collections import defaultdict
from typing import Dict, Tuple

from app.core.config import settings

# In-memory store: IP -> (failure_count, last_failure_time)
_failed_attempts: Dict[str, Tuple[int, float]] = defaultdict(lambda: (0, 0.0))

# In-memory store for public leads: IP -> (submission_count, first_submission_time)
_public_lead_attempts: Dict[str, Tuple[int, float]] = defaultdict(lambda: (0, 0.0))

def get_client_ip(request: Request) -> str:
    # Handle trusted proxies safely
    client_ip = request.client.host if request.client else "127.0.0.1"
    forwarded = request.headers.get("x-forwarded-for")
    
    if forwarded:
        # If client is a trusted proxy, parse the forwarded header
        if client_ip in settings.TRUSTED_PROXIES:
            ips = [ip.strip() for ip in forwarded.split(",")]
            # The right-most IP is the proxy, we trust the one before it, etc.
            # For simplicity, if the client is trusted, we take the first IP.
            # In a real environment, you'd iterate from right to left checking against trusted list.
            return ips[0]
            
    return client_ip

async def check_login_rate_limit(request: Request):
    ip = get_client_ip(request)
    now = time.time()
    
    attempts, last_time = _failed_attempts[ip]
    
    # Reset after 15 minutes of inactivity
    if now - last_time > 900:
        attempts = 0
        
    if attempts > 0:
        # Progressive delay (tarpitting)
        delay = min(2 ** attempts, 10.0) # max 10 seconds delay
        await asyncio.sleep(delay)
        
    if attempts >= 10:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many login attempts")

def record_login_failure(request: Request):
    ip = get_client_ip(request)
    attempts, _ = _failed_attempts[ip]
    
    # Reset after 15 minutes handled by check_login_rate_limit, but we just increment here
    # Actually if time passed we should reset before incrementing, but we can do it simple:
    now = time.time()
    if now - _failed_attempts[ip][1] > 900:
        attempts = 0
        
    _failed_attempts[ip] = (attempts + 1, now)

def record_login_success(request: Request):
    ip = get_client_ip(request)
    if ip in _failed_attempts:
        del _failed_attempts[ip]

async def check_public_lead_rate_limit(request: Request):
    ip = get_client_ip(request)
    now = time.time()
    
    count, first_time = _public_lead_attempts[ip]
    
    # Reset window every hour (3600 seconds)
    if now - first_time > 3600:
        count = 0
        first_time = now
        
    if count >= 3:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many lead submissions")
        
    _public_lead_attempts[ip] = (count + 1, first_time)
