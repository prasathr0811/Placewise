from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import connect_db, close_db
from .services.ml_service import ml_service
from .services.shap_service import shap_service
from .routers import auth, predict, skills, careers, dashboard, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    ml_service.load_models()
    shap_service.load_explainers()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="PlaceWise API",
    description="AI-powered campus placement prediction platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router,      prefix="/api")
app.include_router(predict.router,   prefix="/api")
app.include_router(skills.router,    prefix="/api")
app.include_router(careers.router,   prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(reports.router,   prefix="/api")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "1.0.0",
        "models_loaded": ml_service._loaded,
    }
