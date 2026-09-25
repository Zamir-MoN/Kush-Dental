from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()

@router.get("/health/live")
async def check_live():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")}

@router.get("/health/ready")
async def check_ready():
    return {"status": "ready", "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")}
