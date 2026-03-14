import { motion } from 'framer-motion';
import { leaderboard } from '../data/mockData';

const MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_HEIGHTS = [80, 100, 68]; // silver, gold, bronze display order
const PODIUM_ORDER = [1, 0, 2]; // indices into leaderboard for [left, center, right]

export function LeaderboardScreen() {
  const podium = PODIUM_ORDER.map((i) => leaderboard[i]);

  return (
    <div className="flex flex-col bg-[#0f1e2a] px-4 pt-4 pb-6">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
        Community
      </div>
      <div className="mb-5 text-[18px] font-semibold text-[#e8f5f0]">
        Leaderboard
      </div>

      {/* Podium top-3 */}
      <div className="mb-5 flex items-end justify-center gap-3 px-2">
        {podium.map((user, i) => {
          const colors = ['#c0c0c0', '#ffd700', '#cd7f32'];
          const color = colors[i];
          const height = PODIUM_HEIGHTS[i];
          return (
            <motion.div
              key={user.name}
              className="flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="mb-1 font-mono text-[10px] text-[#8ab0a0]">
                {user.name.split(' ')[0]}
              </p>
              <p
                className="mb-1.5 font-mono text-[10px] font-semibold"
                style={{ color: user.you ? '#00e676' : '#8ab0a0' }}
              >
                {user.pts.toLocaleString()} pts
              </p>
              <div
                className="flex w-full items-start justify-center rounded-t-xl border-2 pt-2 text-2xl"
                style={{
                  height,
                  backgroundColor: `${color}22`,
                  borderColor: `${color}66`,
                }}
              >
                {MEDALS[PODIUM_ORDER[i]]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full ranked list */}
      <div className="space-y-2">
        {leaderboard.map((user, i) => (
          <motion.div
            key={user.name}
            className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 ${
              user.you
                ? 'border-[#00e67655] bg-[#00e67611]'
                : 'border-[#1a3040] bg-[#0a1420]'
            }`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            whileHover={{ y: -1 }}
          >
            <div className="w-6 text-center font-mono text-[11px] text-[#4a7060]">
              #{user.rank}
            </div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                user.you ? 'bg-[#00e676] text-[#001a0d]' : 'bg-[#1e3a4f] text-[#e8f5f0]'
              }`}
            >
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[13px] font-semibold ${
                    user.you ? 'text-[#00e676]' : 'text-[#e8f5f0]'
                  }`}
                >
                  {user.name}
                </span>
                {user.you && (
                  <span className="rounded-full bg-[#00e676] px-1.5 py-[1px] font-mono text-[9px] text-[#001a0d]">
                    YOU
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] text-[#4a7060]">
                {user.items} items · {user.city}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-[14px] font-semibold text-[#e8f5f0]">
                {user.pts.toLocaleString()}
              </div>
              <div className="font-mono text-[9px] text-[#4a7060]">pts</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
