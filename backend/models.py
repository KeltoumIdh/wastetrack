from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    city: str = "Rabat"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    user_id: str
    name: str
    email: str
    points: int
    city: str


# ── Scan / Deposit ────────────────────────────────────────────

class ScanResult(BaseModel):
    waste_type: str          # Plastic | Glass | Paper | Organic
    detected_object: str     # e.g. "plastic bottle"
    confidence: float        # 0.0 – 1.0
    correct_bin: str         # same as waste_type
    points_earned: int
    tip: str                 # eco tip for the user


class SaveDepositRequest(BaseModel):
    user_id: str
    bin_id: Optional[int] = 34
    waste_type: str
    confidence: float
    points_earned: int
    photo_url: Optional[str] = None


class DepositResponse(BaseModel):
    id: str
    waste_type: str
    points_earned: int
    new_balance: int
    created_at: str
    verified: bool = True


# ── History ───────────────────────────────────────────────────

class HistoryItem(BaseModel):
    id: str
    waste_type: str
    points_earned: int
    bin_address: str
    created_at: str
    verified: bool


# ── Leaderboard ───────────────────────────────────────────────

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    name: str
    city: str
    points: int
    items: int
    is_current_user: bool = False


# ── Analytics (Municipality) ──────────────────────────────────

class AnalyticsSummary(BaseModel):
    total_deposits: int
    active_users: int
    sort_accuracy: float
    co2_avoided_kg: float
    plastic_count: int
    glass_count: int
    paper_count: int
    organic_count: int
