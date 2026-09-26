import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.config import settings
from tests.test_dxgen import mock_dxgen_key, mock_httpx, mock_no_dxgen_key, MockAsyncClient, MockResponse

@pytest.mark.asyncio
async def test_generate_universal(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/generate"
        assert json["topic"] == "Universal"
        return MockResponse(200, {
            "success": True,
            "requestId": "req-1",
            "content": {"title": "Universal Title", "body": "Universal Body"}
        })
    mock_httpx.post_mock = mock_post

    resp = await client.post("/api/v1/dxgen/generate", json={"topic": "Universal"}, headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert resp.json()["content"]["title"] == "Universal Title"

@pytest.mark.asyncio
async def test_generate_social(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/generate/social"
        return MockResponse(200, {
            "success": True,
            "requestId": "req-2",
            "content": {"title": "Social Title"}
        })
    mock_httpx.post_mock = mock_post

    resp = await client.post("/api/v1/dxgen/generate/social", json={"topic": "Social"}, headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert resp.json()["content"]["title"] == "Social Title"

@pytest.mark.asyncio
async def test_generate_business(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/generate/business"
        return MockResponse(200, {
            "success": True,
            "requestId": "req-3",
            "content": {"title": "Business Title"}
        })
    mock_httpx.post_mock = mock_post

    resp = await client.post("/api/v1/dxgen/generate/business", json={"topic": "Business"}, headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert resp.json()["content"]["title"] == "Business Title"

@pytest.mark.asyncio
async def test_get_content(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_get(url, headers):
        assert url == "http://51.20.121.253:3101/api/v1/content/cnt_123"
        return MockResponse(200, {
            "success": True,
            "contentId": "cnt_123",
            "content": {"title": "Fetched Content"}
        })
    mock_httpx.get_mock = mock_get

    resp = await client.get("/api/v1/dxgen/content/cnt_123", headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert resp.json()["content"]["title"] == "Fetched Content"

@pytest.mark.asyncio
async def test_get_usage(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_get(url, headers):
        assert url == "http://51.20.121.253:3101/api/v1/usage"
        return MockResponse(200, {
            "model": "gemini-2.5-flash",
            "totalTokens": 1000
        })
    
    mock_httpx.get_mock = mock_get

    resp = await client.get("/api/v1/dxgen/usage", headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert resp.json()["totalTokens"] == 1000

@pytest.mark.asyncio
async def test_get_health(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_get(url, headers):
        assert url == "http://51.20.121.253:3101/api/v1/health"
        return MockResponse(200, {
            "status": "ok",
            "service": "content-api"
        })
    
    mock_httpx.get_mock = mock_get

    resp = await client.get("/api/v1/dxgen/health", headers=doctor_auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_get_health_unauthorized(client: AsyncClient):
    resp = await client.get("/api/v1/dxgen/health")
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_get_health_staff_forbidden(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.get("/api/v1/dxgen/health", headers=staff_auth_headers)
    assert resp.status_code == 403

@pytest.mark.asyncio
async def test_get_health_upstream_failure(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_get(url, headers):
        return MockResponse(500, text_data="Upstream fail")
    
    mock_httpx.get_mock = mock_get

    resp = await client.get("/api/v1/dxgen/health", headers=doctor_auth_headers)
    assert resp.status_code == 502

@pytest.mark.asyncio
async def test_generate_image_success(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/images/generate"
        assert json["prompt"] == "A modern dental clinic"
        return MockResponse(200, {
            "success": True,
            "image": {
                "id": "img_123",
                "url": "https://storage.dxgen.ai/images/img_123.webp",
                "model": "flux-schnell",
                "style": "Commercial Photography"
            }
        })
    mock_httpx.post_mock = mock_post

    resp = await client.post(
        "/api/v1/dxgen/images/generate",
        json={"prompt": "A modern dental clinic", "style": "Commercial Photography"},
        headers=doctor_auth_headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["image"]["url"] == "https://storage.dxgen.ai/images/img_123.webp"
    assert data["image"]["id"] == "img_123"

@pytest.mark.asyncio
async def test_generate_image_from_content_success(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/images/from-content"
        assert json["contentId"] == "cnt_999"
        return MockResponse(200, {
            "success": True,
            "image": {
                "id": "img_456",
                "url": "https://storage.dxgen.ai/images/img_456.webp"
            }
        })
    mock_httpx.post_mock = mock_post

    resp = await client.post(
        "/api/v1/dxgen/images/from-content/cnt_999",
        headers=doctor_auth_headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["image"]["url"] == "https://storage.dxgen.ai/images/img_456.webp"

@pytest.mark.asyncio
async def test_generate_blog_with_image(client: AsyncClient, doctor_auth_headers: dict, mock_dxgen_key, mock_httpx):
    async def mock_post(url, headers, json):
        assert url == "http://51.20.121.253:3101/api/v1/generate/blog"
        assert json["includeImage"] is True
        return MockResponse(200, {
            "success": True,
            "requestId": "req_img_blog",
            "content": {"title": "Veneers Guide", "body": "Veneers improve smiles."},
            "image": {
                "id": "img_789",
                "url": "https://storage.dxgen.ai/images/img_789.webp"
            }
        })
    mock_httpx.post_mock = mock_post

    resp = await client.post(
        "/api/v1/dxgen/generate/blog",
        json={"topic": "Veneers Guide", "includeImage": True, "imageStyle": "Commercial Photography"},
        headers=doctor_auth_headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["image"] is not None
    assert data["image"]["url"] == "https://storage.dxgen.ai/images/img_789.webp"

@pytest.mark.asyncio
async def test_generate_image_rbac(client: AsyncClient, staff_auth_headers: dict):
    # Unauthenticated
    resp = await client.post("/api/v1/dxgen/images/generate", json={"prompt": "Test"})
    assert resp.status_code == 401

    # Staff forbidden
    resp = await client.post("/api/v1/dxgen/images/generate", json={"prompt": "Test"}, headers=staff_auth_headers)
    assert resp.status_code == 403

