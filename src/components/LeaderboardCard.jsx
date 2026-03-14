import { motion } from 'framer-motion';

export function LeaderboardCard({ entry }) {
  const isYou = entry.you;
  return (
    <motion.div
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-[12px] ${
        isYou
          ? 'border-emerald-500/60 bg-emerald-500/10'
          : 'border-[#1a3040] bg-[#0f1e2a]'
      }`}
      whileHover={{ y: -2, borderColor: '#1e3a4f' }}
    >
      <div className="w-6 text-center font-mono text-[11px] text-[#4a7060]">
        #{entry.rank}
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e3a4f] text-xs font-bold text-[#e8f5f0]">
        {entry.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={`truncate text-[12px] font-semibold ${
              isYou ? 'text-[#00e676]' : 'text-[#e8f5f0]'
            }`}
          >
            {entry.name}
          </span>
          {isYou && (
            <span className="rounded-full bg-[#00e676] px-1.5 py-[1px] text-[9px] font-mono text-[#001a0d]">
              YOU
            </span>
          )}
        </div>
        <div className="font-mono text-[10px] text-[#4a7060]">
          {entry.items} items · {entry.city}
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-[14px] font-semibold text-[#e8f5f0]">
          {entry.pts}
        </div>
        <div className="font-mono text-[9px] text-[#4a7060]">pts</div>
      </div>
    </motion.div>
  );
}

