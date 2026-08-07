from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.schemas.prediction import PredictionResponse

from app.services.prediction_service import predict_health

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


@router.get(
    "/",
    response_model=PredictionResponse
)
def prediction(
    db: Session = Depends(get_db)
):
    return predict_health(db)