import pytest
import asyncio
from httpx import AsyncClient
from app.core.config import settings
from app.models import User

pytestmark = pytest.mark.asyncio

async def test_oversized_request_body_rejected(client: AsyncClient):
    # max size is 1MB. Let's send 1.5MB
    large_payload = b"a" * int(1.5 * 1024 * 1024)
    # The global middleware / dependency should catch it.
    # We will test it against a POST endpoint like login.
    res = await client.post("/api/v1/auth/login", content=large_payload, headers={"Content-Type": "application/json", "Content-Length": str(len(large_payload))})
    assert res.status_code == 413, f"Expected 413, got {res.status_code}: {res.text}"

async def test_pagination_abuse_limit(client: AsyncClient, doctor_auth_headers: dict):
    # Try to request a limit of 1000, max is 100
    res = await client.get("/api/v1/patients?limit=1000", headers=doctor_auth_headers)
    assert res.status_code == 422 # Validation Error from Query()

async def test_pagination_abuse_negative_skip(client: AsyncClient, doctor_auth_headers: dict):
    res = await client.get("/api/v1/patients?skip=-5", headers=doctor_auth_headers)
    assert res.status_code == 422 # Validation Error

from unittest.mock import AsyncMock, patch

async def test_login_brute_force_throttling(client: AsyncClient):
    with patch("app.api.rate_limiter.asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
        # limit is 10
        for _ in range(12):
            res = await client.post("/api/v1/auth/login", json={"email": "wrong@test.com", "password": "wrong"})
            if res.status_code == 429:
                break
                
        assert res.status_code == 429
    
async def test_dxgen_rate_limiting(client: AsyncClient, doctor_auth_headers: dict):
    status_codes = []
    with patch("app.services.dxgen_service._make_request", new_callable=AsyncMock) as mock_make_request:
        mock_make_request.return_value = {"content": {"title": "Test", "body": "test"}, "contentId": "abc", "status": "COMPLETED"}
        # limit is 10
        for _ in range(12):
            res = await client.post("/api/v1/dxgen/generate/blog", json={"topic": "test"}, headers=doctor_auth_headers)
            status_codes.append(res.status_code)
        
    assert 429 in status_codes

async def test_spoofed_x_forwarded_for(client: AsyncClient):
    with patch("app.api.rate_limiter.asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
        # limit is 10
        for _ in range(11):
            res = await client.post("/api/v1/auth/login", json={"email": "a@b.com", "password": "c"})
        
        assert res.status_code == 429
        
        res2 = await client.post("/api/v1/auth/login", json={"email": "a@b.com", "password": "c"}, headers={"X-Forwarded-For": "203.0.113.1"})
        assert res2.status_code != 429
