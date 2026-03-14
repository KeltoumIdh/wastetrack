import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie,
} from 'recharts';
import { wasteTypes, zones, heatmap, liveActivities, monthlyDeposits } from '../data/mockData';

const HEAT_COLOR = (v) => {
  if (v <= 2) return '#0d1117';
  if (v <= 4) return '#052e1644';
  if (v <= 6) return '#14532d88';
  if (v <= 8) return '#15803d';
  return '#22c55e';
};

const KPIS = [
  { label: 'Total Deposits', value: '1,180', sub: '+12% MoM',       color: '#00e676', icon: '♻️' },
  { label: 'Active Citizens', value: '1,200', sub: '+8% this week',  color: '#29b6f6', icon: '👥' },
  { label: 'Sort Accuracy',   value: '92%',   sub: '−1% vs prev.',   color: '#ab47bc', icon: '🎯' },
  { label: 'Bins Deployed',   value: '48',    sub: '6 zones',        color: '#ffb300', icon: '🗑️' },
  { label: 'CO₂ Avoided',     value: '350 kg', sub: 'from organic',  color: '#00bfa5', icon: '🌍' },
];

const TRACEABILITY = [
  { label: 'Organic collected', val: '500 kg', icon: '🌿', color: '#00e676' },
  { label: 'Biogas produced',   val: '120 m³', icon: '⚡', color: '#ffb300' },
  { label: 'CO₂ avoided',       val: '350 kg', icon: '🌍', color: '#29b6f6' },
  { label: 'Carbon credits',    val: '3.5 t',  icon: '🏅', color: '#ab47bc' },
];

const CHAIN = ['Citizen deposit', 'AI verify', 'Database', 'Collection', 'Recycling', 'Carbon credit'];

const PIE_DATA = [
  { name: 'Plastic', value: 38, color: '#29b6f6' },
  { name: 'Glass',   value: 22, color: '#ab47bc' },
  { name: 'Paper',   value: 28, color: '#ffb300' },
  { name: 'Organic', value: 12, color: '#00e676' },
];

const total = wasteTypes.reduce((a, w) => a + w.count, 0);

