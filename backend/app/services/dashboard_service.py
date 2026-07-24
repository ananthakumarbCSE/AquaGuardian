from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.device import Device
from app.models.sensor import SensorReading
from app.models.alert import Alert


def get_dashboard_summary(db: Session):

    total_devices = db.query(Device).count()

    active_devices = (
        db.query(Device)
        .filter(Device.status == "ACTIVE")
        .count()
    )

    inactive_devices = total_devices - active_devices

    total_readings = db.query(SensorReading).count()

    latest = (
        db.query(SensorReading)
        .order_by(SensorReading.created_at.desc())
        .first()
    )

    total_alerts = db.query(Alert).count()

    high_alerts = (
        db.query(Alert)
        .filter(Alert.severity == "HIGH")
        .count()
    )

    medium_alerts = (
        db.query(Alert)
        .filter(Alert.severity == "MEDIUM")
        .count()
    )

    return {
        "total_devices": total_devices,
        "active_devices": active_devices,
        "inactive_devices": inactive_devices,

        "total_readings": total_readings,

        "latest_health_score": latest.health_score if latest else 0,
        "water_status": latest.water_status if latest else "Unknown",

        "total_alerts": total_alerts,
        "high_alerts": high_alerts,
        "medium_alerts": medium_alerts,

        "last_updated": latest.created_at if latest else None
    }

def get_latest_reading(db: Session):

    latest = (
        db.query(SensorReading)
        .order_by(SensorReading.created_at.desc())
        .first()
    )

    return latest

def get_chart_data(
    db: Session,
    limit: int = 50
):

    readings = (
        db.query(SensorReading)
        .order_by(SensorReading.created_at.desc())
        .limit(limit)
        .all()
    )

    readings.reverse()

    return {
        "timestamps": [
            r.created_at.isoformat()
            for r in readings
        ],

        "ph": [
            r.ph
            for r in readings
        ],

        "temperature": [
            r.temperature
            for r in readings
        ],

        "tds": [
            r.tds
            for r in readings
        ],

        "turbidity": [
            r.turbidity
            for r in readings
        ]
    }