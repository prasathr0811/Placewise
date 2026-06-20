from fastapi import APIRouter, Depends
from ..database import get_database
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Static trend data (representative of training dataset distribution)
PLACEMENT_TREND = [
    {"month": "Jan", "rate": 58}, {"month": "Feb", "rate": 62},
    {"month": "Mar", "rate": 65}, {"month": "Apr", "rate": 70},
    {"month": "May", "rate": 68}, {"month": "Jun", "rate": 74},
]
BRANCH_STATS = [
    {"branch": "CSE",   "placed": 82, "total": 100},
    {"branch": "IT",    "placed": 75, "total": 80},
    {"branch": "ECE",   "placed": 60, "total": 80},
    {"branch": "EEE",   "placed": 52, "total": 60},
    {"branch": "MECH",  "placed": 44, "total": 65},
    {"branch": "CIVIL", "placed": 38, "total": 55},
]
SALARY_DIST = [
    {"range": "3-5 LPA",  "count": 45},
    {"range": "5-8 LPA",  "count": 120},
    {"range": "8-12 LPA", "count": 80},
    {"range": "12-15 LPA","count": 35},
    {"range": "15+ LPA",  "count": 20},
]


@router.get("/stats")
async def get_stats(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    uid = current_user["_id"]

    # Aggregate user predictions
    total_preds = await db["predictions"].count_documents({"user_id": uid})

    placement_preds = []
    salary_preds    = []
    async for doc in db["predictions"].find({"user_id": uid}).sort("created_at", -1).limit(10):
        pr = doc.get("placement_result", doc.get("result", {}))
        sr = doc.get("salary_result", {})
        if pr:
            placement_preds.append(pr)
        if sr:
            salary_preds.append(sr)

    placed_count = sum(1 for p in placement_preds if p.get("placed", False))
    placement_rate = (placed_count / len(placement_preds) * 100) if placement_preds else 0

    salaries = [s.get("salary_lpa", 0) for s in salary_preds if s.get("salary_lpa")]
    avg_salary = round(sum(salaries) / len(salaries), 2) if salaries else 0

    # Recent history
    history = []
    async for doc in db["predictions"].find({"user_id": uid}).sort("created_at", -1).limit(10):
        pr = doc.get("placement_result", doc.get("result", {}))
        sr = doc.get("salary_result", {})
        history.append({
            "id":        str(doc["_id"]),
            "type":      doc.get("type", "combined"),
            "placed":    pr.get("placed"),
            "probability": pr.get("probability"),
            "salary_lpa":  sr.get("salary_lpa"),
            "created_at":  doc["created_at"].isoformat(),
        })

    # Profile completeness score
    skills_count = len(current_user.get("skills", []))
    profile_score = min(100, int(
        (current_user.get("cgpa", 0) / 10 * 30)
        + (min(current_user.get("internships", 0), 3) / 3 * 20)
        + (min(skills_count, 10) / 10 * 30)
        + (min(current_user.get("projects", 0), 5) / 5 * 20)
    ))

    return {
        "total_predictions": total_preds,
        "placement_rate":    round(placement_rate, 1),
        "avg_salary":        avg_salary,
        "profile_score":     profile_score,
        "history":           history,
        "placement_trend":   PLACEMENT_TREND,
        "branch_stats":      BRANCH_STATS,
        "salary_distribution": SALARY_DIST,
    }
