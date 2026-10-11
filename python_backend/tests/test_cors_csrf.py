import pytest
from httpx import AsyncClient
from app.core.config import settings
from app.models import User

pytestmark = pytest.mark.asyncio

async def test_cors_preflight_allowed_origin(client: AsyncClient):
    headers = {
        "Origin": settings.CORS_ORIGIN,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, X-CSRF-Token"
    }
    resp = await client.options("/api/v1/auth/login", headers=headers)
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == settings.CORS_ORIGIN
    assert resp.headers.get("access-control-allow-credentials") == "true"
    assert "POST" in resp.headers.get("access-control-allow-methods", "")
    assert "X-CSRF-Token" in resp.headers.get("access-control-allow-headers", "")

async def test_cors_preflight_rejected_origin(client: AsyncClient):
    headers = {
        "Origin": "https://malicious.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
    resp = await client.options("/api/v1/auth/login", headers=headers)
    assert resp.status_code == 400 # FastAPI CORS middleware returns 400 for disallowed origin preflights
    assert resp.headers.get("access-control-allow-origin") is None

async def test_csrf_origin_validation(client: AsyncClient, doctor_user: User, csrf_token):
    # Get a valid refresh cookie by logging in first, then attempt to refresh with bad Origin
    login_resp = await client.post("/api/v1/auth/login", json={"email": doctor_user.email, "password": "pass"}, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert login_resp.status_code == 200
    
    refresh_token = login_resp.cookies.get("refresh_token")
    new_csrf_token = login_resp.cookies.get("csrf_token") or csrf_token
    
    # Refresh with malicious Origin
    bad_headers = {
        "Origin": "https://malicious.com",
        "x-csrf-token": new_csrf_token
    }
    bad_cookies = {
        "refresh_token": refresh_token,
        "csrf_token": new_csrf_token
    }
    
    refresh_resp = await client.post("/api/v1/auth/refresh", headers=bad_headers, cookies=bad_cookies)
    assert refresh_resp.status_code == 403
    assert "Invalid Origin" in str(refresh_resp.json())

async def test_csrf_referer_validation(client: AsyncClient, doctor_user: User, csrf_token):
    login_resp = await client.post("/api/v1/auth/login", json={"email": doctor_user.email, "password": "pass"}, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert login_resp.status_code == 200
    
    refresh_token = login_resp.cookies.get("refresh_token")
    new_csrf_token = login_resp.cookies.get("csrf_token") or csrf_token
    
    # Refresh with malicious Referer (and NO origin)
    bad_headers = {
        "Referer": "https://malicious.com/some/path",
        "x-csrf-token": new_csrf_token
    }
    # Important to explicitly delete Origin if httpx adds it (httpx usually doesn't add it unless we specify)
    bad_cookies = {
        "refresh_token": refresh_token,
        "csrf_token": new_csrf_token
    }
    
    refresh_resp = await client.post("/api/v1/auth/refresh", headers=bad_headers, cookies=bad_cookies)
    assert refresh_resp.status_code == 403
    assert "Invalid Referer" in str(refresh_resp.json())

async def test_csrf_logout_origin_validation(client: AsyncClient, doctor_user: User, csrf_token):
    login_resp = await client.post("/api/v1/auth/login", json={"email": doctor_user.email, "password": "pass"}, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert login_resp.status_code == 200
    
    refresh_token = login_resp.cookies.get("refresh_token")
    new_csrf_token = login_resp.cookies.get("csrf_token") or csrf_token
    access_token = login_resp.json()["access_token"]
    
    bad_headers = {
        "Origin": "https://malicious.com",
        "x-csrf-token": new_csrf_token,
        "Authorization": f"Bearer {access_token}"
    }
    bad_cookies = {
        "refresh_token": refresh_token,
        "csrf_token": new_csrf_token
    }
    
    logout_resp = await client.post("/api/v1/auth/logout", headers=bad_headers, cookies=bad_cookies)
    assert logout_resp.status_code == 403
    assert "Invalid Origin" in str(logout_resp.json())
