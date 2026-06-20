"""
PlaceWise — ML Training Script
Generates synthetic placement dataset, trains XGBoost models,
and exports them as .joblib files.
"""
import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
import xgboost as xgb
import joblib

# ─── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_PATH    = os.path.join(SCRIPT_DIR, "data", "placement_data.csv")
MODELS_DIR   = os.path.join(SCRIPT_DIR, "models")
os.makedirs(os.path.join(SCRIPT_DIR, "data"), exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# ─── Skill Vocabulary (must match API) ────────────────────────────────────────
ALL_SKILLS = [
    "Python", "Java", "SQL", "ML", "Deep Learning", "NLP",
    "React", "Node.js", "AWS", "Docker", "Git", "Statistics",
    "Excel", "Tableau", "Power BI", "C++", "Data Analysis",
    "Communication", "Leadership", "Problem Solving"
]

BRANCH_MAP = {"CSE": 0, "IT": 1, "ECE": 2, "EEE": 3, "MECH": 4, "CIVIL": 5}
GENDER_MAP = {"M": 0, "F": 1}

# ─── Feature Names (must match prepare_features in ml_service.py) ─────────────
FEATURE_NAMES = [
    "cgpa", "internships", "backlogs", "projects", "certifications",
    "aptitude_score", "communication_score",
    "branch_encoded", "gender_encoded",
    "skill_count", "has_python", "has_ml", "has_sql"
]

HUMAN_READABLE_FEATURES = [
    "CGPA", "Internships", "Backlogs", "Projects", "Certifications",
    "Aptitude Score", "Communication Score",
    "Branch", "Gender",
    "Skill Count", "Has Python", "Has ML", "Has SQL"
]


# ─── Dataset Generation ───────────────────────────────────────────────────────
def generate_dataset(n: int = 600) -> pd.DataFrame:
    np.random.seed(42)
    branches  = list(BRANCH_MAP.keys())
    genders   = ["M", "F"]

    records = []
    for i in range(n):
        branch = np.random.choice(branches, p=[0.30, 0.20, 0.20, 0.10, 0.12, 0.08])
        gender = np.random.choice(genders, p=[0.60, 0.40])
        cgpa   = round(np.random.beta(6, 2) * 5 + 5, 2)  # skewed toward higher
        internships  = np.random.choice([0, 1, 2, 3], p=[0.30, 0.35, 0.25, 0.10])
        backlogs     = np.random.choice([0, 1, 2, 3, 4, 5], p=[0.50, 0.25, 0.12, 0.07, 0.04, 0.02])
        projects     = np.random.randint(0, 6)
        certifications = np.random.randint(0, 6)
        aptitude_score    = int(np.clip(np.random.normal(65, 15), 40, 100))
        communication_score = int(np.clip(np.random.normal(65, 15), 40, 100))

        # Skill selection — more skilled students more likely to be placed
        n_skills = np.random.choice(range(1, 11), p=[0.05,0.08,0.12,0.15,0.18,0.15,0.10,0.08,0.05,0.04])
        skills = list(np.random.choice(ALL_SKILLS, size=min(n_skills, len(ALL_SKILLS)), replace=False))

        # Placement probability formula (domain knowledge)
        score = (
            (cgpa - 5.0) * 0.25
            + internships * 0.15
            - backlogs   * 0.10
            + projects   * 0.05
            + certifications * 0.03
            + (aptitude_score - 50) / 100 * 0.20
            + (communication_score - 50) / 100 * 0.15
            + len(skills) * 0.02
            + (0.10 if "Python" in skills else 0)
            + (0.08 if "ML" in skills else 0)
            + (0.05 if "SQL" in skills else 0)
            + (0.05 if branch in ["CSE", "IT"] else 0)
        )
        prob_placed = 1 / (1 + np.exp(-score * 1.5 + 1.5))
        placed = int(np.random.random() < prob_placed)

        salary_lpa = 0.0
        if placed:
            base = 4.0
            salary_lpa = round(
                base
                + (cgpa - 5.0) * 0.8
                + internships * 0.6
                + len(skills) * 0.2
                + (aptitude_score - 50) / 100 * 1.5
                + np.random.normal(0, 0.8),
                2
            )
            salary_lpa = round(max(3.0, min(salary_lpa, 18.0)), 2)

        records.append({
            "student_id": i + 1,
            "branch": branch,
            "gender": gender,
            "cgpa": cgpa,
            "internships": internships,
            "backlogs": backlogs,
            "projects": projects,
            "certifications": certifications,
            "aptitude_score": aptitude_score,
            "communication_score": communication_score,
            "skills": "|".join(skills),
            "placed": placed,
            "salary_lpa": salary_lpa,
        })

    return pd.DataFrame(records)


# ─── Feature Engineering ──────────────────────────────────────────────────────
def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["branch_encoded"]  = df["branch"].map(BRANCH_MAP)
    df["gender_encoded"]  = df["gender"].map(GENDER_MAP)
    df["skill_list"]      = df["skills"].apply(lambda x: x.split("|") if isinstance(x, str) else [])
    df["skill_count"]     = df["skill_list"].apply(len)
    df["has_python"]      = df["skill_list"].apply(lambda s: int("Python" in s))
    df["has_ml"]          = df["skill_list"].apply(lambda s: int("ML" in s))
    df["has_sql"]         = df["skill_list"].apply(lambda s: int("SQL" in s))
    return df


# ─── Training ─────────────────────────────────────────────────────────────────
def train():
    print("=" * 60)
    print("  PlaceWise - ML Training")
    print("=" * 60)

    # Generate + save dataset
    print("\n[1/5] Generating dataset...")
    df = generate_dataset(600)
    df.to_csv(DATA_PATH, index=False)
    print(f"      Saved {len(df)} rows -> {DATA_PATH}")
    print(f"      Placement rate: {df['placed'].mean():.1%}")

    # Feature engineering
    print("\n[2/5] Engineering features...")
    df = engineer_features(df)
    X = df[FEATURE_NAMES].values
    y_class = df["placed"].values

    # Placement classifier
    print("\n[3/5] Training placement classifier (XGBoost)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y_class, test_size=0.2, random_state=42, stratify=y_class)

    clf = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        use_label_encoder=False,
        eval_metric="logloss",
        random_state=42
    )
    clf.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    preds = clf.predict(X_test)
    acc   = accuracy_score(y_test, preds)
    f1    = f1_score(y_test, preds)
    print(f"      Accuracy: {acc:.4f}  |  F1: {f1:.4f}")
    joblib.dump(clf, os.path.join(MODELS_DIR, "placement_model.joblib"))
    print(f"      Saved -> placement_model.joblib")

    # Salary regressor (only on placed=1 students)
    print("\n[4/5] Training salary regressor (XGBoost)...")
    df_placed = df[df["placed"] == 1].copy()
    Xs = df_placed[FEATURE_NAMES].values
    ys = df_placed["salary_lpa"].values

    Xs_train, Xs_test, ys_train, ys_test = train_test_split(Xs, ys, test_size=0.2, random_state=42)
    reg = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    reg.fit(Xs_train, ys_train, eval_set=[(Xs_test, ys_test)], verbose=False)

    ys_pred = reg.predict(Xs_test)
    r2   = r2_score(ys_test, ys_pred)
    rmse = mean_squared_error(ys_test, ys_pred) ** 0.5
    print(f"      R2: {r2:.4f}  |  RMSE: {rmse:.4f} LPA")
    joblib.dump(reg, os.path.join(MODELS_DIR, "salary_model.joblib"))
    print(f"      Saved -> salary_model.joblib")

    # Save metadata
    print("\n[5/5] Saving feature metadata...")
    joblib.dump(FEATURE_NAMES, os.path.join(MODELS_DIR, "feature_names.joblib"))
    joblib.dump(HUMAN_READABLE_FEATURES, os.path.join(MODELS_DIR, "human_feature_names.joblib"))

    meta = {
        "feature_names": FEATURE_NAMES,
        "human_feature_names": HUMAN_READABLE_FEATURES,
        "branch_map": BRANCH_MAP,
        "gender_map": GENDER_MAP,
        "all_skills": ALL_SKILLS,
        "placement_accuracy": round(acc, 4),
        "placement_f1": round(f1, 4),
        "salary_r2": round(r2, 4),
        "salary_rmse": round(rmse, 4),
    }
    with open(os.path.join(MODELS_DIR, "model_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print("\n" + "=" * 60)
    print("  Training complete! Models saved to ml/models/")
    print("=" * 60)


if __name__ == "__main__":
    train()
