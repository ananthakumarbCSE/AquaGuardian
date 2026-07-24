from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import get_dashboard_summary
from app.schemas.dashboard import LatestReadingResponse
from app.services.dashboard_service import get_latest_reading
from app.schemas.dashboard import ChartDataResponse
from app.services.dashboard_service import get_chart_data

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse
)
def dashboard_summary(
    db: Session = Depends(get_db)
):
    return get_dashboard_summary(db)

@router.get(
    "/latest-reading",
    response_model=LatestReadingResponse
)
def latest_reading(
    db: Session = Depends(get_db)
):
    return get_latest_reading(db)

@router.get(
    "/chart-data",
    response_model=ChartDataResponse
)
def chart_data(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return get_chart_data(db, limit)