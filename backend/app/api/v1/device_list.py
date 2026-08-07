from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.device import Device
from app.schemas.device import DeviceResponse

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)


@router.get("/list", response_model=list[DeviceResponse])
def list_devices(db: Session = Depends(get_db)):
    devices = (
        db.query(Device)
        .order_by(Device.created_at.desc())
        .all()
    )
    return devices
