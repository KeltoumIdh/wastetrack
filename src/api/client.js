/**
 * WasteTrack API client
 * All calls go to the FastAPI backend at VITE_API_URL
 * Falls back to mock data if backend is not running
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────

export const authApi = {
  register: (name, email, password, city = 'Rabat') =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, city }),
    }),

  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ── Scan ──────────────────────────────────────────────────────

export const scanApi = {
  /**
   * Send a photo File/Blob to the AI endpoint.
   * Returns { waste_type, detected_object, confidence, points_earned, tip }
   */
  classifyWaste: async (imageFile) => {
    const form = new FormData();
    form.append('photo', imageFile);
    const res = await fetch(`${BASE}/api/scan`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('AI scan failed');
    return res.json();
  },

  saveDeposit: (userId, wasteType, confidence, pointsEarned, binId = 34) =>
    request('/api/deposits', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        bin_id: binId,
        waste_type: wasteType,
        confidence,
        points_earned: pointsEarned,
      }),
    }),
};

// ── History ───────────────────────────────────────────────────

export const historyApi = {
  getDeposits: (userId) => request(`/api/deposits/${userId}`),
};

// ── User ──────────────────────────────────────────────────────

export const userApi = {
  getProfile: (userId) => request(`/api/users/${userId}`),
};

// ── Leaderboard ───────────────────────────────────────────────

export const leaderboardApi = {
  getTop: (currentUserId = '') =>
    request(`/api/leaderboard?current_user_id=${currentUserId}`),
};

// ── Analytics ─────────────────────────────────────────────────

export const analyticsApi = {
  getSummary: () => request('/api/analytics'),
};
