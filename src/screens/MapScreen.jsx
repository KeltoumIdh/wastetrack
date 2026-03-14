import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { bins } from '../data/mockData';
import { BinMarker } from '../components/Map/BinMarker';
import { BinDetails } from '../components/Map/BinDetails';
import { Search } from 'lucide-react';

export function MapScreen() {
  const [selectedBin, setSelectedBin] = useState(null);

  return (
    <div className="flex h-full flex-col bg-[#0f1e2a]">
      <div className="px-4 pb-2 pt-3.5">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
          Nearby recycling bins
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#1a3040] bg-[#0a1420] px-3 py-2.5">
          <Search className="h-4 w-4 text-[#4a7060]" />
          <span className="font-mono text-[11px] text-[#4a7060]">
            Search address…
          </span>
        </div>
      </div>

      <div className="relative h-64 overflow-hidden rounded-2xl border border-[#1a3040] bg-[radial-gradient(circle_at_top_left,rgba(0,230,118,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(41,182,246,0.12),transparent_55%),linear-gradient(135deg,#051a0f_0%,#071520_40%,#05150a_100%)] mx-4">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(#1a3040_1px,transparent_1px),linear-gradient(90deg,#1a3040_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute left-[10%] right-[10%] top-[40%] h-[3px] rounded bg-[#1a3040]" />
        <div className="absolute left-[15%] right-[25%] top-[65%] h-[3px] rounded bg-[#1a3040]" />
        <div className="absolute bottom-[8%] top-[8%] left-[45%] w-[3px] rounded bg-[#1a3040]" />
        <div className="absolute bottom-[25%] top-[15%] left-[70%] w-[3px] rounded bg-[#1a3040]" />

        <div className="absolute left-1/2 top-[48%] z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#29b6f6] shadow-[0_0_0_8px_rgba(41,182,246,0.2),0_0_0_16px_rgba(41,182,246,0.08)]" />

        {bins.map((bin) => (
          <BinMarker
            key={bin.id}
            bin={bin}
            isSelected={selectedBin?.id === bin.id}
            onSelect={setSelectedBin}
          />
        ))}

        <div className="absolute bottom-2 left-2 rounded-lg border border-[#1a3040] bg-black/60 px-3 py-1.5 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            {[
              ['#29b6f6', 'Plastic'],
              ['#ab47bc', 'Glass'],
              ['#ffb300', 'Paper'],
              ['#00e676', 'Organic'],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[9px] text-[#8ab0a0]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {selectedBin ? (
          <BinDetails bin={selectedBin} onClose={() => setSelectedBin(null)} />
        ) : (
          <motion.div
            className="mt-2 px-4 pb-3 pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
              Nearby bins ({bins.length})
            </div>
            <div className="space-y-1.5">
              {bins.slice(0, 3).map((bin) => (
                <button
                  key={bin.id}
                  type="button"
                  onClick={() => setSelectedBin(bin)}
                  className="flex w-full items-center gap-2 border-b border-[#1a3040] py-2 text-left text-[12px] text-[#e8f5f0]"
                >
                  <span className="text-lg">{bin.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px]">
                      {bin.type} · {bin.addr.split(',')[0]}
                    </div>
                    <div className="font-mono text-[10px] text-[#4a7060]">
                      {bin.dist} away
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#00e676]">
                    View
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

