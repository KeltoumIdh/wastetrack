import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

// Layouts
import { MobileShell } from './layout/MobileShell';
import { MuniShell }   from './layout/MuniShell';

// Auth
import { AuthScreen } from './screens/AuthScreen';
import { useAuth }    from './api/AuthContext';

// Citizen screens
import { HomeScreen }          from './screens/HomeScreen';
import { ScanScreen }          from './screens/ScanScreen';
import { HistoryScreen }       from './screens/HistoryScreen';
import { ImpactScreen }        from './screens/ImpactScreen';
import { RewardsScreen }       from './screens/RewardsScreen';
import { LeaderboardScreen }   from './screens/LeaderboardScreen';
import { ChallengesScreen }    from './screens/ChallengesScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { MapScreen }           from './screens/MapScreen';

// Municipality screens
import { Dashboard }  from './municipality/Dashboard';
import { BinMonitor } from './municipality/BinMonitor';
import { ZonesMap }   from './municipality/ZonesMap';

function TopBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const isMuni    = location.pathname.startsWith('/muni');
  const isAuth    = location.pathname === '/auth';

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#1a3040] bg-[#0a1420]/90 px-5 py-2.5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00e676] font-display text-base font-bold text-[#001a0d]">
          ♺
        </div>
        <div>
          <span className="font-display text-[15px] font-bold text-[#e8f5f0]">WasteTrack</span>
          <span className="ml-2 font-mono text-[10px] text-[#4a7060]">Smart Recycling Platform</span>
        </div>
      </div>

      {/* Mode switcher — hide on auth page */}
      {!isAuth && (
        <div className="flex gap-1 rounded-xl border border-[#1a3040] bg-[#0f1e2a] p-1">
          {[
            { label: 'Citizen App 📱',    path: '/app' },
            { label: 'Municipality 🏛️', path: '/muni/dashboard' },
          ].map(({ label, path }) => {
            const active = path.startsWith('/muni') ? isMuni : !isMuni;
            return (
              <button key={path} type="button" onClick={() => navigate(path)}
                className={`rounded-lg px-4 py-1.5 font-mono text-[11px] transition-all ${
                  active ? 'bg-[#00e676] font-semibold text-[#001a0d]' : 'text-[#4a7060] hover:text-[#8ab0a0]'
                }`}>
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-[#00e67633] bg-[#00e67611] px-2.5 py-1 font-mono text-[10px] text-[#00e676]">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e676] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00e676]" />
          </span>
          {user ? user.name.split(' ')[0] : 'Live demo'}
        </span>
        {user && !isAuth && (
          <button type="button" onClick={handleLogout}
            className="flex items-center gap-1 rounded-lg border border-[#1a3040] px-2 py-1 font-mono text-[10px] text-[#4a7060] transition hover:border-[#ff5252] hover:text-[#ff5252]">
            <LogOut className="h-3 w-3" /> Out
          </button>
        )}
      </div>
    </header>
  );
}

function AppShell({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#050b0e]">
      <TopBar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

// Guard: redirect to /auth if not logged in
function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        {/* Auth */}
        <Route path="/auth" element={<AuthScreen />} />

        {/* Citizen app */}
        <Route path="/app" element={<RequireAuth><MobileShell /></RequireAuth>}>
          <Route index element={<HomeScreen />} />
          <Route path="scan"          element={<ScanScreen />} />
          <Route path="history"       element={<HistoryScreen />} />
          <Route path="impact"        element={<ImpactScreen />} />
          <Route path="rewards"       element={<RewardsScreen />} />
          <Route path="leaderboard"   element={<LeaderboardScreen />} />
          <Route path="challenges"    element={<ChallengesScreen />} />
          <Route path="notifications" element={<NotificationsScreen />} />
          <Route path="map"           element={<MapScreen />} />
        </Route>

        {/* Municipality portal */}
        <Route path="/muni" element={<RequireAuth><MuniShell /></RequireAuth>}>
          <Route index element={<Navigate to="/muni/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bins"      element={<BinMonitor />} />
          <Route path="map"       element={<ZonesMap />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AppShell>
  );
}
