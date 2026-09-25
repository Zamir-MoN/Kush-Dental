import pytest
from httpx import AsyncClient, TimeoutException, RequestError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import uuid

from app.core.config import settings

@pytest.fixture
def mock_dxgen_key(monkeypatch):
    monkeypatch.setattr(settings, "DXGEN_API_KEY", "test-fake-key-123")
    return "test-fake-key-123"

@pytest.fixture
def mock_no_dxgen_key(monkeypatch):
    monkeypatch.setattr(settings, "DXGEN_API_KEY", None)

class MockAsyncClient:
    def __init__(self, *args, **kwargs):
        self.post_mock = None

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

    async def post(self, url, headers=None, json=None, **kwargs):
        if not hasattr(self, 'post_mock') or self.post_mock is None:
            raise Exception("Mock not configured")
        return await self.post_mock(url, headers, json)
        
    async def get(self, url, headers=None, **kwargs):
        if not hasattr(self, 'get_mock') or self.get_mock is None:
            raise Exception("Mock not configured")
        return await self.get_mock(url, headers)

@pytest.fixture
def mock_httpx(monkeypatch):
    mock = MockAsyncClient()
    monkeypatch.setattr("app.services.dxgen_service.httpx.AsyncClient", lambda **kw: mock)
    return mock

@pytest.mark.asyncio
async def test_generate_unauthenticated(client: AsyncClient):
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Teeth Whitening"})
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_generate_staff_forbidden(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Teeth Whitening"}, headers=staff_auth_headers)
    assert resp.status_code == 403

@pytest.mark.asyncio
async def test_generate_missing_config(client: AsyncClient, doctor_auth_headers: dict, mock_no_dxgen_key):
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Teeth Whitening"}, headers=doctor_auth_headers)
    assert resp.status_code == 500
    assert "configuration error" in resp.json()["detail"]

@pytest.mark.asyncio
async def test_generate_validation_errors(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key):
    # Missing topic
    resp = await client.post("/api/v1/blog/generate", json={}, headers=doctor_auth_headers)
    assert resp.status_code == 422

    # Empty topic
    resp = await client.post("/api/v1/blog/generate", json={"topic": ""}, headers=doctor_auth_headers)
    assert resp.status_code == 422

    # Invalid length (dict instead of int/str)
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test", "length": {}}, headers=doctor_auth_headers)
    assert resp.status_code == 422

    # Unknown field
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test", "unknown_field": "123"}, headers=doctor_auth_headers)
    assert resp.status_code == 422

class MockResponse:
    def __init__(self, status_code, json_data=None, text_data=""):
        self.status_code = status_code
        self._json = json_data or {}
        self.text = text_data
    
    def json(self):
        if not self._json and self.text:
            import json
            return json.loads(self.text)
        return self._json

    def raise_for_status(self):
        if self.status_code >= 400:
            raise Exception("HTTP Error")

@pytest.mark.asyncio
async def test_generate_success(client: AsyncClient, doctor_auth_headers: dict, db_session: AsyncSession, mock_dxgen_key, mock_httpx, caplog):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/generate/blog"
        assert headers["Authorization"] == "Bearer test-fake-key-123"
        assert json["topic"] == "Teeth Whitening"
        assert json["tone"] == "Professional"
        
        return MockResponse(200, {
            "success": True,
            "requestId": "req-123",
            "content": {
                "title": "Whitening Secrets",
                "body": "<p>Test script <script>alert(1)</script></p>",
                "faq": [
                    "Q1",
                    {"q": "Q2", "a": "<script>alert(2)</script>Ans"}
                ]
            }
        })
    
    mock_httpx.post_mock = mock_post
    
    # Get total blogs before
    result = await db_session.execute(text("SELECT COUNT(*) FROM \"Blog\""))
    count_before = result.scalar()

    resp = await client.post("/api/v1/blog/generate", json={
        "topic": "Teeth Whitening",
        "tone": "Professional"
    }, headers=doctor_auth_headers)

    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["requestId"] == "req-123"
    assert data["content"]["title"] == "Whitening Secrets"
    
    # Check HTML sanitization
    assert "<script>" not in data["content"]["body"]
    assert data["content"]["body"] == "<p>Test script alert(1)</p>"
    
    # FAQ sanitization check
    assert "<script>" not in data["content"]["faq"][1]["a"]

    # Security checks
    assert "test-fake-key-123" not in str(data)
    assert "test-fake-key-123" not in caplog.text

    # Ensure no DB record was created
    result = await db_session.execute(text("SELECT COUNT(*) FROM \"Blog\""))
    count_after = result.scalar()
    assert count_before == count_after

@pytest.mark.asyncio
async def test_generate_errors(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post_400(url, headers, json):
        return MockResponse(400, text_data="Bad Request")
    
    mock_httpx.post_mock = mock_post_400
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 400
    assert "Invalid generation parameters" in resp.json()["detail"]

    async def mock_post_401(url, headers, json):
        return MockResponse(401, text_data="Unauthorized")
    
    mock_httpx.post_mock = mock_post_401
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 500
    assert "configuration error" in resp.json()["detail"]

    async def mock_post_429(url, headers, json):
        return MockResponse(429, text_data="Too Many Requests")
    
    mock_httpx.post_mock = mock_post_429
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 429
    assert "rate limit" in resp.json()["detail"]

    async def mock_post_500(url, headers, json):
        return MockResponse(500, text_data="Server Error")
    
    mock_httpx.post_mock = mock_post_500
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 502
    assert "temporarily unavailable" in resp.json()["detail"]

    async def mock_post_timeout(url, headers, json):
        raise TimeoutException("Timeout")
    
    mock_httpx.post_mock = mock_post_timeout
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 502

    async def mock_post_network(url, headers, json):
        raise RequestError("Network error", request=None)
    
    mock_httpx.post_mock = mock_post_network
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 502

    async def mock_post_bad_json(url, headers, json):
        return MockResponse(200, text_data="{bad json")
    
    mock_httpx.post_mock = mock_post_bad_json
    resp = await client.post("/api/v1/blog/generate", json={"topic": "Test"}, headers=doctor_auth_headers)
    assert resp.status_code == 502
