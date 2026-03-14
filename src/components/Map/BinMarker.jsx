import { motion } from 'framer-motion';

export function BinMarker({ bin, isSelected, onSelect }) {
  return (
    <motion.button
      type="button"
      className="absolute -translate-x-1/2 -translate-y-full text-left"
      style={{ left: bin.x, top: bin.y }}
      onClick={() => onSelect(bin)}
      initial={{ scale: 0, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl border text-base shadow-lg"
        style={{
          backgroundColor: `${bin.color}22`,
          borderColor: `${bin.color}80`,
          boxShadow: `0 10px 30px ${bin.color}55`,
        }}
      >
        <span>{bin.icon}</span>
      </div>
      <div
        className="mt-1 rounded-md border px-1.5 py-0.5 text-[10px] font-mono text-[#8ab0a0] shadow-sm"
        style={{
          backgroundColor: '#0f1e2a',
          borderColor: isSelected ? `${bin.color}aa` : `${bin.color}55`,
          color: bin.color,
        }}
      >
        {bin.dist}
      </div>
    </motion.button>
  );
}

