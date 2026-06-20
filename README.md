# PlaceWise — Campus Placement & Skill Gap Analytics Platform

PlaceWise is a high-fidelity Campus Placement Prediction and Skill Gap Analytics platform powered by Machine Learning (XGBoost & SHAP) and FastAPI/React.

## Technology Stack

* **Frontend**: React (Vite) + Tailwind CSS v4 + Recharts + Framer Motion + Lucide Icons + Axios
* **Backend**: FastAPI (Python 3.14 compatible)
* **Database**: MongoDB (via Motor async driver)
* **Authentication**: JWT authentication with direct bcrypt hashing
* **Machine Learning**: Pandas, NumPy, Scikit-Learn, XGBoost, SHAP, Joblib

---

## Features

1. **Dashboard**: Overall campus trend visualizations, branch metrics, and quick simulation logs.
2. **Placement Predictor**: Multi-variable XGBoost classification modeling for individual profiles.
3. **CTC package Estimator**: XGBoost regression model calculating starting salary LPA.
4. **Explainable AI (SHAP)**: Attribute graph illustrating how CGPA, specific skills, and internships affected the predicted scores.
5. **Skill Gap Analyzer**: Radar charts comparing current skillsets against standard industry roles (e.g. Data Scientist, QA Engineer).
6. **AI Career recommendations**: Cosine similarity algorithm calculating match percentages for 15+ roles.
7. **PDF Report Downloader**: Streamed ReportLab PDF builder exporting prediction results, SHAP charts, and career recommendations.

---

## Setup & Startup Instructions

### Prerequisites
* **Python** (version 3.12+ recommended, works with 3.14)
* **Node.js** (version 20+ recommended)
* **MongoDB** (running locally on port 27017 or a remote Atlas cluster URI)

---

### 1. Backend Server Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   py -m pip install -r requirements.txt
   py -m pip install email-validator
   ```
3. Run the ML Model Training Script (generates datasets, trains XGBoost, saves model joblib files):
   ```bash
   py ml/train.py
   ```
4. Run the Database Seeder (creates demo credentials and dashboard simulation history logs):
   ```bash
   py ml/seed.py
   ```
5. Start the FastAPI development server:
   ```bash
   py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```

---

### 2. Frontend App Setup

1. Open another terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`.

---

### 3. Demo Credentials

To check the pre-populated dashboard charts and prediction logs immediately:
* **Demo Email**: `student@example.com`
* **Demo Password**: `student123`
* Alternatively, register a new account and fill in your own parameters!
