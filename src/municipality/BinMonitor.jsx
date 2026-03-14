import { useState } from 'react';
import { motion } from 'framer-motion';
import { binStatus } from '../data/mockData';

const STATUS_COLOR = {
  FULL: '#ff5252',
  HIGH: '#ffb300',
  LOW: '#29b6f6',
  OK: '#00e676',
};

const CAP_COLOR = (c) =>
  c >= 90 ? '#ff5252' : c >= 70 ? '#ffb300' : c >= 50 ? '#29b6f6' : '#00e676';

const FILTERS = ['All', 'Plastic', 'Glass', 'Paper', 'Organic'];

export function BinMonitor() {
  const [filter, setFilter] = useState('All');

  const visible =
    filter === 'All' ? binStatus : binStatus.filter((b) => b.type === filter);

  const full = binStatus.filter((b) => b.status === 'FULL').length;
  const high = binStatus.filter((b) => b.status === 'HIGH').length;
  const avg = Math.round(binStatus.reduce((s, b) => s + b.capacity, 0) / binStatus.length);

  return (
    <div className="min-h-full bg-[#050b0e] p-6 text-[#e8f5f0]">
      {/* Header */}
      <motion.div
        className="mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
            Real-time monitoring
          </p>
          <h2 className="font-display text-2xl font-bold text-[#e8f5f0]">
            Bin Status Panel
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {full > 0 && (
            <span className="rounded-full border border-[#ff525233] bg-[#ff525211] px-3 py-1 font-mono text-[11px] text-[#ff5252]">
              ● {full} FULL
            </span>
          )}
          {high > 0 && (
            <span className="rounded-full border border-[#ffb30033] bg-[#ffb30011] px-3 py-1 font-mono text-[11px] text-[#ffb300]">
              ● {high} HIGH
            </span>
          )}
          <span className="rounded-full border border-[#00e67633] bg-[#00e67611] px-3 py-1 font-mono text-[11px] text-[#00e676]">
            ● {binStatus.length - full - high} Normal
          </span>
        </div>
      </motion.div>

      {/* Summary KPIs */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { label: 'Total bins',   value: '48',    color: '#e8f5f0' },
          { label: 'Full bins',    value: `${full}`, color: '#ff5252' },
          { label: 'Avg capacity', value: `${avg}%`, color: '#ffb300' },
          { label: 'Last sync',    value: '2m ago', color: '#00e676' },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
              {k.label}
            </p>
            <p className="font-display text-2xl font-bold" style={{ color: k.color }}>
              {k.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xl border px-4 py-1.5 font-mono text-[11px] transition ${
              filter === f
                ? 'border-[#00e676] bg-[#00e67611] text-[#00e676]'
                : 'border-[#1e3a4f] text-[#4a7060] hover:border-[#1e3a4f] hover:text-[#8ab0a0]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bin rows */}
      <div className="space-y-3">
        {visible.map((bin, i) => (
          <motion.div
            key={bin.id}
            className="flex items-center gap-4 rounded-2xl border border-[#1a3040] bg-[#0a1420] px-4 py-3.5 transition hover:border-[#1e3a4f]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Icon */}
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-xl"
              style={{
                backgroundColor: `${bin.color}22`,
                borderColor: `${bin.color}55`,
              }}
            >
              {bin.icon}
            </div>

            {/* Name + location */}
            <div className="w-44 flex-shrink-0">
              <p className="text-[13px] font-semibold text-[#e8f5f0]">
                Bin #{bin.id} — {bin.type}
              </p>
              <p className="font-mono text-[10px] text-[#4a7060]">{bin.loc}</p>
            </div>

            {/* Capacity bar */}
            <div className="flex-1 px-4">
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="text-[#4a7060]">Capacity</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: CAP_COLOR(bin.capacity) }}
                >
                  {bin.capacity}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#1a3040]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: CAP_COLOR(bin.capacity) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${bin.capacity}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Deposits */}
            <div className="w-20 flex-shrink-0 text-center">
              <p className="font-display text-[16px] font-bold text-[#e8f5f0]">
                {bin.deposits}
              </p>
              <p className="font-mono text-[9px] text-[#4a7060]">deposits</p>
            </div>

            {/* Status badge */}
            <div className="w-24 flex-shrink-0 text-center">
              <span
                className="rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
                style={{
                  backgroundColor: `${STATUS_COLOR[bin.status]}22`,
                  borderColor: `${STATUS_COLOR[bin.status]}44`,
                  color: STATUS_COLOR[bin.status],
                }}
              >
                ● {bin.status === 'OK' ? 'Normal' : bin.status}
              </span>
              <p className="mt-1 font-mono text-[9px] text-[#4a7060]">
                sync {bin.lastSync}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#1e3a4f] px-3 py-1.5 font-mono text-[11px] text-[#8ab0a0] transition hover:border-[#00e676] hover:text-[#00e676]"
              >
                Details
              </button>
              {bin.status === 'FULL' && (
                <button
                  type="button"
                  className="rounded-xl bg-[#00e676] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#001a0d]"
                >
                  🚛 Dispatch
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
