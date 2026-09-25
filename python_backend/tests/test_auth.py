import pytest
from httpx import AsyncClient
from app.models import Role
import time

pytestmark = pytest.mark.asyncio

async def test_login_success(client: AsyncClient, doctor_user, csrf_token):
    payload = {"email": doctor_user.email, "password": "pass"}
    resp = await client.post("/api/v1/auth/login", json=payload, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in resp.cookies
    assert data["user"]["role"] == Role.DOCTOR.value

async def test_login_invalid_password(client: AsyncClient, doctor_user, csrf_token):
    payload = {"email": doctor_user.email, "password": "wrongpassword"}
    resp = await client.post("/api/v1/auth/login", json=payload, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 401

async def test_csrf_protection_missing_header(client: AsyncClient, doctor_user, csrf_token):
    payload = {"email": doctor_user.email, "password": "pass"}
    resp = await client.post("/api/v1/auth/login", json=payload, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 200
    refresh_token = resp.cookies.get("refresh_token")

    # Missing x-csrf-token header
    resp = await client.post("/api/v1/auth/refresh", cookies={"csrf_token": csrf_token, "refresh_token": refresh_token})
    assert resp.status_code == 403

async def test_refresh_token_rotation(client: AsyncClient, doctor_user, csrf_token):
    # Login
    payload = {"email": doctor_user.email, "password": "pass"}
    resp = await client.post("/api/v1/auth/login", json=payload, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 200
    refresh_token = resp.cookies.get("refresh_token")
    new_csrf = resp.cookies.get("csrf_token") or csrf_token
    
    # Refresh
    resp = await client.post("/api/v1/auth/refresh", headers={"x-csrf-token": new_csrf}, cookies={"csrf_token": new_csrf, "refresh_token": refresh_token})
    assert resp.status_code == 200
    new_refresh_token = resp.cookies.get("refresh_token")
    assert new_refresh_token != refresh_token

    # Attempt reuse of old token (Reuse Detection)
    resp = await client.post("/api/v1/auth/refresh", headers={"x-csrf-token": new_csrf}, cookies={"csrf_token": new_csrf, "refresh_token": refresh_token})
    assert resp.status_code == 401

from app.api.rate_limiter import _failed_attempts
import time

from unittest.mock import patch

async def test_rate_limiting(client: AsyncClient, doctor_user, csrf_token):
    payload = {"email": doctor_user.email, "password": "wrongpassword"}
    
    # Pre-fill the failed attempts to 10 for ASGITransport's default IP
    _failed_attempts["127.0.0.1"] = (10, time.time())
    
    with patch("app.api.rate_limiter.asyncio.sleep") as mock_sleep:
        resp = await client.post("/api/v1/auth/login", json=payload, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    
    assert resp.status_code == 429
    
    # Clean up state so it doesn't affect other tests!
    if "127.0.0.1" in _failed_attempts: del _failed_attempts["127.0.0.1"]

import asyncio
from sqlalchemy.future import select
from app.models import RefreshToken
import hashlib

async def test_concurrent_refresh(client: AsyncClient, doctor_user, csrf_token, db_session):
    # Login
    payload = {"email": doctor_user.email, "password": "pass"}
    resp = await client.post("/api/v1/auth/login", json=payload, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 200
    refresh_token = resp.cookies.get("refresh_token")
    new_csrf = resp.cookies.get("csrf_token") or csrf_token
    
    # Concurrent refresh
    # Concurrent refresh
    req_coro1 = client.post("/api/v1/auth/refresh", headers={"x-csrf-token": new_csrf}, cookies={"csrf_token": new_csrf, "refresh_token": refresh_token})
    req_coro2 = client.post("/api/v1/auth/refresh", headers={"x-csrf-token": new_csrf}, cookies={"csrf_token": new_csrf, "refresh_token": refresh_token})
    
    responses = await asyncio.gather(req_coro1, req_coro2, return_exceptions=True)
    
    status_codes = []
    for r in responses:
        if isinstance(r, Exception):
            raise r
        status_codes.append(r.status_code)
    assert 200 in status_codes
    assert 401 in status_codes
    
    # Check database state
    hashed_token = hashlib.sha256(refresh_token.encode()).hexdigest()
    
    result = await db_session.execute(select(RefreshToken).where(RefreshToken.hashedToken == hashed_token))
    original_token_row = result.scalar_one()
    
    # Original token revoked
    assert original_token_row.revokedAt is not None
    
    family_id = original_token_row.familyId
    
    result = await db_session.execute(select(RefreshToken).where(RefreshToken.familyId == family_id))
    all_tokens = result.scalars().all()
    
    active_tokens = [t for t in all_tokens if t.revokedAt is None]
    assert len(active_tokens) == 0  # zero active tokens remain in that family
