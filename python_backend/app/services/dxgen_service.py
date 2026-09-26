import httpx
import logging
import json
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.dxgen import (
    DXGenGenerateRequest,
    DXGenGenerateResponse,
    DXGenHealthResponse,
    DXGenUsage,
    DXGenImageGenerateRequest,
    DXGenImageResponse,
    DXGenImage,
)
from app.utils.sanitization import sanitize_html

logger = logging.getLogger(__name__)

async def _make_request(method: str, endpoint: str, payload: dict = None) -> dict:
    if not settings.DXGEN_API_KEY:
        logger.error("DXGEN_API_KEY is not configured.")
        raise HTTPException(status_code=500, detail="AI Service configuration error: missing DXGEN_API_KEY")

    headers = {
        "Authorization": f"Bearer {settings.DXGEN_API_KEY}",
        "Content-Type": "application/json"
    }

    # Candidate URLs to try in priority order: local port 3101 loopback first
    candidate_urls = [
        "http://127.0.0.1:3101/api/v1",
        "http://localhost:3101/api/v1",
    ]
    if getattr(settings, "DXGEN_BASE_URL", None):
        base = settings.DXGEN_BASE_URL.rstrip('/')
        if base not in candidate_urls and "51.20.121.253" not in base:
            candidate_urls.append(base)

    last_error = None
    async with httpx.AsyncClient(timeout=120.0) as client:
        for base_url in candidate_urls:
            target_url = f"{base_url}{endpoint}"
            try:
                if method.upper() == "POST":
                    response = await client.post(target_url, headers=headers, json=payload)
                else:
                    response = await client.get(target_url, headers=headers)

                status_code = response.status_code
                if status_code == 400:
                    logger.warning(f"DXGen API 400 from {target_url}: {response.text}")
                    raise HTTPException(status_code=400, detail="Invalid request parameters")
                elif status_code in (401, 403):
                    logger.error(f"DXGen API auth error {status_code} from {target_url}: {response.text}")
                    raise HTTPException(status_code=500, detail="AI Service configuration error: invalid API key")
                elif status_code == 404:
                    logger.warning(f"DXGen API 404 from {target_url}")
                    last_error = f"Resource not found at {target_url}"
                    continue
                elif status_code == 429:
                    logger.warning(f"DXGen API rate limit exceeded from {target_url}")
                    raise HTTPException(status_code=429, detail="AI Service rate limit exceeded, please try again later")
                elif status_code >= 500:
                    logger.error(f"DXGen API server error {status_code} from {target_url}: {response.text}")
                    last_error = f"Server error {status_code} from {target_url}: {response.text}"
                    continue

                response.raise_for_status()
                return response.json()

            except (httpx.ConnectError, httpx.ConnectTimeout) as e:
                logger.warning(f"Connection failed to DXGen at {target_url}: {e}")
                last_error = f"Could not connect to {target_url}"
                continue
            except httpx.TimeoutException as e:
                logger.error(f"DXGen API timeout from {target_url}: {e}")
                last_error = f"Request timed out from {target_url}"
                continue
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Unexpected DXGen error from {target_url}: {e}")
                last_error = str(e)
                continue

    logger.error(f"All DXGen candidate endpoints failed. Last error: {last_error}")
    raise HTTPException(status_code=504 if "timed out" in str(last_error).lower() else 502, detail=f"AI Service unavailable. {last_error}")

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

    # Auto-generate accompanying cover image if requested and not returned by /generate/blog
    if request_data.includeImage and not result.image:
        try:
            # 1. Try from-content if contentId exists
            if result.contentId:
                try:
                    img_resp = await generate_image_from_content(
                        result.contentId,
                        style=request_data.imageStyle or "Commercial Photography"
                    )
                    if img_resp and img_resp.image and img_resp.image.url:
                        result.image = img_resp.image
                except Exception as cf_err:
                    logger.warning(f"generate_image_from_content failed: {cf_err}")

            # 2. Direct generation from title/topic prompt
            if not result.image:
                topic_title = (result.content.title if result.content and result.content.title else request_data.topic)
                clean_title = topic_title.replace(":", " - ").strip()
                prompt = f"Professional clinical dental photography of {clean_title}, modern luxury dental clinic operatory, sterile precision equipment, warm ambient lighting, 8k resolution"
                img_req = DXGenImageGenerateRequest(
                    prompt=prompt[:990],
                    style=request_data.imageStyle or "Commercial Photography",
                    aspectRatio=request_data.imageAspectRatio or "16:9",
                    model=request_data.imageModel or "flux-schnell"
                )
                img_resp = await generate_image(img_req)
                if img_resp and img_resp.image and img_resp.image.url:
                    result.image = img_resp.image
        except Exception as img_err:
            logger.error(f"Auto image generation failed during generate_blog: {img_err}")

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

async def generate_image(request_data: DXGenImageGenerateRequest) -> DXGenImageResponse:
    payload = request_data.model_dump(exclude_unset=True, exclude_none=True)
    data = await _make_request("POST", "/images/generate", payload)
    return DXGenImageResponse.model_validate(data)

async def generate_image_from_content(content_id: str, style: str = "Commercial Photography") -> DXGenImageResponse:
    payload = {"contentId": content_id, "style": style}
    data = await _make_request("POST", "/images/from-content", payload)
    return DXGenImageResponse.model_validate(data)

