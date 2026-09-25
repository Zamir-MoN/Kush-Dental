import httpx
import logging
import json
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.dxgen import DXGenGenerateRequest, DXGenGenerateResponse, DXGenHealthResponse, DXGenUsage
from app.utils.sanitization import sanitize_html

logger = logging.getLogger(__name__)

DXGEN_BASE_URL = "http://51.20.121.253:3101/api/v1"

async def _make_request(method: str, endpoint: str, payload: dict = None) -> dict:
    if not settings.DXGEN_API_KEY:
        logger.error("DXGEN_API_KEY is not configured.")
        raise HTTPException(status_code=500, detail="AI Service configuration error")

    headers = {
        "Authorization": f"Bearer {settings.DXGEN_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            if method.upper() == "POST":
                response = await client.post(
                    f"{DXGEN_BASE_URL}{endpoint}",
                    headers=headers,
                    json=payload
                )
            else:
                response = await client.get(
                    f"{DXGEN_BASE_URL}{endpoint}",
                    headers=headers
                )
            
        status_code = response.status_code
        if status_code == 400:
            logger.warning(f"DXGen API 400: {response.text}")
            raise HTTPException(status_code=400, detail="Invalid request parameters")
        elif status_code in (401, 403):
            logger.error(f"DXGen API auth error {status_code}: {response.text}")
            raise HTTPException(status_code=500, detail="AI Service configuration error")
        elif status_code == 404:
            logger.warning(f"DXGen API 404: {response.text}")
            raise HTTPException(status_code=404, detail="Resource not found")
        elif status_code == 429:
            logger.warning("DXGen API rate limit exceeded")
            raise HTTPException(status_code=429, detail="AI Service rate limit exceeded, please try again later")
        elif status_code >= 500:
            logger.error(f"DXGen API server error {status_code}: {response.text}")
            raise HTTPException(status_code=502, detail="AI Service is temporarily unavailable")
        
        response.raise_for_status()
        
        return response.json()

    except httpx.TimeoutException as e:
        logger.error(f"DXGen API timeout: {e}")
        raise HTTPException(status_code=502, detail="AI Service is temporarily unavailable")
    except httpx.RequestError as e:
        logger.error(f"DXGen API network error: {e}")
        raise HTTPException(status_code=502, detail="AI Service is temporarily unavailable")
    except json.JSONDecodeError as e:
        logger.error(f"DXGen API invalid JSON response: {e}")
        raise HTTPException(status_code=502, detail="AI Service is temporarily unavailable")

def _sanitize_response(result: DXGenGenerateResponse) -> DXGenGenerateResponse:
    if result.content:
        if result.content.body:
            result.content.body = sanitize_html(result.content.body)
        if result.content.faq:
            if isinstance(result.content.faq, str):
                result.content.faq = sanitize_html(result.content.faq)
            elif isinstance(result.content.faq, list):
                safe_faq = []
                for item in result.content.faq:
                    if isinstance(item, str):
                        safe_faq.append(sanitize_html(item))
                    elif isinstance(item, dict):
                        safe_item = {}
                        for k, v in item.items():
                            safe_item[k] = sanitize_html(v) if isinstance(v, str) else v
                        safe_faq.append(safe_item)
                    else:
                        safe_faq.append(item)
                result.content.faq = safe_faq
    return result

async def generate(request_data: DXGenGenerateRequest) -> DXGenGenerateResponse:
    payload = request_data.model_dump(exclude_unset=True, exclude_none=True)
    data = await _make_request("POST", "/generate", payload)
    result = DXGenGenerateResponse.model_validate(data)
    return _sanitize_response(result)

async def generate_blog(request_data: DXGenGenerateRequest) -> DXGenGenerateResponse:
    payload = request_data.model_dump(exclude_unset=True, exclude_none=True)
    try:
        data = await _make_request("POST", "/generate/blog", payload)
    except HTTPException as e:
        if e.status_code == 400 and "Invalid request parameters" in e.detail:
            raise HTTPException(status_code=400, detail="Invalid generation parameters")
        raise
    result = DXGenGenerateResponse.model_validate(data)
    return _sanitize_response(result)

async def generate_social(request_data: DXGenGenerateRequest) -> DXGenGenerateResponse:
    payload = request_data.model_dump(exclude_unset=True, exclude_none=True)
    data = await _make_request("POST", "/generate/social", payload)
    result = DXGenGenerateResponse.model_validate(data)
    return _sanitize_response(result)

async def generate_business(request_data: DXGenGenerateRequest) -> DXGenGenerateResponse:
    payload = request_data.model_dump(exclude_unset=True, exclude_none=True)
    data = await _make_request("POST", "/generate/business", payload)
    result = DXGenGenerateResponse.model_validate(data)
    return _sanitize_response(result)

async def get_content(content_id: str) -> DXGenGenerateResponse:
    data = await _make_request("GET", f"/content/{content_id}")
    result = DXGenGenerateResponse.model_validate(data)
    return _sanitize_response(result)

async def get_usage() -> dict:
    data = await _make_request("GET", "/usage")
    return data

async def get_health() -> DXGenHealthResponse:
    data = await _make_request("GET", "/health")
    return DXGenHealthResponse.model_validate(data)
