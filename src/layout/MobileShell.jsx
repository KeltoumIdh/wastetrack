import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneFrame } from './PhoneFrame';
import { BottomNav } from './BottomNav';
import {
  Home, Camera, History, Activity, Gift,
  Trophy, Target, Bell, MapPin, CheckCircle2,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/app',              label: 'Home',          icon: Home,    end: true },
  { to: '/app/scan',         label: 'Scan',          icon: Camera },
  { to: '/app/history',      label: 'History',       icon: History },
  { to: '/app/impact',       label: 'Impact',        icon: Activity },
  { to: '/app/rewards',      label: 'Rewards',       icon: Gift },
  { to: '/app/leaderboard',  label: 'Leaderboard',   icon: Trophy },
  { to: '/app/challenges',   label: 'Challenges',    icon: Target },
  { to: '/app/notifications',label: 'Notifications', icon: Bell, badge: 2 },
  { to: '/app/map',          label: 'Map',           icon: MapPin },
];

export function MobileShell() {
  const location = useLocation();

  return (
    <div className="flex h-full overflow-hidden bg-[#050b0e] text-[#e8f5f0]">
      {/* Left sidebar */}
      <aside className="hidden w-56 flex-col border-r border-[#1a3040] bg-[#0a1420] md:flex">
        <div className="flex items-center gap-3 border-b border-[#1a3040] px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00e676] font-display text-base font-extrabold text-[#001a0d]">
            ♺
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-[#e8f5f0]">WasteTrack</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#4a7060]">Citizen App</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a7060]">
            Navigation
          </div>
          {sidebarLinks.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] transition-colors',
                  isActive
                    ? 'border border-[#00e67622] bg-[#00e67611] text-[#00e676]'
                    : 'text-[#8ab0a0] hover:bg-[#0f1e2a] hover:text-[#e8f5f0]',
                ].join(' ')
              }
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="rounded-full bg-[#00e676] px-1.5 py-[1px] font-mono text-[8px] text-[#001a0d]">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#1a3040] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#00e676] font-display text-xs font-extrabold text-[#001a0d]">
              S
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#e8f5f0]">Sara M.</div>
              <div className="font-mono text-[9px] text-[#00e676]">1,245 pts</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Center: phone frame */}
      <main className="flex flex-1 items-center justify-center bg-[#050b0e] px-4 py-4">
        <PhoneFrame title="WasteTrack" bottomNav={<BottomNav />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.21, 0.6, 0.35, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </PhoneFrame>
      </main>

      {/* Right info panel */}
      <aside className="hidden w-64 flex-col border-l border-[#1a3040] bg-[#0a1420] px-4 py-4 xl:flex">
        <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#4a7060]">
          Live status
        </div>
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-[#1a3040] bg-[#0f1e2a] px-3 py-2.5">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e676] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e676]" />
            </span>
            <span className="font-mono text-[11px] text-[#8ab0a0]">1,245 pts · 37 items</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#1a3040] bg-[#0f1e2a] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#00e676]" />
              <span className="font-mono text-[11px] text-[#8ab0a0]">3 bins within 250m</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#1a3040] bg-[#0f1e2a] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#29b6f6]" />
              <span className="font-mono text-[11px] text-[#8ab0a0]">Last deposit verified</span>
            </div>
            <span className="font-mono text-[10px] text-[#4a7060]">2m ago</span>
          </div>
        </div>

        <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#4a7060]">
          Platform
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Mode', value: 'Citizen App', color: '#e8f5f0' },
            { label: 'Theme', value: 'Dark Eco', color: '#00e676' },
            { label: 'Screens', value: '9 screens', color: '#29b6f6' },
            { label: 'Stack', value: 'React + Vite', color: '#ffb300' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[#1a3040] bg-[#0f1e2a] p-2.5">
              <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#4a7060]">
                {item.label}
              </div>
              <div className="font-display text-[11px] font-semibold" style={{ color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
