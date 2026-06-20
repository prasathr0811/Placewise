from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from ..database import get_database
from ..models.user import UserCreate, UserLogin, UserResponse, UserUpdate, TokenResponse
from ..services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_response(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        branch=user.get("branch", ""),
        gender=user.get("gender", "M"),
        cgpa=user.get("cgpa", 0.0),
        skills=user.get("skills", []),
        internships=user.get("internships", 0),
        backlogs=user.get("backlogs", 0),
        projects=user.get("projects", 0),
        certifications=user.get("certifications", 0),
        aptitude_score=user.get("aptitude_score", 60.0),
        communication_score=user.get("communication_score", 60.0),
        created_at=user.get("created_at", datetime.now(timezone.utc)),
    )


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserCreate, db=Depends(get_database)):
    existing = await db["users"].find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        **data.model_dump(exclude={"password"}),
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["users"].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(result.inserted_id)})
    return TokenResponse(access_token=token, user=_user_response(user_doc))


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db=Depends(get_database)):
    user = await db["users"].find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["_id"])})
    return TokenResponse(access_token=token, user=_user_response(user))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return _user_response(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if not updates:
        return _user_response(current_user)

    await db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$set": updates}
    )
    updated = await db["users"].find_one({"_id": current_user["_id"]})
    return _user_response(updated)
