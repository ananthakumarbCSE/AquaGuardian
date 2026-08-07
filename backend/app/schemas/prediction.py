from pydantic import BaseModel


class PredictionResponse(BaseModel):

    current_health_score: int

    predicted_health_score: int

    trend: str

    recommendation: str