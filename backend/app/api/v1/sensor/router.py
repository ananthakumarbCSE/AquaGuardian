from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.models.device import Device
from app.models.sensor import SensorReading
from app.models.alert import Alert
from app.schemas.sensor import SensorReadingCreate, SensorReadingResponse
from app.services.health_score import calculate_health_score
from app.services.alerts_service import generate_alerts


router = APIRouter(
    prefix="/sensor-readings",
    tags=["Sensor Readings"]
)


@router.post("/", response_model=SensorReadingResponse)
def create_sensor_reading(
    sensor: SensorReadingCreate,
    db: Session = Depends(get_db)
):
    # Check whether the device exists
    device = (
        db.query(Device)
        .filter(Device.device_id == sensor.device_id)
        .first()
    )

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    # Calculate Water Health Score
    health = calculate_health_score(
        sensor.ph,
        sensor.turbidity,
        sensor.temperature,
        sensor.tds
    )

    # Save Sensor Reading
    reading = SensorReading(
        device_id=sensor.device_id,
        ph=sensor.ph,
        turbidity=sensor.turbidity,
        temperature=sensor.temperature,
        tds=sensor.tds,
        health_score=health["health_score"],
        water_status=health["status"]
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)

    generate_alerts(db, reading)

    return reading