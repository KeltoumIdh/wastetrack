import { motion } from 'framer-motion';

const typeBg = {
  reward: '#ffd50022',
  achieve: '#00e67622',
  reminder: '#29b6f622',
  challenge: '#ab47bc22',
  remind: '#ffb30022',
};

export function NotificationItem({ notification, onRead }) {
  return (
    <motion.button
      type="button"
      onClick={() => onRead(notification.id)}
      className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
        notification.read
          ? 'border-[#1a3040] bg-[#0f1e2a]'
          : 'border-emerald-500/70 bg-emerald-500/10'
      }`}
      whileHover={{ y: -1, borderColor: '#1e3a4f' }}
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border text-[18px]"
        style={{
          backgroundColor: typeBg[notification.type] || '#0f1e2a',
          borderColor: '#1e3a4f',
        }}
      >
        {notification.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[13px] font-semibold text-[#e8f5f0]">
          {notification.title}
        </div>
        <div className="truncate text-[11px] text-[#8ab0a0]">
          {notification.msg}
        </div>
        <div className="mt-1 font-mono text-[10px] text-[#4a7060]">
          {notification.time}
        </div>
      </div>
      {!notification.read && (
        <span className="mt-1 h-2 w-2 rounded-full bg-[#00e676]" />
      )}
    </motion.button>
  );
}

