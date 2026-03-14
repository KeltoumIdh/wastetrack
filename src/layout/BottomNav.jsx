import { NavLink } from 'react-router-dom';
import { Home, Camera, History, Activity, Gift } from 'lucide-react';

const tabs = [
  { to: '/app',         label: 'Home',    icon: Home    },
  { to: '/app/scan',    label: 'Scan',    icon: Camera  },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/impact',  label: 'Impact',  icon: Activity},
  { to: '/app/rewards', label: 'Rewards', icon: Gift    },
];

export function BottomNav() {
  return (
    <nav className="flex border-t border-[#1a3040] bg-[#0a1420]">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app'}
          className={({ isActive }) =>
            [
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[9px] font-mono tracking-[0.14em] uppercase transition-colors',
              isActive ? 'text-[#00e676]' : 'text-[#4a7060]',
            ].join(' ')
          }
        >
          <Icon className="h-4 w-4" strokeWidth={1.6} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
