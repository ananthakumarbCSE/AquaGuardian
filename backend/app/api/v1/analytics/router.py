from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/",
    response_model=AnalyticsResponse
)
def analytics(
    db: Session = Depends(get_db)
):
    return get_analytics(db)