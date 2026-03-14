import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { historyApi } from '../api/client';
import { useAuth } from '../api/AuthContext';
import { history as mockHistory } from '../data/mockData';

const TYPE_ICONS  = { Plastic: '🧴', Glass: '🫙', Paper: '📄', Organic: '🌿' };
const TYPE_COLORS = { Plastic: '#29b6f6', Glass: '#ab47bc', Paper: '#ffb300', Organic: '#00e676' };

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

export function HistoryScreen() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (user?.user_id && !user.user_id.startsWith('demo')) {
          const data = await historyApi.getDeposits(user.user_id);
          if (!cancelled) setItems(data);
        } else {
          // Demo / no backend — use mock data
          if (!cancelled) setItems(mockHistory.map((h, i) => ({
            id: String(i),
            waste_type: h.type,
            points_earned: h.pts,
            bin_address: h.bin,
            created_at: h.date,
            verified: h.verified,
          })));
        }
      } catch {
        if (!cancelled) setItems(mockHistory.map((h, i) => ({
          id: String(i),
          waste_type: h.type,
          points_earned: h.pts,
          bin_address: h.bin,
          created_at: h.date,
          verified: h.verified,
        })));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  const totalPoints = items.reduce((s, h) => s + (h.points_earned || 0), 0);
  const thisWeek    = items.filter((h) => {
    try { return (Date.now() - new Date(h.created_at).getTime()) < 7 * 86400000; }
    catch { return false; }
  }).length;
  const accuracy = items.length
    ? Math.round((items.filter((h) => h.verified).length / items.length) * 100)
    : 86;

  return (
    <div className="h-full bg-[#0f1e2a] px-4 pt-3.5">
      <div className="mb-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">Recycling history</div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 text-[11px]">
        {[
          { label: 'Total items',  value: items.length,       color: '#00e676' },
          { label: 'Total points', value: `${totalPoints} pts`, color: '#29b6f6' },
          { label: 'This week',    value: `${thisWeek} items`, color: '#00bfa5' },
          { label: 'Accuracy',     value: `${accuracy}%`,     color: '#ffb300' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#1a3040] bg-[#0a1420] px-3 py-2">
            <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#4a7060]">{stat.label}</div>
            <div className="font-display text-[17px] font-semibold" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">All deposits</div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#00e676]" />
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map((entry, idx) => {
            const color = TYPE_COLORS[entry.waste_type] || '#00e676';
            const icon  = TYPE_ICONS[entry.waste_type]  || '♻️';
            return (
              <div key={entry.id || idx} className="flex items-center gap-2 border-b border-[#1a3040] pb-2 pt-1.5 text-[12px]">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border text-[17px]"
                  style={{ backgroundColor: `${color}22`, borderColor: `${color}55` }}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-[#e8f5f0]">{entry.waste_type}</div>
                  <div className="truncate font-mono text-[10px] text-[#4a7060]">{entry.bin_address}</div>
                  <div className="text-[10px] text-[#4a7060]">{formatDate(entry.created_at)}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-[14px] font-semibold text-[#00e676]">+{entry.points_earned}</div>
                  <div className={`font-mono text-[9px] ${entry.verified ? 'text-[#00e676]' : 'text-[#ff5252]'}`}>
                    {entry.verified ? '✓ verified' : '✗ rejected'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
