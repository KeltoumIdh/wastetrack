export const wasteTrackTheme = {
  colors: {
    background: '#050b0e',
    surface: '#0a1420',
    card: '#0f1e2a',
    primary: '#00e676',
    primarySoft: 'rgba(0, 230, 118, 0.12)',
    blue: '#29b6f6',
    amber: '#ffb300',
    coral: '#ff5252',
    purple: '#ab47bc',
    text: '#e8f5f0',
    textMuted: '#8ab0a0',
    textSoft: '#4a7060',
    border: '#1a3040',
    borderStrong: '#1e3a4f',
  },
  radii: {
    sm: '10px',
    md: '16px',
    lg: '24px',
    pill: '999px',
  },
};

export const wasteTrackGradients = {
  cardGlow:
    'radial-gradient(circle at top left, rgba(0,230,118,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(41,182,246,0.18), transparent 55%)',
  mapBackground:
    'linear-gradient(135deg,#051a0f 0%,#071520 40%,#05150a 100%)',
};

export const screenTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: [0.21, 0.6, 0.35, 1] },
};

