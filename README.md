# ♻️ WasteTrack

**Smart recycling platform** — Citizen app + Municipality dashboard. Built for a hackathon demo.

---

## 🚀 Live demo (UI)

**👉 [Open the live UI →](https://your-wastetrack-demo.netlify.app)**

*(Replace the link above with your deployed URL — e.g. Netlify, Vercel, or your own hosting.)*

---

## What it does

- **Citizen app (mobile-first):** Scan bin QR → capture waste photo → AI classifies (Plastic / Glass / Paper / Organic) → confirm or correct → earn points. History, impact, rewards, leaderboard, challenges.
- **Municipality portal:** Dashboard (KPIs, charts), Bin Monitor, Zones Map.
- **Backend:** FastAPI + Supabase (auth, DB) + Google Gemini (waste classification from image).

---

## Tech stack

| Layer      | Stack |
|-----------|--------|
| Frontend  | React (Vite), TailwindCSS, Framer Motion, React Router, Recharts, Lucide |
| Backend   | FastAPI, Python 3.x |
| Database  | Supabase (PostgreSQL) |
| AI        | Google Gemini (Vision) |

---

## Run locally

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/waste_management_app.git
cd waste_management_app
npm install
```

### 2. Environment (no secrets in repo)

- **Frontend:** copy `.env.example` → `.env`  
  Set `VITE_API_URL=http://localhost:8000` (and optional Supabase vars if you run backend).
- **Backend:** copy `backend/.env.example` → `backend/.env`  
  Fill in Supabase URL + service_role key + Gemini API key. See **Backend** below.

### 3. Start backend (optional — UI works with “demo user” without it)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Start frontend

```bash
npm run dev
```

Open **http://localhost:5173**. Use **“Continue as demo user”** on the login screen if the backend is not running.

---

## Backend (API + DB + AI)

Full setup (Supabase project, schema, Gemini key) is in **[backend/README.md](backend/README.md)**.

- **API docs when running:** http://localhost:8000/docs  
- **Endpoints:** auth (register/login), scan (AI), deposits, history, leaderboard, analytics.

---

## Project structure

```
waste_management_app/
├── public/              # Static assets, _redirects (e.g. Netlify)
├── src/
│   ├── api/             # AuthContext, client (API calls), supabase
│   ├── components/      # Reusable UI (Map, RewardCard, etc.)
│   ├── data/            # mockData.js
│   ├── layout/          # PhoneFrame, BottomNav, MobileShell, MuniShell, Sidebar
│   ├── municipality/    # Dashboard, BinMonitor, ZonesMap
│   ├── screens/         # Citizen app screens (Home, Scan, History, …)
│   ├── App.jsx, main.jsx, index.css, theme.js
├── backend/
│   ├── main.py          # FastAPI app
│   ├── ai.py            # Gemini waste classification
│   ├── database.py      # Supabase client
│   ├── models.py        # Pydantic models
│   ├── requirements.txt
│   └── supabase_schema.sql
├── .env.example         # Frontend env template
├── .gitignore
└── README.md            # This file
```

---

## Deploy UI (Netlify / Vercel)

- **Build command:** `npm run build`  
- **Publish directory:** `dist`  
- **Environment:** set `VITE_API_URL` to your backend URL if you deploy the API too.

After deploy, put the live link at the top of this README in the **Live demo (UI)** section.

---

## License

MIT — hackathon project.
