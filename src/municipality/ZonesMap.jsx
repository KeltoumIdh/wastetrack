import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bins, binStatus, zones } from '../data/mockData';
import { X, Navigation, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const STATUS_COLOR = { FULL: '#ff5252', HIGH: '#ffb300', LOW: '#29b6f6', OK: '#00e676' };
const STATUS_LABEL = { FULL: 'Full', HIGH: 'High', LOW: 'Low', OK: 'Normal' };

const CAP_COLOR = (c) =>
  c >= 90 ? '#ff5252' : c >= 70 ? '#ffb300' : c >= 50 ? '#29b6f6' : '#00e676';

// Spread bins across a wider map canvas for the desktop view
const MAP_BINS = [
  { id: 34, type: 'Plastic', icon: '🧴', color: '#29b6f6', x: '18%', y: '32%', dist: '120m', addr: 'Agdal, Rue Lumumba',     capacity: 45, status: 'OK',   deposits: 450 },
  { id: 12, type: 'Glass',   icon: '🫙', color: '#ab47bc', x: '38%', y: '20%', dist: '280m', addr: 'Hassan, Ave Hassan II',   capacity: 78, status: 'HIGH', deposits: 210 },
  { id: 8,  type: 'Paper',   icon: '📄', color: '#ffb300', x: '60%', y: '42%', dist: '430m', addr: 'Hay Riad, Blvd Zerktouni',capacity: 93, status: 'FULL', deposits: 330 },
  { id: 21, type: 'Organic', icon: '🌿', color: '#00e676', x: '28%', y: '62%', dist: '190m', addr: 'Souissi, Rue de la Paix', capacity: 32, status: 'OK',   deposits: 190 },
  { id: 5,  type: 'Plastic', icon: '🧴', color: '#29b6f6', x: '72%', y: '25%', dist: '610m', addr: 'Akkari, Rue Tariq',       capacity: 12, status: 'LOW',  deposits: 88  },
  { id: 7,  type: 'Glass',   icon: '🫙', color: '#ab47bc', x: '14%', y: '70%', dist: '350m', addr: 'Yacoub, Ave Nations',     capacity: 55, status: 'OK',   deposits: 175 },
  { id: 15, type: 'Paper',   icon: '📄', color: '#ffb300', x: '82%', y: '58%', dist: '520m', addr: 'Hay Riad, Rue Fès',       capacity: 61, status: 'HIGH', deposits: 142 },
  { id: 22, type: 'Organic', icon: '🌿', color: '#00e676', x: '50%', y: '72%', dist: '390m', addr: 'Agdal, Ave Annakhil',     capacity: 28, status: 'OK',   deposits: 98  },
  { id: 3,  type: 'Plastic', icon: '🧴', color: '#29b6f6', x: '44%', y: '50%', dist: '210m', addr: 'Hassan, Rue Michlifen',   capacity: 74, status: 'HIGH', deposits: 267 },
];

// Zone overlay rectangles
const ZONE_AREAS = [
  { name: 'Agdal',    x: '8%',  y: '22%', w: '28%', h: '30%', color: '#29b6f6', value: 92 },
  { name: 'Hassan',   x: '30%', y: '10%', w: '22%', h: '25%', color: '#ab47bc', value: 80 },
  { name: 'Hay Riad', x: '50%', y: '32%', w: '38%', h: '35%', color: '#ffb300', value: 78 },
  { name: 'Souissi',  x: '8%',  y: '54%', w: '24%', h: '28%', color: '#00e676', value: 40 },
  { name: 'Yacoub',   x: '6%',  y: '60%', w: '14%', h: '22%', color: '#00bfa5', value: 55 },
  { name: 'Akkari',   x: '64%', y: '12%', w: '28%', h: '22%', color: '#ff8a65', value: 65 },
];

export function ZonesMap() {
  const [selectedBin, setSelectedBin] = useState(null);
  const [filter, setFilter]           = useState('All');
  const [showZones, setShowZones]     = useState(true);

  const filtered =
    filter === 'All' ? MAP_BINS : MAP_BINS.filter((b) => b.type === filter);

  const full  = MAP_BINS.filter((b) => b.status === 'FULL').length;
  const high  = MAP_BINS.filter((b) => b.status === 'HIGH').length;
  const total = MAP_BINS.length;

  return (
    <div className="flex h-full flex-col bg-[#050b0e] p-6 text-[#e8f5f0]">
      {/* Header */}
      <motion.div
        className="mb-5 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">
            Municipality — Spatial view
          </p>
          <h2 className="font-display text-2xl font-bold text-[#e8f5f0]">
            Zones &amp; Bin Map
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {full > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-[#ff525233] bg-[#ff525211] px-3 py-1 font-mono text-[11px] text-[#ff5252]">
              <AlertTriangle className="h-3 w-3" /> {full} Full
            </span>
          )}
          {high > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-[#ffb30033] bg-[#ffb30011] px-3 py-1 font-mono text-[11px] text-[#ffb300]">
              <Info className="h-3 w-3" /> {high} High
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-[#00e67633] bg-[#00e67611] px-3 py-1 font-mono text-[11px] text-[#00e676]">
            <CheckCircle2 className="h-3 w-3" /> {total - full - high} Normal
          </span>
        </div>
      </motion.div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Map area */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-[#1a3040]"
          style={{ background: 'linear-gradient(135deg,#051a0f 0%,#071520 40%,#05150a 100%)' }}
        >
          {/* Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(#1a3040_1px,transparent_1px),linear-gradient(90deg,#1a3040_1px,transparent_1px)] [background-size:48px_48px]" />

          {/* Roads */}
          <div className="absolute left-[8%] right-[8%] top-[38%] h-[3px] rounded-full bg-[#1e3a4f]" />
          <div className="absolute left-[12%] right-[18%] top-[62%] h-[3px] rounded-full bg-[#1e3a4f]" />
          <div className="absolute bottom-[10%] top-[8%] left-[42%] w-[3px] rounded-full bg-[#1e3a4f]" />
          <div className="absolute bottom-[20%] top-[12%] left-[68%] w-[3px] rounded-full bg-[#1e3a4f]" />
          <div className="absolute bottom-[5%] left-[25%] right-[5%] h-[2px] rounded-full bg-[#1a3040]" />

          {/* Zone overlays */}
          {showZones && ZONE_AREAS.map((z) => (
            <div
              key={z.name}
              className="absolute rounded-xl border"
              style={{
                left: z.x, top: z.y, width: z.w, height: z.h,
                backgroundColor: `${z.color}08`,
                borderColor: `${z.color}30`,
              }}
            >
              <span
                className="absolute left-2 top-1.5 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold"
                style={{ backgroundColor: `${z.color}22`, color: z.color }}
              >
                {z.name} · {z.value}%
              </span>
            </div>
          ))}

          {/* Bin markers */}
          {filtered.map((bin) => (
            <motion.button
              key={bin.id}
              type="button"
              className="absolute z-10 -translate-x-1/2 -translate-y-full text-left"
              style={{ left: bin.x, top: bin.y }}
              onClick={() => setSelectedBin(selectedBin?.id === bin.id ? null : bin)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Pulse ring for full/high bins */}
              {(bin.status === 'FULL' || bin.status === 'HIGH') && (
                <motion.div
                  className="absolute inset-[-4px] rounded-xl"
                  style={{ border: `2px solid ${STATUS_COLOR[bin.status]}` }}
                  animate={{ opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 text-lg shadow-lg"
                style={{
                  backgroundColor: `${bin.color}22`,
                  borderColor: selectedBin?.id === bin.id ? bin.color : `${STATUS_COLOR[bin.status]}99`,
                  boxShadow: `0 6px 20px ${bin.color}44`,
                }}
              >
                {bin.icon}
              </div>
              <div
                className="mt-0.5 rounded-md border px-1.5 py-0.5 text-center font-mono text-[9px]"
                style={{
                  backgroundColor: '#0a1420',
                  borderColor: `${STATUS_COLOR[bin.status]}44`,
                  color: STATUS_COLOR[bin.status],
                }}
              >
                #{bin.id} · {bin.capacity}%
              </div>
            </motion.button>
          ))}

          {/* Map controls */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            {/* Legend */}
            <div className="rounded-xl border border-[#1a3040] bg-black/70 px-3 py-2 backdrop-blur">
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#4a7060]">
                Bin types
              </p>
              <div className="flex flex-col gap-1">
                {[['#29b6f6','Plastic'],['#ab47bc','Glass'],['#ffb300','Paper'],['#00e676','Organic']].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: c }} />
                    <span className="font-mono text-[9px] text-[#8ab0a0]">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status legend */}
            <div className="rounded-xl border border-[#1a3040] bg-black/70 px-3 py-2 backdrop-blur">
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#4a7060]">
                Status
              </p>
              {Object.entries(STATUS_COLOR).map(([k, c]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                  <span className="font-mono text-[9px] text-[#8ab0a0]">{STATUS_LABEL[k]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zone toggle */}
          <button
            type="button"
            onClick={() => setShowZones((v) => !v)}
            className={`absolute right-3 top-3 rounded-xl border px-3 py-1.5 font-mono text-[10px] transition ${
              showZones
                ? 'border-[#00e67633] bg-[#00e67611] text-[#00e676]'
                : 'border-[#1a3040] bg-[#0a1420] text-[#4a7060]'
            }`}
          >
            {showZones ? '⬡ Zones ON' : '⬡ Zones OFF'}
          </button>
        </div>

        {/* Right panel */}
        <div className="flex w-72 flex-shrink-0 flex-col gap-3">
          {/* Filter */}
          <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
              Filter by type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Plastic', 'Glass', 'Paper', 'Organic'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] transition ${
                    filter === f
                      ? 'border-[#00e676] bg-[#00e67611] text-[#00e676]'
                      : 'border-[#1e3a4f] text-[#4a7060] hover:text-[#8ab0a0]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Zone performance */}
          <div className="rounded-2xl border border-[#1a3040] bg-[#0a1420] p-3">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
              Zone performance
            </p>
            <div className="space-y-2.5">
              {zones.map((z) => (
                <div key={z.name}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-[#e8f5f0]">{z.name}</span>
                    <span className="font-mono text-[#4a7060]">{z.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#1a3040]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg,#004d25,#00e676)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${z.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bin list / selected detail */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-[#1a3040] bg-[#0a1420] p-3">
            <AnimatePresence mode="wait">
              {selectedBin ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
                      Bin details
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedBin(null)}
                      className="rounded-lg p-1 text-[#4a7060] hover:text-[#e8f5f0]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-2xl"
                      style={{ backgroundColor: `${selectedBin.color}22`, borderColor: `${selectedBin.color}55` }}
                    >
                      {selectedBin.icon}
                    </div>
                    <div>
                      <div className="font-display text-[15px] font-semibold text-[#e8f5f0]">
                        Bin #{selectedBin.id} — {selectedBin.type}
                      </div>
                      <div className="font-mono text-[10px] text-[#4a7060]">{selectedBin.addr}</div>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2">
                    {[
                      { label: 'Distance',  value: selectedBin.dist,     color: '#e8f5f0' },
                      { label: 'Deposits',  value: selectedBin.deposits, color: '#29b6f6' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-[#0f1e2a] px-3 py-2">
                        <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#4a7060]">{s.label}</div>
                        <div className="font-display text-[15px] font-semibold" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3 rounded-xl bg-[#0f1e2a] px-3 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4a7060]">Capacity</span>
                      <span className="font-mono font-semibold" style={{ color: CAP_COLOR(selectedBin.capacity) }}>
                        {selectedBin.capacity}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#1a3040]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: CAP_COLOR(selectedBin.capacity) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedBin.capacity}%` }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>
                  </div>

                  <div className="mb-3 flex items-center justify-between rounded-xl bg-[#0f1e2a] px-3 py-2">
                    <span className="font-mono text-[10px] text-[#4a7060]">Status</span>
                    <span
                      className="rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
                      style={{
                        backgroundColor: `${STATUS_COLOR[selectedBin.status]}22`,
                        borderColor: `${STATUS_COLOR[selectedBin.status]}44`,
                        color: STATUS_COLOR[selectedBin.status],
                      }}
                    >
                      ● {STATUS_LABEL[selectedBin.status]}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#1e3a4f] py-2 font-mono text-[11px] text-[#8ab0a0] hover:border-[#00e676] hover:text-[#00e676]"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Navigate
                    </button>
                    {selectedBin.status === 'FULL' && (
                      <button
                        type="button"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00e676] py-2 font-mono text-[11px] font-semibold text-[#001a0d]"
                      >
                        🚛 Dispatch
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a7060]">
                    All bins ({filtered.length})
                  </p>
                  <div className="space-y-1.5">
                    {filtered.map((bin) => (
                      <button
                        key={bin.id}
                        type="button"
                        onClick={() => setSelectedBin(bin)}
                        className="flex w-full items-center gap-2.5 rounded-xl border border-[#1a3040] bg-[#0f1e2a] px-2.5 py-2 text-left transition hover:border-[#1e3a4f]"
                      >
                        <span className="text-base">{bin.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold text-[#e8f5f0]">
                            Bin #{bin.id} · {bin.type}
                          </div>
                          <div className="truncate font-mono text-[9px] text-[#4a7060]">
                            {bin.addr}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: STATUS_COLOR[bin.status] }}
                          />
                          <span className="font-mono text-[9px]" style={{ color: CAP_COLOR(bin.capacity) }}>
                            {bin.capacity}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
