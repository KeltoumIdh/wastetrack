import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { impactByType } from '../data/mockData';

const metricCards = [
  {
    icon: '🌍',
    label: 'CO₂ saved',
    value: '12.4 kg',
    sub: 'equiv. 3 car trips',
    color: '#00e676',
  },
  {
    icon: '⚡',
    label: 'Energy saved',
    value: '48 kWh',
    sub: '5 days household',
    color: '#ffb300',
  },
  {
    icon: '💧',
    label: 'Water saved',
    value: '320 L',
    sub: '32 bottles',
    color: '#29b6f6',
  },
  {
    icon: '🌳',
    label: 'Trees equivalent',
    value: '0.8',
    sub: 'equivalent trees',
    color: '#00bfa5',
  },
];

export function ImpactScreen() {
  return (
    <div className="h-full bg-[#0f1e2a] px-4 pt-3.5">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
        Environmental impact
      </div>
      <div className="mb-3 text-[11px] text-[#8ab0a0]">
        Based on your 37 recycling actions
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 text-[11px]">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#1a3040] bg-[#0a1420] px-3 py-2.5"
          >
            <div className="mb-1 text-lg">{card.icon}</div>
            <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#4a7060]">
              {card.label}
            </div>
            <div
              className="font-display text-[16px] font-semibold"
              style={{ color: card.color }}
            >
              {card.value}
            </div>
            <div className="mt-0.5 text-[9px] text-[#4a7060]">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-3 rounded-2xl border border-[#1a3040] bg-[#0a1420] p-3">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
          Items recycled by type
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impactByType} barCategoryGap={18}>
              <CartesianGrid stroke="#1a3040" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#4a7060', fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#4a7060', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#050b0e',
                  border: '1px solid #1a3040',
                  borderRadius: 12,
                  fontSize: 11,
                }}
                labelStyle={{ color: '#8ab0a0' }}
              />
              <Bar dataKey="items" radius={[6, 6, 0, 0]}>
                {impactByType.map((entry) => (
                  <Cell key={entry.name} fill={`${entry.color}aa`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

