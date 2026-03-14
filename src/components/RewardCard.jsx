import { motion } from 'framer-motion';

export function RewardCard({ reward, canAfford, isSelected, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, borderColor: '#1e3a4f' }}
      style={{
        backgroundColor: '#0f1e2a',
        borderColor: isSelected ? '#00e676' : '#1a3040',
        boxShadow: isSelected ? '0 0 24px rgba(0,230,118,0.35)' : 'none',
        cursor: canAfford ? 'pointer' : 'not-allowed',
        opacity: canAfford ? 1 : 0.5,
      }}
    >
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-xl"
        style={{
          backgroundColor: `${reward.color}22`,
          borderColor: `${reward.color}55`,
        }}
      >
        {reward.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-[#e8f5f0]">
          {reward.name}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full border border-[#1e3a4f] bg-[#0a1420] px-2 py-[2px] text-[9px] font-mono text-[#8ab0a0]">
            {reward.cat}
          </span>
          <span className="font-mono text-[10px] font-semibold text-[#00e676]">
            {reward.pts} pts
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-mono text-[10px] text-[#8ab0a0]">
          {reward.stock === Infinity ? '∞ stock' : `${reward.stock} left`}
        </span>
        <span
          className={`rounded-full px-2 py-[2px] text-[9px] font-mono ${
            canAfford
              ? 'bg-[#00e676] text-[#001a0d]'
              : 'border border-[#1e3a4f] text-[#4a7060]'
          }`}
        >
          {canAfford ? 'Redeem' : 'Locked'}
        </span>
      </div>
    </motion.button>
  );
}

