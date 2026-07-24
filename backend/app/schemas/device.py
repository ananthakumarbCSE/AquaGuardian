from pydantic import BaseModel


class DeviceCreate(BaseModel):
    device_id: str
    device_name: str
    location: str


class DeviceResponse(DeviceCreate):
    id: int
    status: str

    model_config = {
        "from_attributes": True
    }