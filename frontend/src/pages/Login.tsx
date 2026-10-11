import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/apiClient';
import { AnimatedLogo } from '../components/ui/AnimatedLogo';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/staff/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#EAE4D9] via-[#E5DFD4] to-[#DFD8CC] px-4 py-10 sm:px-6 lg:px-8 text-slate-800 font-sans selection:bg-[#DC95FF]/30 selection:text-[#3B0764]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md rounded-3xl bg-[#FAF7F2] p-7 sm:p-10 shadow-[14px_14px_32px_rgba(195,185,170,0.6),-10px_-10px_24px_rgba(255,255,255,0.9)] border border-[#E2DACB]/80 relative"
      >
        {/* Brand Crest with Animated Logo */}
        <div className="text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-[#DDD5C5] p-3 mb-4 group cursor-pointer transition-shadow"
          >
            <AnimatedLogo size={46} animate={true} className="w-11 h-11" />
          </motion.div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Kush Dental Portal
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
            Sign in to access clinical and administrative tools
          </p>

          <div className="mt-3 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#EFEAE2] text-[#6B21A8] border border-[#DDD5C5] shadow-[1px_1px_3px_rgba(0,0,0,0.04)]">
              <Sparkles size={11} className="text-[#9333EA]" />
              Staff &amp; Doctor Sign In
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-rose-50 p-3.5 border border-rose-200 text-rose-800 shadow-xs flex items-center gap-2.5 text-xs sm:text-sm font-bold"
            >
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Email Field with Crisp White Input */}
            <div>
              <label 
                htmlFor="email-address" 
                className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-2xl bg-white border border-[#D6CDBD] pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all outline-none"
                  placeholder="name@kushdental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field with Crisp White Input & Toggle */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-2xl bg-white border border-[#D6CDBD] pl-10 pr-11 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* High-Contrast Classic Royal Purple Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] py-3.5 px-6 text-sm font-bold text-white tracking-wide shadow-[0_6px_18px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_24px_rgba(109,40,217,0.45)] hover:brightness-105 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security & Return Link Footer */}
        <div className="mt-7 pt-5 border-t border-[#E8E2D5] flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted Healthcare Session</span>
          </div>
          <Link
            to="/"
            className="text-xs font-bold text-slate-600 hover:text-[#7C3AED] transition-colors mt-0.5"
          >
            &larr; Return to main clinic site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
