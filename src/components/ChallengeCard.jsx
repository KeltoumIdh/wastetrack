import { motion } from 'framer-motion';

export function ChallengeCard({ challenge, joined, onToggle }) {
  const pct = Math.round((challenge.current / challenge.goal) * 100);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-[#1e3a4f] bg-gradient-to-br from-[#0f1e2a] to-[#122030] p-4"
      whileHover={{ y: -2, borderColor: '#00e676' }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.06]" style={{ backgroundColor: challenge.color }} />
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border text-xl"
          style={{
            backgroundColor: `${challenge.color}22`,
            borderColor: `${challenge.color}55`,
          }}
        >
          {challenge.icon}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#e8f5f0]">
            {challenge.title}
          </div>
          <div className="mt-0.5 text-[11px] text-[#8ab0a0]">
            {challenge.desc}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#4a7060]">
            {challenge.current.toLocaleString()} /{' '}
            {challenge.goal.toLocaleString()}
          </span>
          <span
            className="font-mono text-[10px] font-semibold"
            style={{ color: challenge.color }}
          >
            {pct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#1a3040]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg,${challenge.color}99,${challenge.color})`,
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full border px-2 py-[2px] text-[9px] font-mono"
            style={{
              backgroundColor: `${challenge.color}11`,
              borderColor: `${challenge.color}33`,
              color: challenge.color,
            }}
          >
            🎁 {challenge.reward}
          </span>
          <span className="font-mono text-[10px] text-[#4a7060]">
            ⏱ {challenge.deadline}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-full px-3 py-1 text-[10px] font-mono font-semibold tracking-[0.16em] ${
            joined
              ? 'border border-transparent bg-[#00e676] text-[#001a0d]'
              : 'border border-[#1e3a4f] text-[#8ab0a0]'
          }`}
        >
          {joined ? 'Joined' : 'Join'}
        </button>
      </div>
    </motion.div>
  );
}

