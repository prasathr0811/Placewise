from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    branch: str
    gender: str
    cgpa: float = Field(ge=0.0, le=10.0)
    skills: List[str] = []
    internships: int = Field(ge=0, le=10, default=0)
    backlogs: int = Field(ge=0, le=20, default=0)
    projects: int = Field(ge=0, le=20, default=0)
    certifications: int = Field(ge=0, le=20, default=0)
    aptitude_score: float = Field(ge=0.0, le=100.0, default=60.0)
    communication_score: float = Field(ge=0.0, le=100.0, default=60.0)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    branch: str
    gender: str
    cgpa: float
    skills: List[str]
    internships: int
    backlogs: int
    projects: int
    certifications: int
    aptitude_score: float
    communication_score: float
    created_at: datetime


class UserUpdate(BaseModel):
    name: Optional[str] = None
    cgpa: Optional[float] = Field(None, ge=0.0, le=10.0)
    skills: Optional[List[str]] = None
    internships: Optional[int] = Field(None, ge=0)
    backlogs: Optional[int] = Field(None, ge=0)
    projects: Optional[int] = Field(None, ge=0)
    certifications: Optional[int] = Field(None, ge=0)
    aptitude_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    communication_score: Optional[float] = Field(None, ge=0.0, le=100.0)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
