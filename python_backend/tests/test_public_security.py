import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta, timezone
import uuid
import asyncio

@pytest.mark.asyncio
async def test_honeypot_rejection(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    
    payload = {
        "name": "Spammer",
        "email": "spam@example.com",
        "phone": "+1-555-999-0000",
        "website_url": "http://spam.com",
        "startsAt": now.isoformat(),
        "endsAt": (now + timedelta(hours=1)).isoformat()
    }
    
    idempotency_key = str(uuid.uuid4())
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"X-Forwarded-For": "100.1.1.99", "Idempotency-Key": idempotency_key}
    )
    
    # Should silently reject and return 202
    assert response.status_code == 202
    assert response.json()["success"] is True
    
    # Verify NO lead was created
    result = await db_session.execute(text("SELECT id FROM \"Lead\" WHERE phone = '15559990000'"))
    assert result.fetchone() is None
    
    # Verify NO outbox event was created
    result_o = await db_session.execute(text("SELECT status FROM \"OutboxEvent\" WHERE \"idempotencyKey\" = :ik"), {"ik": idempotency_key})
    assert result_o.fetchone() is None

@pytest.mark.asyncio
async def test_public_rate_limiting(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    
    payload = {
        "name": "Fast Requester",
        "email": "fast@example.com",
        "phone": "+1-555-888-0000",
        "captcha_token": "1x00000000000000000000AA",
        "startsAt": now.isoformat(),
        "endsAt": (now + timedelta(hours=1)).isoformat()
    }
    
    # Assuming limit is 5 per minute
    ip = f"100.2.2.{uuid.uuid4().int % 255}"
    
    # Make 5 requests
    for i in range(5):
        ik = str(uuid.uuid4())
        response = await client.post(
            "/api/v1/public/leads", 
            json=payload, 
            headers={"X-Forwarded-For": ip, "Idempotency-Key": ik}
        )
        assert response.status_code == 202
        
    # The 6th request should fail with 429
    ik = str(uuid.uuid4())
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"X-Forwarded-For": ip, "Idempotency-Key": ik}
    )
    assert response.status_code == 429
    assert "Retry-After" in response.headers
    
    # Request from a DIFFERENT IP should succeed
    different_ip = f"100.2.2.{(uuid.uuid4().int % 254) + 1}"
    ik = str(uuid.uuid4())
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"X-Forwarded-For": different_ip, "Idempotency-Key": ik}
    )
    assert response.status_code == 202

@pytest.mark.asyncio
async def test_captcha_valid(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    ik = str(uuid.uuid4())
    payload = {
        "name": "Human",
        "email": "human@example.com",
        "phone": "+1-555-888-0000",
        "captcha_token": "1x00000000000000000000AA", # Valid test token
        "startsAt": now.isoformat(),
        "endsAt": (now + timedelta(hours=1)).isoformat()
    }
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"Idempotency-Key": ik}
    )
    assert response.status_code == 202
    assert response.json()["success"] is True

@pytest.mark.asyncio
async def test_captcha_missing(client: AsyncClient, db_session: AsyncSession):
    now = datetime.now(timezone.utc)
    ik = str(uuid.uuid4())
    payload = {
        "name": "Bot Missing",
        "email": "bot@example.com",
        "phone": "+1-555-888-0000",
        "startsAt": now.isoformat(),
        "endsAt": (now + timedelta(hours=1)).isoformat()
    }
    response = await client.post(
        "/api/v1/public/leads", 
        json=payload, 
        headers={"Idempotency-Key": ik}
    )
    assert response.status_code == 400
    assert "Human verification failed" in response.json()["detail"]
    
    result = await db_session.execute(text("SELECT id FROM \"Lead\" WHERE phone = '15558880000'"))
    assert result.fetchone() is None

@pytest.mark.asyncio
async def test_captcha_invalid(client: AsyncClient, db_session: AsyncSession):
    from app.core.config import settings
    original_secret = settings.TURNSTILE_SECRET_KEY
    settings.TURNSTILE_SECRET_KEY = "2x0000000000000000000000000000000AA" # Always fails
    
    try:
        now = datetime.now(timezone.utc)
        ik = str(uuid.uuid4())
        payload = {
            "name": "Bot Invalid",
            "email": "bot@example.com",
            "phone": "+1-555-888-0000",
            "captcha_token": "any_token_will_fail",
            "startsAt": now.isoformat(),
            "endsAt": (now + timedelta(hours=1)).isoformat()
        }
        response = await client.post(
            "/api/v1/public/leads", 
            json=payload, 
            headers={"Idempotency-Key": ik}
        )
        assert response.status_code == 400
        assert "Human verification failed" in response.json()["detail"]
    finally:
        settings.TURNSTILE_SECRET_KEY = original_secret

@pytest.mark.asyncio
async def test_captcha_timeout_safe_failure():
    from unittest.mock import patch
    import httpx
    from app.services.captcha_service import verify_turnstile_token
    from fastapi import HTTPException
    
    with patch("httpx.AsyncClient.post", side_effect=httpx.TimeoutException("Timeout")):
        try:
            await verify_turnstile_token("valid_token")
            assert False, "Should have raised HTTPException"
        except HTTPException as e:
            assert e.status_code == 503
            assert "Human verification temporarily unavailable" in e.detail

@pytest.mark.asyncio
async def test_captcha_network_safe_failure():
    from unittest.mock import patch
    import httpx
    from app.services.captcha_service import verify_turnstile_token
    from fastapi import HTTPException
    
    with patch("httpx.AsyncClient.post", side_effect=httpx.NetworkError("Network down")):
        try:
            await verify_turnstile_token("valid_token")
            assert False, "Should have raised HTTPException"
        except HTTPException as e:
            assert e.status_code == 503
            assert "Human verification temporarily unavailable" in e.detail
