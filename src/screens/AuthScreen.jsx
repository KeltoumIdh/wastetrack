import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { authApi } from '../api/client';
import { useAuth } from '../api/AuthContext';

export function AuthScreen() {
  const [mode, setMode]       = useState('login');   // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // form fields
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity]       = useState('Rabat');

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userData;
      if (mode === 'login') {
        userData = await authApi.login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your name');
        userData = await authApi.register(name, email, password, city);
      }
      login(userData);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo bypass — skip backend for quick demo
  const handleDemoLogin = () => {
    login({
      user_id: 'demo-user-001',
      name: 'Sara Moussaoui',
      email: 'sara@wastetrack.ma',
      points: 1245,
      city: 'Rabat',
      access_token: 'demo-token',
    });
    navigate('/app');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b0e] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          className="mb-8 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00e676] text-2xl font-extrabold text-[#001a0d] shadow-[0_0_32px_rgba(0,230,118,0.45)]">
            ♺
          </div>
          <h1 className="font-display text-2xl font-bold text-[#e8f5f0]">
            WasteTrack
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#4a7060]">
            Smart Recycling Platform
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl border border-[#1a3040] bg-[#0a1420] p-7 shadow-[0_0_60px_rgba(0,230,118,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl border border-[#1a3040] bg-[#0f1e2a] p-1">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 rounded-lg py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                  mode === m
                    ? 'bg-[#00e676] font-semibold text-[#001a0d]'
                    : 'text-[#4a7060] hover:text-[#8ab0a0]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-1">
                    <Field
                      icon={User}
                      placeholder="Full name"
                      value={name}
                      onChange={setName}
                      autoComplete="name"
                    />
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a7060]" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-[#1a3040] bg-[#0f1e2a] py-3 pl-10 pr-4 font-mono text-[12px] text-[#e8f5f0] outline-none focus:border-[#00e676] transition"
                      >
                        {['Rabat', 'Casablanca', 'Salé', 'Temara', 'Marrakech', 'Fès'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />
            <Field
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-[#ff525233] bg-[#ff525211] px-3 py-2.5 text-[11px] text-[#ff5252]"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e676] py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[#001a0d] shadow-[0_0_20px_rgba(0,230,118,0.4)] transition hover:bg-[#00c853] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#1a3040]" />
            <span className="font-mono text-[10px] text-[#4a7060]">or</span>
            <div className="h-px flex-1 bg-[#1a3040]" />
          </div>

          {/* Demo login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full rounded-xl border border-[#1e3a4f] py-3 font-mono text-[11px] text-[#8ab0a0] transition hover:border-[#00e676] hover:text-[#00e676]"
          >
            ⚡ Continue as demo user (Sara M.)
          </button>
        </motion.div>

        <p className="mt-5 text-center font-mono text-[10px] text-[#4a7060]">
          WasteTrack · Smart City Recycling · Rabat 2025
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, ...rest }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a7060]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#1a3040] bg-[#0f1e2a] py-3 pl-10 pr-4 font-mono text-[12px] text-[#e8f5f0] placeholder-[#4a7060] outline-none transition focus:border-[#00e676]"
        {...rest}
      />
    </div>
  );
}
