import json
import os
import numpy as np
from fastapi import APIRouter, Depends, HTTPException

from ..database import get_database
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/careers", tags=["careers"])

PROFILES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "career_profiles.json")

with open(PROFILES_PATH) as f:
    CAREER_DATA = json.load(f)

SKILL_VOCAB    = CAREER_DATA["skill_vocabulary"]
ROLE_VECTORS   = CAREER_DATA["roles"]
ROLE_METADATA  = CAREER_DATA["role_metadata"]


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def user_skill_vector(skills: list) -> np.ndarray:
    return np.array([1 if s in skills else 0 for s in SKILL_VOCAB], dtype=float)


@router.get("/recommendations")
async def get_recommendations(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_skills = current_user.get("skills", [])
    user_vec    = user_skill_vector(user_skills)

    results = []
    for role, role_vec in ROLE_VECTORS.items():
        rv = np.array(role_vec, dtype=float)
        sim = cosine_similarity(user_vec, rv)
        required = [SKILL_VOCAB[i] for i, v in enumerate(role_vec) if v == 1]
        missing  = [s for s in required if s not in user_skills]
        meta     = ROLE_METADATA.get(role, {})

        results.append({
            "role_name":       role,
            "match_percentage": round(sim * 100, 1),
            "required_skills": required,
            "missing_skills":  missing,
            "avg_salary_range": meta.get("avg_salary", "—"),
            "growth_outlook":   meta.get("growth", "—"),
            "domain":           meta.get("domain", "—"),
        })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return {"recommendations": results[:10], "total": len(results)}


@router.get("/roles/{role_name}")
async def get_role_detail(role_name: str, _=Depends(get_current_user)):
    if role_name not in ROLE_VECTORS:
        raise HTTPException(status_code=404, detail=f"Role '{role_name}' not found")

    role_vec  = ROLE_VECTORS[role_name]
    required  = [SKILL_VOCAB[i] for i, v in enumerate(role_vec) if v == 1]
    meta      = ROLE_METADATA.get(role_name, {})

    return {
        "role_name":       role_name,
        "required_skills": required,
        "avg_salary_range": meta.get("avg_salary", "—"),
        "growth_outlook":   meta.get("growth", "—"),
        "domain":           meta.get("domain", "—"),
    }
