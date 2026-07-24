from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceResponse

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)


@router.post("/", response_model=DeviceResponse)
def create_device(
    device: DeviceCreate,
    db: Session = Depends(get_db)
):
    new_device = Device(
        device_id=device.device_id,
        device_name=device.device_name,
        location=device.location
    )

    db.add(new_device)
    db.commit()
    db.refresh(new_device)

    return new_device