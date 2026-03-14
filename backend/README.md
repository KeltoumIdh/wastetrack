# WasteTrack Backend

FastAPI + Supabase + Gemini AI — one-night hackathon MVP.

## Quick Start (5 minutes)

### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New project (free tier)
2. Wait ~2 min for it to spin up
3. Go to **SQL Editor** → paste the contents of `supabase_schema.sql` → Run
4. Go to **Settings → API** → copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_KEY`
   - `anon` key → for the frontend `.env`

### 2. Get a Gemini API key
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API key** (free, no credit card)
3. Copy the key → `GEMINI_API_KEY`

### 3. Configure environment
```bash
cd backend
cp .env.example .env
# Edit .env and fill in the 3 keys above
```

### 4. Install & run
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be live at **http://localhost:8000**

Interactive docs: **http://localhost:8000/docs**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new citizen |
| POST | `/api/auth/login` | Login |
| POST | `/api/scan` | AI waste classification (image upload) |
| POST | `/api/deposits` | Save deposit + award points |
| GET | `/api/deposits/{user_id}` | Get user's deposit history |
| GET | `/api/users/{user_id}` | Get user profile + points |
| GET | `/api/leaderboard` | Top 10 users by points |
| GET | `/api/analytics` | Municipality KPIs |

---

## Without Supabase (pure demo)

The AI scan endpoint works without Supabase — it just won't save to DB.
The frontend also has a **"Continue as demo user"** button that bypasses login entirely.

---

## Frontend connection

In the frontend root, edit `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Then `npm install && npm run dev`.
