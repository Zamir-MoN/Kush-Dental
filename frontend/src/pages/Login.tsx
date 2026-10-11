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
    <div className="portal-neumorphic flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-10 sm:px-6 lg:px-8 text-slate-800 font-sans selection:bg-[#DC95FF]/30 selection:text-[#3B0764] relative overflow-hidden">
      {/* Subtle Ambient Glow Spheres (Dashboard aesthetic) */}
      <div className="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#DC95FF]/12 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#FFF4BF]/60 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md rounded-3xl bg-[#FAF7F2] p-7 sm:p-10 shadow-[10px_10px_26px_#E2DACB,-10px_-10px_26px_#FFFFFF] border border-white/90 relative z-10"
      >
        {/* Brand Crest with Animated Logo */}
        <div className="text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-[#FAF7F2] shadow-[6px_6px_14px_#E5DFD3,-6px_-6px_14px_#FFFFFF] border border-white/85 p-3.5 mb-4 group cursor-pointer transition-shadow hover:shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF]"
          >
            <AnimatedLogo size={52} animate={true} className="w-13 h-13" />
          </motion.div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Kush Dental Portal
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Sign in to access clinical and administrative tools
          </p>

          <div className="mt-3 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF4BF] text-[#713F12] border border-[#FDE68A] shadow-[inset_1.5px_1.5px_3px_#E6DC9A,inset_-1.5px_-1.5px_3px_#FFFFFF]">
              <Sparkles size={11} className="text-[#DC95FF]" />
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
              className="rounded-2xl bg-rose-50/90 p-3.5 border border-rose-200 text-rose-700 shadow-[inset_1.5px_1.5px_3px_#F8D7DA,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center gap-2.5 text-xs sm:text-sm font-bold"
            >
              <AlertCircle size={18} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Email Field with Inset Neumorphic Well */}
            <div>
              <label 
                htmlFor="email-address" 
                className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5"
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
                  className="block w-full rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] focus:shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF,0_0_0_2px_rgba(220,149,255,0.45)] focus:border-[#DC95FF] transition-all outline-none"
                  placeholder="name@kushdental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field with Inset Neumorphic Well & Visibility Toggle */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5"
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
                  className="block w-full rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] pl-10 pr-11 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] focus:shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF,0_0_0_2px_rgba(220,149,255,0.45)] focus:border-[#DC95FF] transition-all outline-none"
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

          {/* Tactile Extruded Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#DC95FF] via-[#D384FA] to-[#C084FC] py-3.5 px-6 text-sm font-black text-white tracking-wide shadow-[5px_5px_14px_#DCD5C7,-5px_-5px_14px_#FFFFFF] hover:shadow-[7px_7px_18px_#D0C7B6,-7px_-7px_18px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DC95FF]/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
        <div className="mt-7 pt-5 border-t border-[#E8E2D5]/70 flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
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
