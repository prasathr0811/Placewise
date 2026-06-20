# 🎓 PlaceWise — Campus Placement & Skill Gap Analytics Platform

<div align="center">

[![Live Web App](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://placewise-m.vercel.app/)
[![API Backend](https://img.shields.io/badge/API_Backend-Render-darkblue?style=for-the-badge&logo=render&logoColor=white)](https://placewise-t3b2.onrender.com)

</div>

PlaceWise is a modern, high-fidelity **Campus Placement Prediction & Skill Gap Analytics platform** powered by Machine Learning (XGBoost & SHAP explainability), FastAPI, and React. It helps students simulate placement scenarios, analyze skill gaps, and explore AI-driven career recommendations.


---

## 🚀 Key Features

* **📊 Interactive Dashboard**: Real-time campus placement trends, branch metrics, and quick simulation logs.
* **🔮 Placement Predictor**: Multi-variable XGBoost classification predicting placement probability.
* **💸 Salary Estimator**: XGBoost regression model estimating starting salary CTC packages.
* **🧠 Explainable AI (SHAP)**: Feature importance charts demonstrating how CGPA, specific skills, and internships affect the prediction.
* **🕸️ Skill Gap Analyzer**: Interactive Recharts Radar charts comparing current skillsets against standard industry roles (e.g., Data Scientist, QA Engineer).
* **🎯 AI Career Matcher**: Cosine similarity algorithm calculating match percentages for 15+ specialized technical roles.
* **📄 PDF Report Downloader**: Instant streamed ReportLab PDF builder containing prediction results, SHAP charts, and career recommendations.
* **🌓 Theme Switcher**: Sleek system-integrated light and dark mode toggles with a premium glassmorphic UI.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS v4 + Recharts + Framer Motion + Lucide Icons + Axios |
| **Backend** | FastAPI (Python 3.11+) + Uvicorn |
| **Database** | MongoDB Atlas (via Motor async driver) |
| **Machine Learning** | Pandas, NumPy, Scikit-Learn, XGBoost, SHAP, Joblib |
| **Authentication** | JWT Authentication with secure custom Bcrypt hashing |

---

## ⚙️ Monorepo Architecture

```text
Placewise/
├── backend/                  # FastAPI Backend API
│   ├── app/
│   │   ├── routers/          # API Route Controllers (auth, predict, careers, etc.)
│   │   ├── services/         # Business Logic (ML prediction, SHAP, PDF reports)
│   │   └── database.py       # Async MongoDB Connection setup
│   ├── ml/
│   │   ├── models/           # Trained model binaries (.joblib)
│   │   ├── train.py          # XGBoost Training Pipeline
│   │   └── seed.py           # Database Seeder
│   └── requirements.txt      # Python Dependencies
├── frontend/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Layouts & Protected Routes
│   │   ├── context/          # Auth & Theme State Providers
│   │   ├── pages/            # View Screens (Dashboard, Predict, SkillGap, etc.)
│   │   └── api/              # Axios Client Settings
│   └── vercel.json           # Vercel Deployment Configuration
```

---

## 💻 Local Development Setup

### Prerequisites
* **Python 3.11+** installed
* **Node.js 20+** installed
* **MongoDB** (running locally on port `27017` or a remote Atlas connection string)

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Run the ML pipeline to train XGBoost models:
   ```bash
   python ml/train.py
   ```
6. Seed the MongoDB database with demo profiles:
   ```bash
   python ml/seed.py
   ```
7. Start the Uvicorn server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   *The backend will be running at `http://127.0.0.1:8000`.*

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser.

---

## ☁️ Cloud Deployment Guide

### Backend: FastAPI on **Render**
1. Create a new **Web Service** on Render pointing to your GitHub repository.
2. Select **Python** runtime environment.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `pip install -r requirements.txt && python ml/train.py`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add the following **Environment Variables** in the Render settings panel:
   * `MONGODB_URI` *(Your MongoDB Atlas connection URI)*
   * `JWT_SECRET` *(Your JWT secret)*
   * `ALLOWED_ORIGINS` *(Include your Vercel frontend URL)*
   * `ENVIRONMENT` = `production`

### Frontend: React on **Vercel**
1. Create a new **Project** in Vercel and import your repository.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add the following **Environment Variable**:
   * `VITE_API_URL` = `https://your-backend-name.onrender.com`
5. Click **Deploy**.

---

## 🔑 Demo Credentials

To access pre-populated simulation histories and check the interactive dashboard instantly:
* **Demo Email**: `student@example.com`
* **Demo Password**: `student123`
* *Or register a fresh account and test custom profiles!*
