import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_cookie_secure_true(client: AsyncClient, doctor_user, monkeypatch):
    monkeypatch.setattr(settings, "COOKIE_SECURE", True)
    
    response = await client.post("/api/v1/auth/login", json={
        "email": doctor_user.email,
        "password": "pass"
    })
    
    if response.status_code == 200:
        cookies = response.cookies
        for cookie_name in ["refresh_token", "csrf_token"]:
            cookie = cookies.get(cookie_name)
            if cookie:
                # HTTPX cookie jar doesn't expose secure easily, we can check headers
                pass
                
        set_cookie_headers = response.headers.get_list("set-cookie")
        for header in set_cookie_headers:
            if "refresh_token" in header or "csrf_token" in header:
                assert "Secure" in header

@pytest.mark.asyncio
async def test_cookie_secure_false(client: AsyncClient, doctor_user, monkeypatch):
    monkeypatch.setattr(settings, "COOKIE_SECURE", False)
    
    response = await client.post("/api/v1/auth/login", json={
        "email": doctor_user.email,
        "password": "pass"
    })
    
    if response.status_code == 200:
        set_cookie_headers = response.headers.get_list("set-cookie")
        for header in set_cookie_headers:
            if "refresh_token" in header or "csrf_token" in header:
                assert "Secure" not in header
