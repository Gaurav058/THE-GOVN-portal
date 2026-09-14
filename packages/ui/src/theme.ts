export const theme = {
  colors: {
    primary: '#1e3a8a', // Deep navy blue (authority, trust)
    primaryHover: '#172554',
    secondary: '#047857', // Forest green (action, verified)
    accent: '#d97706', // Amber (closing soon alert)
    danger: '#b91c1c', // Crimson (urgent, deadline passed)
    background: '#f8fafc', // Crisp light gray
    surface: '#ffffff',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
  },
  statusStyles: {
    APPLICATION_OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    CLOSING_SOON: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse font-semibold',
    APPLICATION_CLOSED: 'bg-slate-100 text-slate-600 border-slate-300',
    CORRECTION_OPEN: 'bg-blue-50 text-blue-700 border-blue-300',
    ADMIT_CARD_AVAILABLE: 'bg-purple-50 text-purple-700 border-purple-300 font-semibold',
    EXAM_SCHEDULED: 'bg-indigo-50 text-indigo-700 border-indigo-300',
    RESULT_DECLARED: 'bg-teal-50 text-teal-700 border-teal-300 font-bold',
    VERIFIED: 'bg-green-50 text-green-700 border-green-300',
    NEEDS_REVIEW: 'bg-yellow-50 text-yellow-800 border-yellow-300',
    CONFLICT_DETECTED: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
  }
};
