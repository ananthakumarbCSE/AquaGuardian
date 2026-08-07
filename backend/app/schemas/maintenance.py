from pydantic import BaseModel


class MaintenanceResponse(BaseModel):

    maintenance_required: bool

    priority: str

    recommendations: list[str]