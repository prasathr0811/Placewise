import asyncio
from datetime import datetime, timedelta, timezone
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

async def seed():
    print("Seeding database...")
    client = AsyncIOMotorClient("mongodb://localhost:27017/placewise")
    db = client["placewise"]

    # Check if student exists
    student_email = "student@example.com"
    existing = await db["users"].find_one({"email": student_email})
    
    if existing:
        print("Demo student account already exists. Re-seeding prediction history...")
        user_id = existing["_id"]
    else:
        # Create student user
        user_doc = {
            "name": "Demo Student",
            "email": student_email,
            "password_hash": hash_password("student123"),
            "branch": "CSE",
            "gender": "M",
            "cgpa": 8.5,
            "internships": 2,
            "backlogs": 0,
            "projects": 3,
            "certifications": 2,
            "aptitude_score": 85.0,
            "communication_score": 80.0,
            "skills": ["Python", "SQL", "React", "ML", "Git", "Docker", "Problem Solving"],
            "created_at": datetime.now(timezone.utc) - timedelta(days=5)
        }
        res = await db["users"].insert_one(user_doc)
        user_id = res.inserted_id
        print(f"Created demo student account. ID: {user_id}")

    # Clear old predictions for demo student to ensure a fresh set
    await db["predictions"].delete_many({"user_id": user_id})

    # Add mock predictions
    mock_predictions = [
        {
            "user_id": user_id,
            "type": "combined",
            "input_features": {
                "branch": "CSE",
                "gender": "M",
                "cgpa": 8.5,
                "internships": 2,
                "backlogs": 0,
                "projects": 3,
                "certifications": 2,
                "aptitude_score": 85.0,
                "communication_score": 80.0,
                "skills": ["Python", "SQL", "React", "ML", "Git", "Docker", "Problem Solving"]
            },
            "placement_result": {
                "placed": True,
                "probability": 0.88,
                "confidence": "High",
                "shap_values": {
                    "features": ["CGPA", "Internships", "Backlogs", "Projects", "Certifications", "Aptitude Score", "Comm. Score", "Branch", "Gender", "Skill Count", "Has Python", "Has ML", "Has SQL"],
                    "values": [0.42, 0.28, 0.0, 0.15, 0.05, 0.20, 0.18, 0.05, 0.0, 0.12, 0.15, 0.18, 0.10],
                    "base_value": 0.0
                }
            },
            "salary_result": {
                "salary_lpa": 8.5,
                "salary_range": {
                    "min": 7.0,
                    "max": 10.0
                },
                "shap_values": {
                    "features": ["CGPA", "Internships", "Backlogs", "Projects", "Certifications", "Aptitude Score", "Comm. Score", "Branch", "Gender", "Skill Count", "Has Python", "Has ML", "Has SQL"],
                    "values": [0.35, 0.22, 0.0, 0.12, 0.08, 0.15, 0.10, 0.05, 0.0, 0.14, 0.20, 0.18, 0.09],
                    "base_value": 0.0
                }
            },
            "created_at": datetime.now(timezone.utc) - timedelta(days=2)
        },
        {
            "user_id": user_id,
            "type": "combined",
            "input_features": {
                "branch": "CSE",
                "gender": "M",
                "cgpa": 7.0,
                "internships": 1,
                "backlogs": 1,
                "projects": 1,
                "certifications": 0,
                "aptitude_score": 65.0,
                "communication_score": 60.0,
                "skills": ["Java", "SQL", "Git"]
            },
            "placement_result": {
                "placed": False,
                "probability": 0.38,
                "confidence": "Medium",
                "shap_values": {
                    "features": ["CGPA", "Internships", "Backlogs", "Projects", "Certifications", "Aptitude Score", "Comm. Score", "Branch", "Gender", "Skill Count", "Has Python", "Has ML", "Has SQL"],
                    "values": [-0.15, 0.05, -0.22, 0.0, -0.10, 0.05, 0.02, 0.05, 0.0, -0.12, -0.15, -0.18, 0.10],
                    "base_value": 0.0
                }
            },
            "salary_result": {
                "salary_lpa": 4.2,
                "salary_range": {
                    "min": 3.0,
                    "max": 5.7
                },
                "shap_values": {
                    "features": ["CGPA", "Internships", "Backlogs", "Projects", "Certifications", "Aptitude Score", "Comm. Score", "Branch", "Gender", "Skill Count", "Has Python", "Has ML", "Has SQL"],
                    "values": [-0.10, 0.02, -0.18, 0.0, -0.05, 0.02, 0.0, 0.05, 0.0, -0.08, -0.12, -0.15, 0.05],
                    "base_value": 0.0
                }
            },
            "created_at": datetime.now(timezone.utc) - timedelta(days=4)
        }
    ]

    await db["predictions"].insert_many(mock_predictions)
    print("Database successfully seeded with demo student and prediction records!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
