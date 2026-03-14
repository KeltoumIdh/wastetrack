import os
from datetime import datetime, timezone
from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import (
    RegisterRequest, LoginRequest, AuthResponse,
    ScanResult, SaveDepositRequest, DepositResponse,
    HistoryItem, LeaderboardEntry, AnalyticsSummary,
)
from ai import classify_waste
from database import (
    get_db, get_profile, add_points,
    insert_deposit, get_user_deposits,
    get_leaderboard, get_analytics,
)

load_dotenv()

app = FastAPI(
    title="WasteTrack API",
    description="Smart recycling platform — MVP backend",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────────

@app.post("/api/auth/register", response_model=AuthResponse, tags=["Auth"])
async def register(body: RegisterRequest):
    """
    Register a new citizen.
    Supabase creates the auth user, we create the profile row.
    """
    db = get_db()
    try:
        # 1. Create auth user
        auth_res = db.auth.sign_up({
            "email": body.email,
            "password": body.password,
        })
        user_id = auth_res.user.id
        access_token = auth_res.session.access_token if auth_res.session else ""

        # 2. Create profile row
        db.table("profiles").insert({
            "id":               user_id,
            "name":             body.name,
            "email":            body.email,
            "city":             body.city,
            "points":           0,
            "total_deposits":   0,
        }).execute()

        return AuthResponse(
            access_token=access_token,
            user_id=user_id,
            name=body.name,
            email=body.email,
            points=0,
            city=body.city,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/auth/login", response_model=AuthResponse, tags=["Auth"])
async def login(body: LoginRequest):
    """Sign in an existing citizen."""
    db = get_db()
    try:
        auth_res = db.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password,
        })
        user_id = auth_res.user.id
        access_token = auth_res.session.access_token

        profile = get_profile(user_id) or {}
        return AuthResponse(
            access_token=access_token,
            user_id=user_id,
            name=profile.get("name", "User"),
            email=body.email,
            points=profile.get("points", 0),
            city=profile.get("city", "Rabat"),
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")


# ─────────────────────────────────────────────────────────────
# AI SCAN
# ─────────────────────────────────────────────────────────────

@app.post("/api/scan", response_model=ScanResult, tags=["Scan"])
async def scan_waste(photo: UploadFile = File(...)):
    """
    Receive a photo, run Gemini Vision AI, return waste classification.
    This does NOT save to DB — call /api/deposits after user confirms.
    """
    if not photo.content_type or not photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await photo.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="Image too large (max 10 MB)")

    result = classify_waste(image_bytes)
    return ScanResult(**result)


# ─────────────────────────────────────────────────────────────
# DEPOSITS
# ─────────────────────────────────────────────────────────────

@app.post("/api/deposits", response_model=DepositResponse, tags=["Deposits"])
async def save_deposit(body: SaveDepositRequest):
    """
    Save a verified deposit, award points to the user.
    Call this after the user confirms the AI result.
    """
    # Insert deposit row
    deposit = insert_deposit({
        "user_id":      body.user_id,
        "bin_id":       body.bin_id,
        "waste_type":   body.waste_type,
        "confidence":   body.confidence,
        "points_earned": body.points_earned,
        "photo_url":    body.photo_url,
        "verified":     body.confidence >= 0.70,
        "created_at":   datetime.now(timezone.utc).isoformat(),
    })

    # Update user points + deposit count
    new_balance = add_points(body.user_id, body.points_earned)
    db = get_db()
    profile = get_profile(body.user_id) or {}
    db.table("profiles").update({
        "total_deposits": (profile.get("total_deposits") or 0) + 1
    }).eq("id", body.user_id).execute()

    return DepositResponse(
        id=deposit.get("id", ""),
        waste_type=body.waste_type,
        points_earned=body.points_earned,
        new_balance=new_balance,
        created_at=deposit.get("created_at", datetime.now(timezone.utc).isoformat()),
        verified=body.confidence >= 0.70,
    )


@app.get("/api/deposits/{user_id}", response_model=list[HistoryItem], tags=["Deposits"])
async def get_history(user_id: str):
    """Get deposit history for a user."""
    deposits = get_user_deposits(user_id)

    bin_addresses = {
        34: "Bin #34 · Agdal",
        12: "Bin #12 · Hassan",
        8:  "Bin #8 · Hay Riad",
        21: "Bin #21 · Souissi",
    }

    return [
        HistoryItem(
            id=str(d.get("id", "")),
            waste_type=d.get("waste_type", "Plastic"),
            points_earned=d.get("points_earned", 0),
            bin_address=bin_addresses.get(d.get("bin_id"), "Bin · Rabat"),
            created_at=d.get("created_at", ""),
            verified=d.get("verified", True),
        )
        for d in deposits
    ]


# ─────────────────────────────────────────────────────────────
# USER PROFILE
# ─────────────────────────────────────────────────────────────

@app.get("/api/users/{user_id}", tags=["Users"])
async def get_user(user_id: str):
    """Get user profile with points balance."""
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile


# ─────────────────────────────────────────────────────────────
# LEADERBOARD
# ─────────────────────────────────────────────────────────────

@app.get("/api/leaderboard", response_model=list[LeaderboardEntry], tags=["Leaderboard"])
async def leaderboard(current_user_id: str = ""):
    """Get top 10 users by points."""
    rows = get_leaderboard(10)
    return [
        LeaderboardEntry(
            rank=i + 1,
            user_id=row.get("id", ""),
            name=row.get("name", "User"),
            city=row.get("city", "Rabat"),
            points=row.get("points", 0),
            items=row.get("total_deposits", 0),
            is_current_user=row.get("id") == current_user_id,
        )
        for i, row in enumerate(rows)
    ]


# ─────────────────────────────────────────────────────────────
# MUNICIPALITY ANALYTICS
# ─────────────────────────────────────────────────────────────

@app.get("/api/analytics", response_model=AnalyticsSummary, tags=["Municipality"])
async def analytics():
    """Live KPIs for the municipality dashboard."""
    data = get_analytics()
    return AnalyticsSummary(**data)


# ─────────────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "app": "WasteTrack API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
