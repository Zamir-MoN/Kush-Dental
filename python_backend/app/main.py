from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.health import router as health_router
import uuid
from fastapi.responses import JSONResponse
from app.utils.logger import logger
from app.core.exceptions import DomainException

app = FastAPI(title="Kush Dental Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    
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

app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(users_router, prefix="/api/v1/users")
app.include_router(patients_router, prefix="/api/v1/patients")
app.include_router(appointments_router, prefix="/api/v1/appointments")
app.include_router(leads_router, prefix="/api/v1/leads")
app.include_router(public_router, prefix="/api/v1/public")
app.include_router(blog_router, prefix="/api/v1/blog")
app.include_router(dashboard_router, prefix="/api/v1/dashboard")
app.include_router(contacts_router, prefix="/api/v1/contacts")
app.include_router(dxgen_router, prefix="/api/v1/dxgen")
