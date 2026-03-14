import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

export function BinDetails({ bin, onClose }) {
  if (!bin) return null;

  const capacityColor =
    bin.capacity > 80 ? '#ff5252' : bin.capacity > 60 ? '#ffb300' : '#00e676';

  return (
    <motion.div
      className="border-t border-[#1a3040] bg-[#0a1420] px-4 pb-3 pt-3.5"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-2 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border text-lg"
          style={{
            backgroundColor: `${bin.color}22`,
            borderColor: `${bin.color}55`,
          }}
        >
          {bin.icon}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#e8f5f0]">
            Bin #{bin.id} · {bin.type}
          </div>
          <div className="font-mono text-[10px] text-[#4a7060]">
            {bin.addr}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full border border-transparent px-2 py-0.5 text-[10px] text-[#4a7060] hover:border-[#1e3a4f]"
          >
            Close
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#0f1e2a] px-3 py-2">
          <div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
            Distance
          </div>
          <div className="font-display text-[16px] font-semibold text-[#e8f5f0]">
            {bin.dist}
          </div>
        </div>
        <div className="rounded-xl bg-[#0f1e2a] px-3 py-2">
          <div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
            Capacity
          </div>
          <div
            className="font-display text-[16px] font-semibold"
            style={{ color: capacityColor }}
          >
            {bin.capacity}%
          </div>
        </div>
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e676] px-4 py-2.5 text-[12px] font-mono font-semibold uppercase tracking-[0.16em] text-[#001a0d] shadow-[0_0_18px_rgba(0,230,118,0.45)] transition hover:bg-[#00c853]">
        <Navigation className="h-4 w-4" />
        Navigate to bin
      </button>
    </motion.div>
  );
}

