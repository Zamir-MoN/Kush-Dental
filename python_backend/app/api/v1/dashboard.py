from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.dashboard import DashboardResponse
from app.services import dashboard_service
from app.models import Role, User
from app.api.dependencies import require_roles

router = APIRouter()

@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(require_roles([Role.DOCTOR, Role.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    return await dashboard_service.get_dashboard_data(db, current_user)
