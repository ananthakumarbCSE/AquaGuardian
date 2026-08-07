from pydantic import BaseModel


class AnalyticsResponse(BaseModel):

    average_ph: float

    average_temperature: float

    average_tds: float

    average_turbidity: float

    average_health_score: float

    total_readings: int

    total_alerts: int

    trend: str