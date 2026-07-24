from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.schemas.sensor import SensorReadingResponse

class DashboardSummaryResponse(BaseModel):
    total_devices: int
    active_devices: int
    inactive_devices: int

    total_readings: int

    latest_health_score: int
    water_status: str

    total_alerts: int
    high_alerts: int
    medium_alerts: int

    last_updated: datetime

class LatestReadingResponse(SensorReadingResponse):
    pass

class ChartDataResponse(BaseModel):
    timestamps: List[str]
    ph: List[float]
    temperature: List[float]
    tds: List[int]
    turbidity: List[float]