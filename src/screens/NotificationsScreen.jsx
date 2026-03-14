import { useState } from 'react';
import { notifications as initialNotifs } from '../data/mockData';
import { NotificationItem } from '../components/NotificationItem';

export function NotificationsScreen() {
  const [items, setItems] = useState(initialNotifs);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex flex-col bg-[#0f1e2a] px-4 pb-6 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
            Notifications
          </div>
          {unread > 0 && (
            <span className="rounded-full border border-[#00e67633] bg-[#00e67611] px-2.5 py-0.5 font-mono text-[10px] text-[#00e676]">
              {unread} new
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={markAll}
          className="font-mono text-[10px] text-[#4a7060] transition hover:text-[#8ab0a0]"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {items.map((n) => (
          <NotificationItem key={n.id} notification={n} onRead={markRead} />
        ))}
      </div>
    </div>
  );
}
