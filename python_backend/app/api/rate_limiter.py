from fastapi import Request, HTTPException, status, Depends
import time
import asyncio
from collections import defaultdict
from typing import Dict, Tuple

from app.core.config import settings
from app.api.dependencies import get_current_user
from app.models import User



def get_client_ip(request: Request) -> str:
    # Handle trusted proxies safely
    client_ip = request.client.host if request.client else "127.0.0.1"
    forwarded = request.headers.get("x-forwarded-for")
    
    if forwarded:
        # If client is a trusted proxy, parse the forwarded header
        if client_ip in settings.TRUSTED_PROXIES:
            ips = [ip.strip() for ip in forwarded.split(",")]
            # Iterate from right to left (most trustworthy to least)
            for ip in reversed(ips):
                if ip not in settings.TRUSTED_PROXIES:
                    return ip
            return ips[-1]
            
    return client_ip

import redis.asyncio as aioredis

async def check_login_rate_limit(request: Request):
    ip = get_client_ip(request)
    
    redis_key = f"login_rl:{ip}"
    redis_client = aioredis.from_url(settings.CELERY_BROKER_URL)
    
    try:
        attempts = await redis_client.get(redis_key)
        attempts = int(attempts) if attempts else 0
        
        if attempts > 0:
            # Progressive delay (tarpitting)
            delay = min(2 ** attempts, 10.0) # max 10 seconds delay
            await asyncio.sleep(delay)
            
        if attempts >= int(getattr(settings, "LOGIN_MAX_ATTEMPTS", 10)):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many login attempts")
    finally:
        await redis_client.aclose()

async def record_login_failure(request: Request):
    ip = get_client_ip(request)
    redis_key = f"login_rl:{ip}"
    redis_client = aioredis.from_url(settings.CELERY_BROKER_URL)
    
    try:
        count = await redis_client.incr(redis_key)
        if count == 1:
            await redis_client.expire(redis_key, 900) # Reset after 15 minutes
    finally:
        await redis_client.aclose()

async def record_login_success(request: Request):
    ip = get_client_ip(request)
    redis_key = f"login_rl:{ip}"
    redis_client = aioredis.from_url(settings.CELERY_BROKER_URL)
    
    try:
        await redis_client.delete(redis_key)
    finally:
        await redis_client.aclose()

async def check_public_lead_rate_limit(request: Request):
    ip = get_client_ip(request)
    
    # Parse rate limit setting
    limit_str = getattr(settings, "PUBLIC_LEAD_RATE_LIMIT", "5/minute")
    try:
        max_requests_str, window_str = limit_str.split("/")
        max_requests = int(max_requests_str)
        if window_str == "minute":
            window = 60
        elif window_str == "hour":
            window = 3600
        else:
            window = 60
    except ValueError:
        max_requests, window = 5, 60
        
    redis_key = f"public_lead_rl:{ip}"
    
    redis_client = aioredis.from_url(settings.CELERY_BROKER_URL)
    
    try:
        count = await redis_client.incr(redis_key)
        if count == 1:
            await redis_client.expire(redis_key, window)
            
        if count > max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please wait a moment and try again.",
                headers={"Retry-After": str(window)}
            )
    finally:
        await redis_client.aclose()

async def check_dxgen_rate_limit(user: User = Depends(get_current_user)):
    limit = int(getattr(settings, "DXGEN_MAX_REQUESTS_PER_MINUTE", 10))
    redis_key = f"dxgen_rl:{user.id}"
    
    redis_client = aioredis.from_url(settings.CELERY_BROKER_URL)
    try:
        count = await redis_client.incr(redis_key)
        if count == 1:
            await redis_client.expire(redis_key, 60)
            
        if count > limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI Service rate limit exceeded. Please wait.",
                headers={"Retry-After": "60"}
            )
    finally:
        await redis_client.aclose()
