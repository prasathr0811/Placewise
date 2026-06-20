from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from ..database import get_database
from ..models.prediction import PredictionInput, CombinedPredictionResponse, PlacementResult, SalaryResult, SHAPData, PredictionRecord
from ..services.auth_service import get_current_user
from ..services.ml_service import ml_service
from ..services.shap_service import shap_service

router = APIRouter(prefix="/predict", tags=["predictions"])


def _build_combined(inp: PredictionInput, prediction_id: str) -> CombinedPredictionResponse:
    input_dict = inp.model_dump()
    features   = ml_service.prepare_features(input_dict)

    placement_raw = ml_service.predict_placement(input_dict)
    salary_raw    = ml_service.predict_salary(input_dict)
    shap_place    = shap_service.compute_placement_shap(features)
    shap_sal      = shap_service.compute_salary_shap(features)

    placement = PlacementResult(
        placed=placement_raw["placed"],
        probability=placement_raw["probability"],
        confidence=placement_raw["confidence"],
        shap_values=SHAPData(**shap_place),
    )
    salary = SalaryResult(
        salary_lpa=salary_raw["salary_lpa"],
        salary_range=salary_raw["salary_range"],
        shap_values=SHAPData(**shap_sal),
    )
    return CombinedPredictionResponse(
        prediction_id=prediction_id,
        placement=placement,
        salary=salary,
    )


@router.post("/combined", response_model=CombinedPredictionResponse)
async def predict_combined(
    inp: PredictionInput,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    input_dict = inp.model_dump()
    features   = ml_service.prepare_features(input_dict)

    placement_raw = ml_service.predict_placement(input_dict)
    salary_raw    = ml_service.predict_salary(input_dict)
    shap_place    = shap_service.compute_placement_shap(features)
    shap_sal      = shap_service.compute_salary_shap(features)

    doc = {
        "user_id": current_user["_id"],
        "type": "combined",
        "input_features": input_dict,
        "placement_result": {**placement_raw, "shap_values": shap_place},
        "salary_result":    {**salary_raw,    "shap_values": shap_sal},
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["predictions"].insert_one(doc)
    pid = str(result.inserted_id)

    return CombinedPredictionResponse(
        prediction_id=pid,
        placement=PlacementResult(
            placed=placement_raw["placed"],
            probability=placement_raw["probability"],
            confidence=placement_raw["confidence"],
            shap_values=SHAPData(**shap_place),
        ),
        salary=SalaryResult(
            salary_lpa=salary_raw["salary_lpa"],
            salary_range=salary_raw["salary_range"],
            shap_values=SHAPData(**shap_sal),
        ),
    )


@router.post("/placement")
async def predict_placement(
    inp: PredictionInput,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    input_dict = inp.model_dump()
    features   = ml_service.prepare_features(input_dict)
    result_raw = ml_service.predict_placement(input_dict)
    shap_data  = shap_service.compute_placement_shap(features)

    doc = {
        "user_id": current_user["_id"],
        "type": "placement",
        "input_features": input_dict,
        "result": {**result_raw, "shap_values": shap_data},
        "created_at": datetime.now(timezone.utc),
    }
    ins = await db["predictions"].insert_one(doc)
    return {**result_raw, "shap_values": shap_data, "prediction_id": str(ins.inserted_id)}


@router.post("/salary")
async def predict_salary(
    inp: PredictionInput,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    input_dict = inp.model_dump()
    features   = ml_service.prepare_features(input_dict)
    result_raw = ml_service.predict_salary(input_dict)
    shap_data  = shap_service.compute_salary_shap(features)

    doc = {
        "user_id": current_user["_id"],
        "type": "salary",
        "input_features": input_dict,
        "result": {**result_raw, "shap_values": shap_data},
        "created_at": datetime.now(timezone.utc),
    }
    ins = await db["predictions"].insert_one(doc)
    return {**result_raw, "shap_values": shap_data, "prediction_id": str(ins.inserted_id)}


@router.get("/history")
async def prediction_history(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    cursor = db["predictions"].find(
        {"user_id": current_user["_id"]}
    ).sort("created_at", -1).limit(20)

    records = []
    async for doc in cursor:
        records.append({
            "id": str(doc["_id"]),
            "type": doc.get("type", "combined"),
            "input_features": doc.get("input_features", {}),
            "placement_result": doc.get("placement_result", doc.get("result", {})),
            "salary_result": doc.get("salary_result", {}),
            "created_at": doc["created_at"].isoformat(),
        })
    return {"history": records, "total": len(records)}


@router.get("/{prediction_id}")
async def get_prediction(
    prediction_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    try:
        oid = ObjectId(prediction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid prediction ID")

    doc = await db["predictions"].find_one({"_id": oid, "user_id": current_user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return {
        "id": str(doc["_id"]),
        "type": doc.get("type", "combined"),
        "input_features": doc.get("input_features", {}),
        "placement_result": doc.get("placement_result", doc.get("result", {})),
        "salary_result": doc.get("salary_result", {}),
        "created_at": doc["created_at"].isoformat(),
    }
