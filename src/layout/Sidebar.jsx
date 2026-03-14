import { NavLink } from 'react-router-dom';
import { BarChart3, LayoutDashboard, Trash2, MapPin } from 'lucide-react';

const navItems = [
  { to: '/muni/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/muni/bins',      icon: Trash2,          label: 'Bin Monitor' },
  { to: '/muni/map',       icon: MapPin,           label: 'Zones Map' },
  { to: '/muni/analytics', icon: BarChart3,        label: 'Analytics', disabled: true },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[#1a3040] bg-[#0a1420]">
      <div className="flex items-center gap-3 border-b border-[#1a3040] px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#29b6f6] font-display text-lg font-extrabold text-[#001a2a]">
          ⊞
        </div>
        <div>
          <div className="font-display text-sm font-semibold text-[#e8f5f0]">
            WasteTrack
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
            Municipality
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
          Management
        </div>
        {navItems.map(({ to, icon: Icon, label, disabled }) =>
          disabled ? (
            <div
              key={to}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] text-[#4a7060] opacity-50"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span className="ml-auto rounded-full border border-[#1a3040] px-1.5 py-0.5 font-mono text-[8px] text-[#4a7060]">
                Soon
              </span>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] transition-colors',
                  isActive
                    ? 'border border-[#00e67633] bg-[#00e67611] text-[#00e676]'
                    : 'text-[#8ab0a0] hover:bg-[#0f1e2a] hover:text-[#e8f5f0]',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="border-t border-[#1a3040] px-4 py-4">
        <div className="rounded-xl border border-[#00e67622] bg-[#00e67611] px-3 py-2.5">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
            System status
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#00e676]">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e676] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e676]" />
            </span>
            All systems live
          </div>
        </div>
      </div>
    </aside>
  );
}
