from datetime import datetime

from pydantic import BaseModel, Field


class SensorReadingCreate(BaseModel):
    device_id: str

    ph: float = Field(..., ge=0, le=14)

    turbidity: float = Field(..., ge=0)

    temperature: float

    tds: int = Field(..., ge=0)


class SensorReadingResponse(BaseModel):
    id: int

    device_id: str

    ph: float

    turbidity: float

    temperature: float

    tds: int

    health_score: int
    
    water_status: str

    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class WaterHealthResponse(BaseModel):
    health_score: int
    status: str


class SensorReadingWithHealthResponse(BaseModel):
    reading: SensorReadingResponse
    water_health: WaterHealthResponse