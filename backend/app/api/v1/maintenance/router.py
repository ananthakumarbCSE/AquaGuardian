from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.schemas.maintenance import MaintenanceResponse

from app.services.maintenance_service import get_maintenance

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)


@router.get(
    "/",
    response_model=MaintenanceResponse
)
def maintenance(
    db: Session = Depends(get_db)
):
    return get_maintenance(db)