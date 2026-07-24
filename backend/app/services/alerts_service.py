from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.sensor import SensorReading


def generate_alerts(db: Session, reading: SensorReading):

    alerts = []

    if reading.ph < 6.5:
        alerts.append(
            Alert(
                device_id=reading.device_id,
                alert_type="Acidic Water",
                severity="HIGH",
                message=f"pH is too low ({reading.ph})"
            )
        )

    elif reading.ph > 8.5:
        alerts.append(
            Alert(
                device_id=reading.device_id,
                alert_type="Alkaline Water",
                severity="HIGH",
                message=f"pH is too high ({reading.ph})"
            )
        )

    if reading.turbidity > 5:
        alerts.append(
            Alert(
                device_id=reading.device_id,
                alert_type="High Turbidity",
                severity="MEDIUM",
                message=f"Turbidity is {reading.turbidity} NTU"
            )
        )

    if reading.tds > 500:
        alerts.append(
            Alert(
                device_id=reading.device_id,
                alert_type="High TDS",
                severity="HIGH",
                message=f"TDS is {reading.tds} ppm"
            )
        )

    if reading.temperature > 35:
        alerts.append(
            Alert(
                device_id=reading.device_id,
                alert_type="High Temperature",
                severity="MEDIUM",
                message=f"Temperature is {reading.temperature} °C"
            )
        )

    if reading.health_score < 50:
        alerts.append(
            Alert(
                device_id=reading.device_id,
                alert_type="Unsafe Water",
                severity="HIGH",
                message=f"Water Health Score is {reading.health_score}"
            )
        )

    if alerts:
        db.add_all(alerts)
        db.commit()

    return alerts