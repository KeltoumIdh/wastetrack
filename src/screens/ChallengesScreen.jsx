import { useState } from 'react';
import { challenges } from '../data/mockData';
import { ChallengeCard } from '../components/ChallengeCard';

export function ChallengesScreen() {
  const [joined, setJoined] = useState({ plastic: true, glass: true });

  return (
    <div className="flex flex-col bg-[#0f1e2a] px-4 pb-6 pt-4">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
        Community challenges
      </div>
      <div className="mb-1 text-[18px] font-semibold text-[#e8f5f0]">
        Active Goals
      </div>
      <p className="mb-5 text-[12px] text-[#8ab0a0]">
        Join goals. Earn bonus points. Help the city.
      </p>

      <div className="space-y-3">
        {challenges.map((c) => (
          <ChallengeCard
            key={c.id}
            challenge={c}
            joined={!!joined[c.id]}
            onToggle={() =>
              setJoined((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
            }
          />
        ))}
      </div>
    </div>
  );
}
