from fastapi import APIRouter

from app.api.v1.device import router as device_router
from app.api.v1.sensor.router import router as sensor_router
from app.api.v1.alert.router import router as alert_router
from app.api.v1.dashboard.router import router as dashboard_router
from app.api.v1.analytics.router import router as analytics_router
from app.api.v1.prediction.router import router as prediction_router
from app.api.v1.maintenance.router import router as maintenance_router
from app.api.v1.device_list import router as device_list_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(device_router)

api_router.include_router(device_list_router)

api_router.include_router(sensor_router)

api_router.include_router(alert_router)

api_router.include_router(dashboard_router)

api_router.include_router(analytics_router)

api_router.include_router(prediction_router)

api_router.include_router(maintenance_router)