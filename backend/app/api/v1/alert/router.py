from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database.dependencies import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/", response_model=list[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    alerts = (
        db.query(Alert)
        .order_by(Alert.created_at.desc())
        .all()
    )

    return alerts