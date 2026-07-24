from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[int] = mapped_column(primary_key=True)

    device_id: Mapped[str] = mapped_column(
        ForeignKey("devices.device_id"),
        nullable=False
    )

    ph: Mapped[float] = mapped_column(Float)

    turbidity: Mapped[float] = mapped_column(Float)

    temperature: Mapped[float] = mapped_column(Float)

    tds: Mapped[int] = mapped_column(Integer)
    
    health_score: Mapped[int] = mapped_column(
        nullable=False
    )

    water_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )