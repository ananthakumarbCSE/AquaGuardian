from fastapi import FastAPI

app = FastAPI(
    title="AquaGuardian API",
    description="Backend API for IoT-based Water Quality Monitoring System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to AquaGuardian API",
        "status": "Running"
    }