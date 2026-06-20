import json
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List

from ..services.auth_service import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])

SKILLS_ROLES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "skills_roles.json")

with open(SKILLS_ROLES_PATH) as f:
    SKILLS_ROLES: dict = json.load(f)


class GapAnalysisRequest(BaseModel):
    student_skills: List[str]
    target_role: str


@router.get("/roles")
async def get_roles(_=Depends(get_current_user)):
    return {"roles": list(SKILLS_ROLES.keys())}


@router.post("/gap-analysis")
async def gap_analysis(data: GapAnalysisRequest, _=Depends(get_current_user)):
    role = data.target_role
    if role not in SKILLS_ROLES:
        raise HTTPException(status_code=404, detail=f"Role '{role}' not found")

    required_skills = set(SKILLS_ROLES[role])
    student_skills  = set(data.student_skills)

    matched  = list(required_skills & student_skills)
    missing  = list(required_skills - student_skills)
    match_pct = len(matched) / len(required_skills) * 100 if required_skills else 0

    # Priority: first 3 missing skills are highlighted
    priority_skills = missing[:3]

    return {
        "role": role,
        "required_skills": list(required_skills),
        "matched_skills": matched,
        "missing_skills": missing,
        "priority_skills": priority_skills,
        "match_percentage": round(match_pct, 1),
    }
