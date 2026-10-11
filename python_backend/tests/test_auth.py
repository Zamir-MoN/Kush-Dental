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


import time

from unittest.mock import patch

