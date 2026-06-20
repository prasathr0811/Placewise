from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    cgpa: float = Field(ge=0.0, le=10.0)
    internships: int = Field(ge=0, le=10)
    backlogs: int = Field(ge=0, le=20)
    projects: int = Field(ge=0, le=20)
    certifications: int = Field(ge=0, le=20)
    aptitude_score: float = Field(ge=0.0, le=100.0)
    communication_score: float = Field(ge=0.0, le=100.0)
    branch: str
    gender: str
    skills: List[str] = []


class SHAPData(BaseModel):
    features: List[str]
    values: List[float]
    base_value: float


class PlacementResult(BaseModel):
    placed: bool
    probability: float
    confidence: str
    shap_values: SHAPData


class SalaryResult(BaseModel):
    salary_lpa: float
    salary_range: Dict[str, float]
    shap_values: SHAPData


class CombinedPredictionResponse(BaseModel):
    prediction_id: str
    placement: PlacementResult
    salary: SalaryResult


class PredictionRecord(BaseModel):
    id: str
    type: str
    input_features: Dict[str, Any]
    result: Dict[str, Any]
    created_at: datetime
