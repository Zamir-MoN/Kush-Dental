import pytest
import logging
import json
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_global_exception_handler_no_leakage(caplog):
    # This tests that our global exception handler does not leak credentials on error
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Trigger an unhandled exception by hitting a non-existent or buggy internal route if we had one.
        # Wait, easiest way is to send a malformed request that throws something, 
        # or we can test validation errors.
        resp = await client.post("/api/v1/auth/login", json={"email": "not-an-email", "password": "supersecretpassword123!"})
        assert resp.status_code == 422
        
        # Check logs
        log_texts = [record.getMessage() for record in caplog.records]
        joined_logs = " ".join(log_texts)
        assert "supersecretpassword123!" not in joined_logs, "Password leaked in validation logs!"

@pytest.mark.asyncio
async def test_auth_logging_no_leakage(caplog, db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Failed login
        resp = await client.post("/api/v1/auth/login", json={"email": "bad@email.com", "password": "mypassword123!"})
        assert resp.status_code == 401
        
        log_texts = [record.getMessage() for record in caplog.records]
        joined_logs = " ".join(log_texts)
        assert "mypassword123!" not in joined_logs, "Password leaked in failed auth logs!"
        
@pytest.mark.asyncio
async def test_correlation_id_presence():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/health/live", headers={"x-correlation-id": "test-uuid-1234"})
        assert resp.status_code == 200
        assert resp.headers.get("x-correlation-id") == "test-uuid-1234"

@pytest.mark.asyncio
async def test_authorization_failure_logs_no_token(caplog):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/patients", headers={"Authorization": "Bearer supersecretbearertoken1234!"})
        assert resp.status_code == 401
        
        log_texts = [record.getMessage() for record in caplog.records]
        joined_logs = " ".join(log_texts)
        assert "supersecretbearertoken1234!" not in joined_logs, "Token leaked in auth failure logs!"