export function Dashboard() {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div className="min-h-full overflow-y-auto bg-[#050b0e] p-6 text-[#e8f5f0]">
      {/* Header */}
      <motion.div
        className="mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
            Layer 2 — Municipality
          </p>
          <h2 className="font-display text-2xl font-bold text-[#e8f5f0]">
            Rabat City Analytics
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-[#00e67633] bg-[#00e67611] px-3 py-1 font-mono text-[11px] text-[#00e676]">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e676] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e676]" />
            </span>
            Live — March 2025
          </span>
          <div className="rounded-xl border border-[#1a3040] bg-[#0a1420] px-3 py-1.5 font-mono text-[11px] text-[#4a7060]">
            March 2025
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-5 gap-3">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-4 transition hover:-translate-y-0.5 hover:border-[#1e3a4f]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
                {k.label}
              </p>
              <span className="text-lg">{k.icon}</span>
            </div>
            <p className="font-display text-2xl font-bold" style={{ color: k.color }}>
              {k.value}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[#4a7060]">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Monthly chart + Waste breakdown + Donut */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        {/* Monthly deposits bar chart */}
        <div className="col-span-2 rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Monthly deposits
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDeposits} barCategoryGap={6}>
                <CartesianGrid stroke="#1a3040" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#4a7060', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#4a7060', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050b0e', border: '1px solid #1a3040', borderRadius: 10, fontSize: 11 }}
                  labelStyle={{ color: '#8ab0a0' }}
                />
                <Bar dataKey="deposits" radius={[4, 4, 0, 0]}>
                  {monthlyDeposits.map((_, idx) => (
                    <Cell key={idx} fill={idx === 11 ? '#00e676' : idx > 8 ? '#004d25' : '#1a3040'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut */}
        <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Waste distribution
          </p>
          <div className="flex justify-center">
            <div className="relative h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={56} dataKey="value" strokeWidth={0}>
                    {PIE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-lg font-bold text-[#e8f5f0]">1180</span>
                <span className="font-mono text-[9px] text-[#4a7060]">TOTAL</span>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {PIE_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] text-[#8ab0a0]">{d.name}</span>
                <span className="ml-auto font-mono text-[10px]" style={{ color: d.color }}>
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Waste breakdown + Heatmap + Sorting accuracy */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        {/* Waste type breakdown */}
        <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Waste type breakdown
          </p>
          <div className="space-y-3">
            {wasteTypes.map((w) => (
              <div key={w.type}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 text-[#8ab0a0]">
                    {w.icon} {w.type}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[#4a7060]">
                    <span className="rounded-full border border-[#00e67633] bg-[#00e67611] px-1.5 py-[1px] text-[9px] text-[#00e676]">
                      {w.trend}
                    </span>
                    {w.count}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#1a3040]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: w.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((w.count / total) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Activity heatmap — Rabat
          </p>
          <div className="flex flex-col gap-1.5">
            {heatmap.map((row, ri) => (
              <div key={ri} className="flex gap-1.5">
                {row.map((val, ci) => (
                  <div
                    key={ci}
                    className="flex-1 rounded-md border border-[#1a3040] transition hover:scale-110"
                    style={{ height: 32, backgroundColor: HEAT_COLOR(val) }}
                    title={`Activity: ${val}/9`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#4a7060]">Low</span>
            {[2, 4, 6, 8, 9].map((v) => (
              <div key={v} className="h-3 w-5 rounded" style={{ backgroundColor: HEAT_COLOR(v) }} />
            ))}
            <span className="font-mono text-[9px] text-[#4a7060]">High</span>
          </div>
        </div>

        {/* Sorting accuracy donut + zone list */}
        <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Zone activity
          </p>
          <div className="space-y-2">
            {zones.map((z) => (
              <button
                key={z.name}
                type="button"
                onClick={() => setSelectedZone(z)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-[#0f1e2a]"
              >
                <div>
                  <p className="text-[12px] text-[#e8f5f0]">{z.name}</p>
                  <p className="font-mono text-[10px] text-[#4a7060]">{z.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#1a3040]">
                    <div
                      className="h-full rounded-full bg-[#00e676]"
                      style={{ width: `${z.value}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#4a7060]">{z.value}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Live feed + Traceability */}
      <div className="grid grid-cols-2 gap-4">
        {/* Live deposit feed */}
        <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Live deposit feed
          </p>
          <div className="space-y-3">
            {liveActivities.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00e67622] font-mono text-[11px] font-bold text-[#00e676]">
                    {a.user[0]}
                  </div>
                  <div>
                    <p className="text-[11px] text-[#e8f5f0]">{a.action}</p>
                    <p className="font-mono text-[10px] text-[#4a7060]">
                      {a.user} · {a.time}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#00e676]">
                  {a.pts}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3 — Traceability */}
        <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
            Layer 3 — Traceability
          </p>
          <div className="mb-4 space-y-2">
            {TRACEABILITY.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-xl bg-[#0f1e2a] px-3 py-2"
              >
                <span className="flex items-center gap-2 text-[11px] text-[#8ab0a0]">
                  {r.icon} {r.label}
                </span>
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{ color: r.color }}
                >
                  {r.val}
                </span>
              </div>
            ))}
          </div>

          {/* Waste chain */}
          <div className="rounded-xl border border-[#ab47bc33] bg-[#ab47bc11] p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ab47bc]">
              Waste chain
            </p>
            <div className="flex flex-wrap items-center gap-1">
              {CHAIN.map((s, i) => (
                <span key={s} className="flex items-center gap-1">
                  <span className="rounded bg-[#0f1e2a] px-2 py-0.5 font-mono text-[9px] text-[#e8f5f0]">
                    {s}
                  </span>
                  {i < CHAIN.length - 1 && (
                    <span className="text-[#ab47bc] text-[10px]">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zone modal */}
      {selectedZone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedZone(null)}
        >
          <motion.div
            className="mx-4 w-full max-w-xs rounded-2xl border border-[#1e3a4f] bg-[#0a1420] p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-1 text-[17px] font-bold text-[#e8f5f0]">
              {selectedZone.name}
            </h4>
            <span className="mb-4 inline-block rounded-full border border-[#29b6f633] bg-[#29b6f611] px-2.5 py-0.5 font-mono text-[10px] text-[#29b6f6]">
              Primary: {selectedZone.type}
            </span>
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#8ab0a0]">Activity index</span>
                <span className="font-mono text-[#e8f5f0]">{selectedZone.value}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab0a0]">Trucks needed</span>
                <span className="font-mono text-[#e8f5f0]">{Math.ceil(selectedZone.value / 30)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab0a0]">Status</span>
                <span className="rounded-full border border-[#00e67633] bg-[#00e67611] px-2 py-0.5 font-mono text-[10px] text-[#00e676]">
                  Active
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedZone(null)}
              className="mt-5 w-full rounded-xl bg-[#0f1e2a] py-2 font-mono text-[12px] text-[#8ab0a0]"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
