from sklearn.linear_model import LinearRegression
import numpy as np

from sqlalchemy.orm import Session

from app.models.sensor import SensorReading


def predict_health(db: Session):

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.health_score.isnot(None))
        .order_by(SensorReading.created_at.asc())
        .all()
    )

    if len(readings) < 5:

        return {
            "current_health_score": 0,
            "predicted_health_score": 0,
            "trend": "Insufficient Data",
            "recommendation": "Collect more sensor readings."
        }

    scores = [
        r.health_score
        for r in readings
        if r.health_score is not None
    ]

    if len(scores) < 5:
        return {
            "current_health_score": 0,
            "predicted_health_score": 0,
            "trend": "Insufficient Data",
            "recommendation": "Collect more sensor readings."
        }

    X = np.arange(len(scores)).reshape(-1, 1)

    y = np.array(scores)

    model = LinearRegression()

    model.fit(X, y)

    next_score = int(model.predict([[len(scores)]])[0])

    current = scores[-1]

    if next_score > current:

        trend = "Improving"

        recommendation = (
            "Water quality is improving."
        )

    elif next_score < current:

        trend = "Declining"

        recommendation = (
            "Inspect water source and clean storage tank."
        )

    else:

        trend = "Stable"

        recommendation = (
            "Continue regular monitoring."
        )

    return {

        "current_health_score": current,

        "predicted_health_score": max(
            0,
            min(100, next_score)
        ),

        "trend": trend,

        "recommendation": recommendation
    }