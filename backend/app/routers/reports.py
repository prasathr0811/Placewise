import json
import os
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId
import io

from ..database import get_database
from ..models.report import ReportRequest
from ..services.auth_service import get_current_user
from ..services.pdf_service import pdf_service

router = APIRouter(prefix="/reports", tags=["reports"])

PROFILES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "career_profiles.json")
with open(PROFILES_PATH) as f:
    CAREER_DATA = json.load(f)

SKILL_VOCAB  = CAREER_DATA["skill_vocabulary"]
ROLE_VECTORS = CAREER_DATA["roles"]
ROLE_META    = CAREER_DATA["role_metadata"]


def _get_career_recs(user_skills: list) -> list:
    user_vec = np.array([1 if s in user_skills else 0 for s in SKILL_VOCAB], dtype=float)
    results = []
    for role, rv in ROLE_VECTORS.items():
        rv_arr = np.array(rv, dtype=float)
        norm   = np.linalg.norm(user_vec) * np.linalg.norm(rv_arr)
        sim    = float(np.dot(user_vec, rv_arr) / norm) if norm > 0 else 0.0
        required = [SKILL_VOCAB[i] for i, v in enumerate(rv) if v == 1]
        missing  = [s for s in required if s not in user_skills]
        meta     = ROLE_META.get(role, {})
        results.append({
            "role_name":       role,
            "match_percentage": round(sim * 100, 1),
            "required_skills": required,
            "missing_skills":  missing,
            "avg_salary_range": meta.get("avg_salary", "—"),
            "growth_outlook":   meta.get("growth", "—"),
        })
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results[:5]


@router.post("/generate")
async def generate_report(
    data: ReportRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    # Fetch prediction
    try:
        oid = ObjectId(data.prediction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid prediction ID")

    pred_doc = await db["predictions"].find_one({"_id": oid, "user_id": current_user["_id"]})
    if not pred_doc:
        raise HTTPException(status_code=404, detail="Prediction not found")

    placement_result = pred_doc.get("placement_result", pred_doc.get("result", {}))
    salary_result    = pred_doc.get("salary_result", {})
    shap_data        = placement_result.get("shap_values", {
        "features": [], "values": [], "base_value": 0.0
    })

    # Career recs
    career_recs = []
    if data.include_career_recs:
        career_recs = _get_career_recs(current_user.get("skills", []))

    user_dict = {
        "name": current_user.get("name", "Student"),
        "email": current_user.get("email", ""),
        "branch": current_user.get("branch", ""),
        "gender": current_user.get("gender", ""),
        "cgpa": current_user.get("cgpa", 0.0),
    }

    pdf_bytes = pdf_service.generate_report(
        user=user_dict,
        placement_result=placement_result,
        salary_result=salary_result,
        career_recs=career_recs,
        shap_data=shap_data,
    )

    filename = f"placewise_report_{data.prediction_id[:8]}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
