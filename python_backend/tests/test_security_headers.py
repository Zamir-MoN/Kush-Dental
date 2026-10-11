import pytest
from httpx import AsyncClient
from unittest.mock import patch
from app.core.config import settings

@pytest.mark.asyncio
async def test_security_headers_development(client: AsyncClient):
    # In test mode, NODE_ENV is 'test' (which acts like development)
    response = await client.get("/health/live")
    assert response.status_code == 200
    
    headers = response.headers
    assert headers["X-Content-Type-Options"] == "nosniff"
    assert headers["X-Frame-Options"] == "DENY"
    assert headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
    assert headers["Permissions-Policy"] == "geolocation=(), microphone=(), camera=()"
    
    # HSTS should NOT be present in dev/test
    assert "Strict-Transport-Security" not in headers
    
    # CSP should exist and have relaxed dev directives
    csp = headers["Content-Security-Policy"]
    assert "default-src 'self'" in csp
    assert "script-src 'self' https://challenges.cloudflare.com 'unsafe-inline' 'unsafe-eval'" in csp
    assert "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'" in csp
    assert "font-src 'self' https://fonts.gstatic.com" in csp
    assert "img-src 'self' data: https://dummyimage.com" in csp
    assert "connect-src 'self' https://challenges.cloudflare.com" in csp
    assert "frame-src 'self' https://challenges.cloudflare.com" in csp
    assert "object-src 'none'" in csp
    assert "base-uri 'self'" in csp
    assert "form-action 'self'" in csp
    assert "frame-ancestors 'none'" in csp

@pytest.mark.asyncio
async def test_security_headers_production(client: AsyncClient):
    with patch("app.main.settings.NODE_ENV", "production"):
        with patch("app.main.settings.ENABLE_HSTS", True):
            response = await client.get("/health/live")
            assert response.status_code == 200
            
            headers = response.headers
            
            # HSTS SHOULD be present in production when ENABLE_HSTS is True
            assert headers["Strict-Transport-Security"] == "max-age=31536000; includeSubDomains"
        
        # CSP should be strict
        csp = headers["Content-Security-Policy"]
        assert "default-src 'self'" in csp
        assert "script-src 'self' https://challenges.cloudflare.com" in csp
        assert "'unsafe-inline'" not in csp
        assert "'unsafe-eval'" not in csp
        
        assert "style-src 'self' https://fonts.googleapis.com" in csp
        # In prod style-src does not have unsafe-inline
        assert "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'" not in csp
        
        assert "object-src 'none'" in csp
        assert "base-uri 'self'" in csp
        assert "form-action 'self'" in csp
        assert "frame-ancestors 'none'" in csp

@pytest.mark.asyncio
async def test_security_headers_production_no_hsts(client: AsyncClient):
    with patch("app.main.settings.NODE_ENV", "production"):
        with patch("app.main.settings.ENABLE_HSTS", False):
            response = await client.get("/health/live")
            assert response.status_code == 200
            
            headers = response.headers
            
            # HSTS SHOULD NOT be present when ENABLE_HSTS is False
            assert "Strict-Transport-Security" not in headers
