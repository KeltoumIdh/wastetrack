import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScanLine } from 'lucide-react';
import { wasteTypes, history as mockHistory } from '../data/mockData';
import { useAuth } from '../api/AuthContext';

export function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name    = user?.name    || 'Sara Moussaoui';
  const points  = user?.points  ?? 1240;
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const madValue = Math.round(points * 0.1);

  return (
    <div className="flex flex-col bg-[#0f1e2a] pb-4">
      {/* Header */}
      <div className="px-4 pb-2 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
              Good morning
            </p>
            <h2 className="text-[17px] font-semibold text-[#e8f5f0]">
              {name}
            </h2>
          </div>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#00e67644] bg-[#00e67622] font-display text-[13px] font-bold text-[#00e676]">
            {initials}
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5252] text-[8px] font-mono text-white">
              3
            </span>
          </div>
        </div>

        {/* Points card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-[#00e67633] p-5"
          style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#00e676] opacity-10" />
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4ade80]">
            Your balance
          </p>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-white">
              {points.toLocaleString()}
            </span>
            <span className="text-sm text-[#4ade80]">pts</span>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full border border-[#22c55e33] bg-[#052e1644] px-2.5 py-1 text-[11px] text-[#22c55e]">
              ≈ {madValue} MAD value
            </span>
            <span className="rounded-full border border-[#ffffff11] bg-[#ffffff11] px-2.5 py-1 text-[11px] text-[#ccc]">
              Rank #42 🏆
            </span>
          </div>
        </motion.div>
      </div>

      {/* QR Scan CTA */}
      <div className="px-4 pb-4 pt-3">
        <motion.button
          type="button"
          onClick={() => navigate('/app/scan')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00e676] py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#001a0d] shadow-[0_0_24px_rgba(0,230,118,0.45)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ScanLine className="h-5 w-5" />
          Scan bin QR code
        </motion.button>
      </div>

      {/* Waste types grid */}
      <div className="px-4 pb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
          Points per item
        </p>
        <div className="grid grid-cols-2 gap-2">
          {wasteTypes.map((w, i) => (
            <motion.div
              key={w.type}
              className="flex items-center gap-3 rounded-xl border border-[#1a3040] bg-[#0a1420] p-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: `${w.color}22` }}
              >
                {w.icon}
              </div>
              <div>
                <p className="text-[11px] text-[#8ab0a0]">{w.type}</p>
                <p className="font-display text-[15px] font-bold text-[#e8f5f0]">
                  +{w.pts} pts
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent deposits */}
      <div className="px-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
          Recent deposits
        </p>
        {mockHistory.slice(0, 4).map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[#1a3040] py-2.5"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: entry.color,
                  boxShadow: `0 0 6px ${entry.color}`,
                }}
              />
              <div>
                <p className="text-[12px] text-[#e8f5f0]">{entry.type}</p>
                <p className="font-mono text-[10px] text-[#4a7060]">
                  {entry.date}
                </p>
              </div>
            </div>
            <span className="font-display text-[13px] font-bold text-[#00e676]">
              +{entry.pts} pts
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={() => navigate('/app/history')}
          className="mt-2 w-full py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060] transition hover:text-[#00e676]"
        >
          View full history →
        </button>
      </div>
    </div>
  );
}
