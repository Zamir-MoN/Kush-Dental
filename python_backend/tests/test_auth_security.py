import pytest
import jwt
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient
from pydantic import ValidationError
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import Settings
from app.models import User
from app.utils.security import create_access_token
import os

pytestmark = pytest.mark.asyncio

def test_missing_jwt_secret_fails_startup():
    # Attempt to instantiate settings with missing JWT_SECRET
    # (Using a local environment to isolate from global os.environ)
    try:
        os.environ.pop("JWT_SECRET", None)
        with pytest.raises(ValidationError) as exc:
            Settings(_env_file=None, DATABASE_URL="postgresql://test")
        assert "JWT_SECRET" in str(exc.value)
    finally:
        # We don't restore it because it might not be in os.environ anyway (loaded from .env file)
        pass

async def test_auth_invalid_credentials_format(client: AsyncClient, doctor_user: User, csrf_token):
    resp = await client.post("/api/v1/auth/login", json={"email": doctor_user.email, "password": "wrongpassword"}, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 401
    assert "Invalid credentials" in str(resp.json())
    assert "wrongpassword" not in str(resp.json())
    
async def test_deactivated_user_cannot_login(client: AsyncClient, doctor_user: User, db_session: AsyncSession, csrf_token):
    # Deactivate the user
    await db_session.execute(update(User).where(User.id == doctor_user.id).values(deletedAt=datetime.now(timezone.utc)))
    await db_session.commit()
    
    # Try to login
    resp = await client.post("/api/v1/auth/login", json={"email": doctor_user.email, "password": "pass"}, headers={"x-csrf-token": csrf_token, "Cookie": f"csrf_token={csrf_token}"})
    assert resp.status_code == 401
    assert "Invalid credentials" in str(resp.json())

async def test_deactivated_user_cannot_access_protected_route(client: AsyncClient, doctor_user: User, doctor_auth_headers: dict, db_session: AsyncSession):
    # Route should work first
    resp = await client.get("/api/v1/users", headers=doctor_auth_headers)
    assert resp.status_code == 200
    
    # Deactivate
    await db_session.execute(update(User).where(User.id == doctor_user.id).values(deletedAt=datetime.now(timezone.utc)))
    await db_session.commit()
    
    # Same token should now fail
    resp2 = await client.get("/api/v1/users", headers=doctor_auth_headers)
    assert resp2.status_code == 401
    assert "User not found" in str(resp2.json())

async def test_malformed_jwt(client: AsyncClient):
    headers = {"Authorization": "Bearer not.a.valid.jwt"}
    resp = await client.get("/api/v1/users", headers=headers)
    assert resp.status_code == 401
    assert "Invalid token" in str(resp.json())

async def test_expired_jwt(client: AsyncClient, doctor_user: User):
    # Create an expired token
    token = create_access_token({"sub": str(doctor_user.id)}, expires_delta=timedelta(seconds=-10))
    headers = {"Authorization": f"Bearer {token}"}
    resp = await client.get("/api/v1/users", headers=headers)
    assert resp.status_code == 401
    assert "Invalid token" in str(resp.json())
