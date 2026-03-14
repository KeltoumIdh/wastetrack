import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

_client: Client | None = None


def get_db() -> Client:
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError(
                "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env"
            )
        _client = create_client(url, key)
    return _client


# ── Helper: get user profile row ─────────────────────────────

def get_profile(user_id: str) -> dict | None:
    db = get_db()
    res = db.table("profiles").select("*").eq("id", user_id).single().execute()
    return res.data


# ── Helper: increment user points ────────────────────────────

def add_points(user_id: str, points: int) -> int:
    db = get_db()
    profile = get_profile(user_id)
    if not profile:
        return 0
    new_balance = (profile.get("points", 0) or 0) + points
    db.table("profiles").update({"points": new_balance}).eq("id", user_id).execute()
    return new_balance


# ── Helper: insert deposit row ───────────────────────────────

def insert_deposit(data: dict) -> dict:
    db = get_db()
    res = db.table("deposits").insert(data).execute()
    return res.data[0] if res.data else {}


# ── Helper: get deposits for a user ──────────────────────────

def get_user_deposits(user_id: str, limit: int = 20) -> list[dict]:
    db = get_db()
    res = (
        db.table("deposits")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return res.data or []


# ── Helper: leaderboard ───────────────────────────────────────

def get_leaderboard(limit: int = 10) -> list[dict]:
    db = get_db()
    res = (
        db.table("profiles")
        .select("id, name, city, points, total_deposits")
        .order("points", desc=True)
        .limit(limit)
        .execute()
    )
    return res.data or []


# ── Helper: analytics summary ────────────────────────────────

def get_analytics() -> dict:
    db = get_db()

    # Total deposits
    deposits_res = db.table("deposits").select("waste_type, verified").execute()
    deposits = deposits_res.data or []

    total = len(deposits)
    verified = sum(1 for d in deposits if d.get("verified"))
    accuracy = round((verified / total * 100) if total > 0 else 92.0, 1)

    counts = {"Plastic": 0, "Glass": 0, "Paper": 0, "Organic": 0}
    for d in deposits:
        wt = d.get("waste_type", "")
        if wt in counts:
            counts[wt] += 1

    # Active users
    users_res = db.table("profiles").select("id").execute()
    active_users = len(users_res.data or [])

    # CO2: rough estimate (0.3 kg per deposit)
    co2 = round(total * 0.3, 1)

    return {
        "total_deposits": total,
        "active_users": active_users,
        "sort_accuracy": accuracy,
        "co2_avoided_kg": co2,
        "plastic_count": counts["Plastic"],
        "glass_count": counts["Glass"],
        "paper_count": counts["Paper"],
        "organic_count": counts["Organic"],
    }
