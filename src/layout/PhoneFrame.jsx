import { motion } from 'framer-motion';
import { wasteTrackGradients } from '../theme';

export function PhoneFrame({ title = 'WasteTrack', children, bottomNav }) {
  return (
    <div className="flex items-center justify-center h-full bg-[#050b0e] px-4">
      <motion.div
        className="flex h-[680px] w-[340px] flex-col rounded-[32px] border border-[#1e3a4f] bg-[#0f1e2a] shadow-[0_0_80px_rgba(0,230,118,0.16)] overflow-hidden"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
        style={{ backgroundImage: wasteTrackGradients.cardGlow }}
      >
        <div className="flex items-center justify-between border-b border-[#1a3040] bg-[#0f1e2a] px-5 py-2.5">
          <span className="font-mono text-[11px] text-[#4a7060]">9:41</span>
          <span className="font-display text-[11px] font-semibold text-[#e8f5f0]">
            {title}
          </span>
          <div className="flex items-center gap-1">
            <div className="relative h-2 w-3.5 rounded-[3px] border border-[#8ab0a0]">
              <div className="absolute inset-[2px] right-0 w-[70%] rounded-[2px] bg-[#00e676]" />
            </div>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto bg-[#0f1e2a]">
          {children}
        </div>

        {bottomNav}
      </motion.div>
    </div>
  );
}

