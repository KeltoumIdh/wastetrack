import { useState } from 'react';
import { rewards } from '../data/mockData';
import { RewardCard } from '../components/RewardCard';

const BALANCE = 1245;
const CATEGORIES = ['All', 'Shopping', 'Transport', 'Food', 'Utility', 'Telecom'];

export function RewardsScreen() {
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filtered =
    category === 'All'
      ? rewards
      : rewards.filter((r) => r.cat === category);

  return (
    <div className="h-full bg-[#0f1e2a] px-4 pt-3.5 pb-6">
      <div className="mb-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
          Rewards store
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950/60 to-[#0d2a1a] px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
              Your balance
            </div>
            <div className="font-display text-2xl font-extrabold text-[#00e676]">
              {BALANCE.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-[#4a7060]">
              points available
            </div>
          </div>
          <span className="text-3xl">🎁</span>
        </div>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-mono transition ${
              category === cat
                ? 'border-[#00e676] bg-[#00e676] text-[#001a0d]'
                : 'border-[#1a3040] bg-[#0a1420] text-[#4a7060]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            canAfford={BALANCE >= reward.pts}
            isSelected={selectedId === reward.id}
            onSelect={() => setSelectedId(selectedId === reward.id ? null : reward.id)}
          />
        ))}
      </div>
    </div>
  );
}
