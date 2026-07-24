from datetime import datetime
from pydantic import BaseModel, ConfigDict

class AlertResponse(BaseModel):
    id: int
    device_id: str
    alert_type: str
    severity: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)