from fastapi import FastAPI

from app.core.config import settings
from app.database.database import Base
from app.database.database import engine

from app.models import Device

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "AquaGuardian Backend Running"
    }