from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.health import router as health_router
import uuid
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from app.utils.logger import logger
from app.core.exceptions import DomainException
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import status

class LimitBodySizeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        cl = request.headers.get("content-length")
        if cl and int(cl) > getattr(settings, "MAX_REQUEST_BODY_SIZE", 1048576):
            return JSONResponse({"detail": "Payload Too Large"}, status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        return await call_next(request)

app = FastAPI(title="Kush Dental Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token", "X-Correlation-ID", "Accept", "Idempotency-Key"],
    expose_headers=["X-Correlation-ID"]
)

app.add_middleware(LimitBodySizeMiddleware)

@app.middleware("http")
async def security_headers_and_logging(request: Request, call_next):
    # Correlation ID
    correlation_id = request.headers.get("x-correlation-id", str(uuid.uuid4()))
    request.state.correlation_id = correlation_id
    
    # Request logging
    if request.url.path not in ["/health/live", "/health/ready"]:
        logger.info(f"Incoming Request: {request.method} {request.url.path}", extra={"correlationId": correlation_id})

    response = await call_next(request)
    
    # Security headers
    response.headers["x-correlation-id"] = correlation_id
    
    is_prod = settings.NODE_ENV == 'production'
    
    # HSTS explicitly gated behind HTTPS/production deployment flag
    if settings.ENABLE_HSTS:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
    response.headers["X-Content-Type-Options"] = "nosniff"
    
    # clickjacking protection
    response.headers["X-Frame-Options"] = "DENY"
    
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    # Content-Security-Policy
    csp_directives = [
        "default-src 'self'",
        "script-src 'self' https://challenges.cloudflare.com" + (" 'unsafe-inline' 'unsafe-eval'" if not is_prod else ""),
        "style-src 'self' https://fonts.googleapis.com" + (" 'unsafe-inline'" if not is_prod else ""),
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://dummyimage.com",
        f"connect-src 'self' https://challenges.cloudflare.com {settings.CORS_ORIGIN}" + (" ws: wss: http: https:" if not is_prod else ""),
        "frame-src 'self' https://challenges.cloudflare.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ]
    response.headers["Content-Security-Policy"] = "; ".join(csp_directives)
    
    return response

@app.exception_handler(DomainException)
async def domain_exception_handler(request: Request, exc: DomainException):
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    logger.warning(f"Domain Error: {exc.code} - {exc.message}", extra={"correlationId": correlation_id})
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            },
            "correlationId": correlation_id
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    if exc.status_code in (401, 403, 429):
        logger.warning(f"Security Event: HTTP {exc.status_code} - {exc.detail}", extra={"correlationId": correlation_id, "path": request.url.path})
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "correlationId": correlation_id},
        headers=getattr(exc, "headers", None)
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    errors = jsonable_encoder(exc.errors())
    logger.warning(f"Validation Error: {errors}", extra={"correlationId": correlation_id, "path": request.url.path})
    return JSONResponse(
        status_code=422,
        content={"detail": errors, "correlationId": correlation_id}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    logger.error(f"Unhandled Error: {str(exc)}", extra={"correlationId": correlation_id})
    return JSONResponse(
        status_code=getattr(exc, "status_code", 500),
        content={
            "error": {
                "code": getattr(exc, "code", "INTERNAL_SERVER_ERROR"),
                "message": getattr(exc, "message", "An unexpected error occurred"),
                "details": getattr(exc, "details", str(exc) if settings.NODE_ENV != 'production' else None)
            },
            "correlationId": correlation_id
        }
    )

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.patients import router as patients_router
from app.api.v1.appointments import router as appointments_router
from app.api.v1.leads import router as leads_router
from app.api.v1.public import router as public_router
from app.api.v1.blog import router as blog_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.contacts import router as contacts_router
from app.api.v1.dxgen import router as dxgen_router
from app.api.dependencies import verify_body_size
from fastapi import Depends

app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1/auth", dependencies=[Depends(verify_body_size)])
app.include_router(users_router, prefix="/api/v1/users", dependencies=[Depends(verify_body_size)])
app.include_router(patients_router, prefix="/api/v1/patients", dependencies=[Depends(verify_body_size)])
app.include_router(appointments_router, prefix="/api/v1/appointments", dependencies=[Depends(verify_body_size)])
app.include_router(leads_router, prefix="/api/v1/leads", dependencies=[Depends(verify_body_size)])
app.include_router(public_router, prefix="/api/v1/public", dependencies=[Depends(verify_body_size)])
app.include_router(blog_router, prefix="/api/v1/blog", dependencies=[Depends(verify_body_size)])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", dependencies=[Depends(verify_body_size)])
app.include_router(contacts_router, prefix="/api/v1/contacts", dependencies=[Depends(verify_body_size)])
app.include_router(dxgen_router, prefix="/api/v1/dxgen", dependencies=[Depends(verify_body_size)])
