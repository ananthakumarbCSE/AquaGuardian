from sqlalchemy.orm import Session

from app.models.sensor import SensorReading


def get_maintenance(db: Session):

    latest = (
        db.query(SensorReading)
        .order_by(SensorReading.created_at.desc())
        .first()
    )

    if latest is None:
        return {
            "maintenance_required": False,
            "priority": "LOW",
            "recommendations": []
        }

    recommendations = []

    priority = "LOW"

    if latest.ph < 6.5:
        recommendations.append(
            "Inspect water source. Water is acidic."
        )
        priority = "HIGH"

    elif latest.ph > 8.5:
        recommendations.append(
            "Check chemical balance. Water is alkaline."
        )
        priority = "HIGH"

    if latest.turbidity > 5:
        recommendations.append(
            "Clean the water tank."
        )

    if latest.tds > 500:
        recommendations.append(
            "Replace or clean the water filter."
        )

    if latest.temperature > 35:
        recommendations.append(
            "Inspect the storage tank for overheating."
        )

    if latest.health_score < 60:
        recommendations.append(
            "Perform complete maintenance inspection."
        )
        priority = "HIGH"

    return {

        "maintenance_required":
            len(recommendations) > 0,

        "priority":
            priority,

        "recommendations":
            recommendations
    }