from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.sensor import SensorReading
from app.models.alert import Alert


def get_analytics(db: Session):

    readings = db.query(SensorReading)

    average_ph = readings.with_entities(
        func.avg(SensorReading.ph)
    ).scalar()

    average_temperature = readings.with_entities(
        func.avg(SensorReading.temperature)
    ).scalar()

    average_tds = readings.with_entities(
        func.avg(SensorReading.tds)
    ).scalar()

    average_turbidity = readings.with_entities(
        func.avg(SensorReading.turbidity)
    ).scalar()

    average_health = readings.with_entities(
        func.avg(SensorReading.health_score)
    ).scalar()

    total_readings = readings.count()

    total_alerts = db.query(Alert).count()

    if average_health is None:
        trend = "Unknown"
    elif average_health >= 80:
        trend = "Excellent"
    elif average_health >= 60:
        trend = "Stable"
    else:
        trend = "Declining"

    return {

        "average_ph": round(average_ph or 0, 2),

        "average_temperature": round(
            average_temperature or 0, 2
        ),

        "average_tds": round(
            average_tds or 0, 2
        ),

        "average_turbidity": round(
            average_turbidity or 0, 2
        ),

        "average_health_score": round(
            average_health or 0, 2
        ),

        "total_readings": total_readings,

        "total_alerts": total_alerts,

        "trend": trend
    }