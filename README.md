# EdgeVisionNet Live Energy Intelligence Platform
## Production-Grade Edge AI + Telemetry Dashboard

![Stack](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![Stack](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js)
![Stack](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow)
![Stack](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite)

---

## 🚀 Quick Start (3 terminals)

### Terminal 1 — Backend
```powershell
cd backend
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

### Terminal 2 — Laptop Agent
```powershell
cd agent
pip install -r requirements.txt
python laptop_agent.py
```

### Terminal 3 — Frontend
```powershell
cd frontend
npm run dev
```

Then open **http://localhost:3000** → Signup → Dashboard shows live telemetry!

---

## 📁 Project Structure

```
EDGE-AI-Project/
│
├── backend/               ← FastAPI Python backend
│   ├── api.py             ← Main app + auth endpoints
│   ├── auth.py            ← JWT + bcrypt
│   ├── database.py        ← SQLAlchemy ORM (SQLite)
│   ├── telemetry.py       ← Device metrics ingestion
│   ├── energy.py          ← Power estimation + CO₂
│   ├── prediction.py      ← AI inference API
│   └── requirements.txt
│
├── frontend/              ← Next.js 14 + Tailwind + Framer Motion
│   ├── app/
│   │   ├── login/         ← JWT login page
│   │   ├── signup/        ← Registration page
│   │   └── (dashboard)/   ← Protected routes
│   │       ├── dashboard/ ← Live metrics + charts
│   │       ├── analytics/ ← Historical trends + CSV export
│   │       ├── predict/   ← AI image inference + webcam
│   │       ├── devices/   ← Device management
│   │       └── compare/   ← Edge vs Cloud comparison
│   ├── components/        ← MetricCard, LiveChart, Sidebar
│   ├── context/           ← AuthContext
│   └── lib/               ← API client, types
│
├── agent/
│   ├── laptop_agent.py    ← Real psutil telemetry (2s polling)
│   └── future_phone_agent.py  ← Android Phase 2 placeholder
│
├── ai/
│   ├── model_loader.py    ← Keras + TFLite loader (cached)
│   ├── inference.py       ← Standard TF inference pipeline
│   └── tflite_inference.py  ← TFLite optimized pipeline
│
└── results/               ← Exported CSVs + PDF reports
```

---

## 🔑 API Reference

| Method | Endpoint           | Auth | Description                    |
|--------|-------------------|------|--------------------------------|
| POST   | `/signup`          | ❌   | Create user account            |
| POST   | `/login`           | ❌   | Get JWT token                  |
| GET    | `/me`              | ✅   | Current user info              |
| POST   | `/device-metrics`  | ❌   | Ingest telemetry from agent    |
| GET    | `/live-metrics`    | ❌   | Latest telemetry snapshot      |
| GET    | `/history`         | ❌   | Historical telemetry           |
| GET    | `/devices`         | ✅   | List user's devices            |
| POST   | `/predict`         | ✅   | AI image inference             |
| GET    | `/model-stats`     | ❌   | Model benchmark table          |
| GET    | `/comparison`      | ❌   | Edge vs cloud comparison       |
| GET    | `/energy-report`   | ✅   | User energy usage summary      |

Full interactive docs: **http://localhost:8000/docs**

---

## ⚡ Energy Formula

```
Estimated Power (W) = 15W × (0.30 + 0.70 × CPU%)

Example at 40% CPU:
  P = 15 × (0.30 + 0.70 × 0.40) = 8.70 W

Cloud baseline: 12W
Energy saved per inference = max(12W - edge_W, 0)
CO₂ savings = energy_saved_kWh × 0.233 kg/kWh
```

---

## 🤖 AI Models Supported

| Model         | Accuracy | Latency | Size  | Energy/inf |
|--------------|---------|---------|-------|-----------|
| MobileNetV2   | 71.8%   | 42ms    | 14MB  | 0.08 µWh  |
| EfficientNet-B0 | 77.1% | 68ms    | 21MB  | 0.12 µWh  |
| ShuffleNet    | 69.4%   | 31ms    | 8MB   | 0.06 µWh  |
| EdgeVisionNet | 74.2%   | 38ms    | 11MB  | 0.07 µWh  |

*Uses ImageNet pre-trained weights. Replace with custom .tflite files for production.*

---

## 📱 Phase 2: Android

The backend already accepts Android telemetry payloads (`device_type: "android"`).
See `agent/future_phone_agent.py` for the ADB bridge and simulation mode.

---

## 🛡️ Security

- JWT tokens expire in 24 hours
- Passwords hashed with bcrypt (12 rounds)
- CORS restricted to `localhost:3000` (update for production)
- Change `SECRET_KEY` in `backend/auth.py` before deploying!
