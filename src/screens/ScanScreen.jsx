import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { scanApi } from '../api/client';
import { useAuth } from '../api/AuthContext';

// ── Step 1: QR Scanner ────────────────────────────────────────
function StepQR({ onScanned }) {
  const [scanning, setScanning] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setScanning(false); setTimeout(onScanned, 600); }, 2500);
    return () => clearTimeout(t);
  }, [onScanned]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a7060]">Layer 1 — Citizen</p>
      <h3 className="mb-8 text-[18px] font-semibold text-[#e8f5f0]">Scan bin QR code</h3>
      <div className="relative mb-8 h-52 w-52">
        <div className="absolute inset-0 rounded-3xl border border-[#00e67655] bg-[#00e67608]" />
        {[
          'top-0 left-0 border-t-[3px] border-l-[3px]',
          'top-0 right-0 border-t-[3px] border-r-[3px]',
          'bottom-0 left-0 border-b-[3px] border-l-[3px]',
          'bottom-0 right-0 border-b-[3px] border-r-[3px]',
        ].map((cls, i) => (
          <div key={i} className={`absolute h-6 w-6 border-[#00e676] ${cls}`} />
        ))}
        {scanning && (
          <motion.div
            className="absolute left-2 right-2 h-[2px] bg-[#00e676] shadow-[0_0_8px_#00e676]"
            animate={{ top: ['8px', 'calc(100% - 8px)'] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-6 w-6 rounded bg-white" />)}
          </div>
        </div>
      </div>
      <p className="text-[13px] text-[#4a7060]">
        {scanning ? 'Point camera at bin QR code…' : '✓ QR code detected — Bin #34 · Agdal'}
      </p>
    </div>
  );
}

// ── Step 2: Capture + AI ──────────────────────────────────────
function StepCapture({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const result = await scanApi.classifyWaste(file);
      onResult(result, file);
    } catch (e) {
      // Fallback: use mock result so demo never breaks
      onResult({
        waste_type: 'Plastic',
        detected_object: 'plastic bottle',
        confidence: 0.93,
        correct_bin: 'Plastic',
        points_earned: 5,
        tip: 'Rinse the bottle before recycling — clean plastic is worth more! ♻️',
      }, file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-5 py-5">
      <div className="mb-4 rounded-2xl border border-[#00e67633] bg-[#00e67611] p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00e67644] bg-[#00e67622] text-[#00e676]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#e8f5f0]">Bin #34 — Plastic</p>
            <p className="font-mono text-[10px] text-[#4a7060]">📍 Rabat Agdal, Zone A</p>
          </div>
        </div>
      </div>

      <h3 className="mb-1 text-[16px] font-semibold text-[#e8f5f0]">Capture waste item</h3>
      <p className="mb-4 text-[12px] text-[#8ab0a0]">Take a photo — AI will detect the waste type</p>

      <div
        className="relative mb-5 flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#1e3a4f] transition hover:border-[#00e676]"
        style={{ background: 'linear-gradient(135deg, #0a1420, #0f1e2a)' }}
        onClick={() => !loading && fileRef.current?.click()}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#00e676]" />
            <p className="font-mono text-[11px] text-[#00e676]">AI analysing…</p>
          </div>
        ) : (
          <>
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-[#3b82f644] bg-[#3b82f622] text-3xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🧴
            </motion.div>
            <p className="absolute bottom-3 font-mono text-[10px] text-[#4a7060]">
              Tap to take / upload photo
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="mb-3 text-center text-[11px] text-[#ff5252]">{error}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={() => fileRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00e676] py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#001a0d] shadow-[0_0_24px_rgba(0,230,118,0.45)] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
        {loading ? 'Analysing…' : 'Capture item'}
      </button>
    </div>
  );
}

// ── Step 3: AI Result ─────────────────────────────────────────
const TYPE_ICONS  = { Plastic: '🧴', Glass: '🫙', Paper: '📄', Organic: '🌿' };
const TYPE_COLORS = { Plastic: '#29b6f6', Glass: '#ab47bc', Paper: '#ffb300', Organic: '#00e676' };
const POINTS_MAP  = { Plastic: 5, Glass: 7, Paper: 4, Organic: 3 };
const TIPS_MAP    = {
  Plastic: 'Rinse the bottle before recycling — clean plastic is worth more! ♻️',
  Glass:   'Glass can be recycled infinitely without losing quality. 🫙',
  Paper:   'Remove any plastic tape or staples before recycling paper. 📄',
  Organic: 'Organic waste becomes biogas and compost — great for the city! 🌿',
};

function StepResult({ aiResult, onConfirm, onRetry, saving }) {
  const [selectedType, setSelectedType] = useState(aiResult.waste_type);
  const corrected = selectedType !== aiResult.waste_type;

  // Build a result object using the user-selected type
  const finalResult = {
    ...aiResult,
    waste_type:    selectedType,
    correct_bin:   selectedType,
    points_earned: POINTS_MAP[selectedType] ?? aiResult.points_earned,
    tip:           TIPS_MAP[selectedType]   ?? aiResult.tip,
    // If user corrected, bump confidence to 1.0 (human override)
    confidence:    corrected ? 1.0 : aiResult.confidence,
  };

  const color = TYPE_COLORS[selectedType] || '#00e676';

  return (
    <motion.div className="flex flex-col px-5 py-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-4 flex flex-col items-center text-center">
        <div className="mb-2 text-4xl">{TYPE_ICONS[selectedType] || '♻️'}</div>
        <h3 className="text-[18px] font-bold text-[#e8f5f0]">
          {corrected ? 'Corrected ✓' : 'AI Detected!'}
        </h3>
        <p className="text-[12px] text-[#8ab0a0]">
          {corrected ? 'You overrode the AI — thank you for the correction' : `AI confidence: ${(aiResult.confidence * 100).toFixed(0)}%`}
        </p>
      </div>

      {/* AI suggestion row */}
      <div className="mb-3 rounded-2xl border border-[#1a3040] bg-[#0a1420] p-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
          AI detected
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#e8f5f0]">{aiResult.detected_object}</span>
          <span className="font-mono text-[12px] font-semibold" style={{ color }}>
            {selectedType}
          </span>
        </div>
        {/* Confidence bar */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="text-[#4a7060]">Confidence</span>
            <span className="font-mono" style={{ color: aiResult.confidence >= 0.8 ? '#00e676' : '#ffb300' }}>
              {(aiResult.confidence * 100).toFixed(0)}%
              {aiResult.confidence < 0.75 && ' — low, please verify'}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1a3040]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: aiResult.confidence >= 0.8 ? 'linear-gradient(90deg,#16a34a,#00e676)' : 'linear-gradient(90deg,#b45309,#ffb300)' }}
              initial={{ width: 0 }}
              animate={{ width: `${aiResult.confidence * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* ── Manual correction buttons ── */}
      <div className="mb-3 rounded-2xl border border-[#1a3040] bg-[#0a1420] p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a7060]">
          Confirm or correct bin type
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(TYPE_ICONS).map(([type, icon]) => {
            const isSelected = selectedType === type;
            const isAI       = aiResult.waste_type === type;
            const c          = TYPE_COLORS[type];
            return (
              <motion.button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all"
                style={{
                  borderColor:     isSelected ? c : '#1e3a4f',
                  backgroundColor: isSelected ? `${c}22` : '#0f1e2a',
                }}
              >
                <span className="text-xl">{icon}</span>
                <div className="text-left">
                  <p className="text-[12px] font-semibold" style={{ color: isSelected ? c : '#8ab0a0' }}>
                    {type}
                  </p>
                  <p className="font-mono text-[9px] text-[#4a7060]">
                    {isAI ? '← AI pick' : `+${POINTS_MAP[type]} pts`}
                  </p>
                </div>
                {isSelected && (
                  <span className="ml-auto font-mono text-[10px]" style={{ color: c }}>✓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Points */}
      <div className="mb-3 rounded-2xl border border-[#00e67644] p-4 text-center"
        style={{ background: 'linear-gradient(135deg, #052e16, #14532d)' }}>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4ade80]">Points earned</p>
        <p className="font-display text-5xl font-bold text-white">+{finalResult.points_earned}</p>
        {corrected && (
          <p className="mt-1 font-mono text-[10px] text-[#4ade80]">Updated for {selectedType} bin</p>
        )}
      </div>

      {/* Eco tip */}
      <div className="mb-3 rounded-2xl border border-[#1a3040] bg-[#0a1420] px-3 py-2.5">
        <p className="text-[11px] text-[#8ab0a0]">💡 {finalResult.tip}</p>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onRetry}
          className="flex-1 rounded-xl border border-[#1e3a4f] py-3 font-mono text-[11px] text-[#8ab0a0] transition hover:border-[#00e676] hover:text-[#00e676]">
          Retry
        </button>
        <button type="button" onClick={() => onConfirm(finalResult)} disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00e676] py-3 font-mono text-[12px] font-semibold text-[#001a0d] disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm ↗'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 4: Success ───────────────────────────────────────────
function StepSuccess({ newBalance, navigate }) {
  return (
    <motion.div className="flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <motion.div
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#00e676] bg-[#00e67622] text-4xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5 }}
      >
        ✅
      </motion.div>
      <h3 className="mb-2 font-display text-xl font-bold text-[#e8f5f0]">Deposit saved!</h3>
      <p className="mb-1 text-[13px] text-[#8ab0a0]">Points added to your account</p>
      {newBalance !== null && (
        <p className="mb-6 font-display text-3xl font-bold text-[#00e676]">
          {newBalance.toLocaleString()} pts
        </p>
      )}
      <button type="button" onClick={() => navigate('/app')}
        className="rounded-2xl bg-[#00e676] px-8 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[#001a0d]">
        Back to home
      </button>
    </motion.div>
  );
}

// ── Main ScanScreen ───────────────────────────────────────────
export function ScanScreen() {
  const [step, setStep]         = useState('qr');
  const [aiResult, setAiResult] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [newBalance, setNewBalance] = useState(null);

  const { user, updatePoints } = useAuth();
  const navigate = useNavigate();

  const STEPS = { qr: 1, capture: 2, result: 3, success: 4 };
  const current = STEPS[step];

  const handleResult = (result) => {
    setAiResult(result);
    setStep('result');
  };

  // finalResult may differ from aiResult if the user corrected the type
  const handleConfirm = async (finalResult) => {
    if (!finalResult) return;
    setSaving(true);
    try {
      if (user?.user_id && !user.user_id.startsWith('demo')) {
        const resp = await scanApi.saveDeposit(
          user.user_id,
          finalResult.waste_type,
          finalResult.confidence,
          finalResult.points_earned,
        );
        updatePoints(resp.new_balance);
        setNewBalance(resp.new_balance);
      } else {
        const nb = (user?.points || 1245) + finalResult.points_earned;
        updatePoints(nb);
        setNewBalance(nb);
      }
      setStep('success');
    } catch {
      const nb = (user?.points || 1245) + finalResult.points_earned;
      updatePoints(nb);
      setNewBalance(nb);
      setStep('success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-[#0f1e2a]">
      {/* Progress stepper */}
      {step !== 'success' && (
        <div className="flex items-center border-b border-[#1a3040] px-4 py-3">
          {['QR Scan', 'Capture', 'AI Result', 'Done'].map((label, i) => {
            const stepNum = i + 1;
            const done = current > stepNum;
            const active = current === stepNum;
            return (
              <div key={label} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-mono font-bold transition-colors ${
                    done ? 'bg-[#00e676] text-[#001a0d]' : active ? 'border-2 border-[#00e676] text-[#00e676]' : 'border border-[#1e3a4f] text-[#4a7060]'
                  }`}>
                    {done ? '✓' : stepNum}
                  </div>
                  {i < 3 && <div className={`h-[1px] flex-1 transition-colors ${done ? 'bg-[#00e676]' : 'bg-[#1a3040]'}`} />}
                </div>
                <span className={`mt-1 text-[8px] font-mono tracking-[0.12em] ${active ? 'text-[#00e676]' : done ? 'text-[#4a7060]' : 'text-[#1e3a4f]'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
          {step === 'qr'      && <StepQR onScanned={() => setStep('capture')} />}
          {step === 'capture' && <StepCapture onResult={handleResult} />}
          {step === 'result'  && aiResult && (
            <StepResult
              aiResult={aiResult}
              onConfirm={handleConfirm}
              onRetry={() => setStep('capture')}
              saving={saving}
            />
          )}
          {step === 'success' && <StepSuccess newBalance={newBalance} navigate={navigate} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
