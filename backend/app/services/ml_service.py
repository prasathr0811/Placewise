"""
ML Service — loads trained XGBoost models and runs inference.
Feature preparation must exactly match ml/train.py.
"""
import os
import json
import numpy as np
import joblib
from typing import Dict, Any

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "models")

BRANCH_MAP = {"CSE": 0, "IT": 1, "ECE": 2, "EEE": 3, "MECH": 4, "CIVIL": 5}
GENDER_MAP = {"M": 0, "F": 1}

FEATURE_NAMES = [
    "cgpa", "internships", "backlogs", "projects", "certifications",
    "aptitude_score", "communication_score",
    "branch_encoded", "gender_encoded",
    "skill_count", "has_python", "has_ml", "has_sql"
]


class MLService:
    def __init__(self):
        self.placement_model = None
        self.salary_model = None
        self.feature_names = FEATURE_NAMES
        self._loaded = False

    def load_models(self):
        try:
            self.placement_model = joblib.load(os.path.join(MODELS_DIR, "placement_model.joblib"))
            self.salary_model    = joblib.load(os.path.join(MODELS_DIR, "salary_model.joblib"))
            self._loaded = True
            print("ML models loaded successfully")
        except FileNotFoundError as e:
            print(f"Models not found: {e}. Run ml/train.py first.")
            self._loaded = False

    def prepare_features(self, inp: Dict[str, Any]) -> np.ndarray:
        """Convert API input dict to feature vector matching train.py."""
        skills = inp.get("skills", [])
        branch_encoded  = BRANCH_MAP.get(inp.get("branch", "CSE"), 0)
        gender_encoded  = GENDER_MAP.get(inp.get("gender", "M"), 0)
        skill_count     = len(skills)
        has_python      = int("Python" in skills)
        has_ml          = int("ML" in skills)
        has_sql         = int("SQL" in skills)

        features = np.array([[
            float(inp.get("cgpa", 7.0)),
            int(inp.get("internships", 0)),
            int(inp.get("backlogs", 0)),
            int(inp.get("projects", 0)),
            int(inp.get("certifications", 0)),
            float(inp.get("aptitude_score", 60)),
            float(inp.get("communication_score", 60)),
            branch_encoded,
            gender_encoded,
            skill_count,
            has_python,
            has_ml,
            has_sql,
        ]], dtype=float)
        return features

    def predict_placement(self, inp: Dict[str, Any]) -> Dict[str, Any]:
        if not self._loaded:
            # Fallback demo values when models not loaded
            return {"placed": True, "probability": 0.72, "confidence": "High"}

        features = self.prepare_features(inp)
        prob = float(self.placement_model.predict_proba(features)[0][1])
        placed = prob >= 0.5
        confidence = "High" if prob > 0.75 or prob < 0.25 else "Medium" if prob > 0.55 or prob < 0.45 else "Low"
        return {"placed": placed, "probability": round(prob, 4), "confidence": confidence}

    def predict_salary(self, inp: Dict[str, Any]) -> Dict[str, Any]:
        if not self._loaded:
            return {"salary_lpa": 6.5, "salary_range": {"min": 5.0, "max": 8.5}}

        features = self.prepare_features(inp)
        salary = float(self.salary_model.predict(features)[0])
        salary = max(3.0, min(salary, 18.0))
        return {
            "salary_lpa": round(salary, 2),
            "salary_range": {
                "min": round(max(3.0, salary - 1.5), 2),
                "max": round(min(18.0, salary + 1.5), 2),
            }
        }


# Singleton
ml_service = MLService()
