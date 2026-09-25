import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/apiClient';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/staff';

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
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-[#E8E2D5]"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5B22D] to-[#B8871B] shadow-md mb-4 text-[#141518] font-bold text-2xl">
            K
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Kush Dental Portal
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in to access clinical and administrative tools
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl bg-rose-50 p-4 border border-rose-200"
            >
              <div className="flex">
                <div className="ml-1">
                  <h3 className="text-sm font-semibold text-rose-700">{error}</h3>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-xl bg-[#FAF7F2] border border-[#E2DACB] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
                placeholder="name@kushdental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-xl bg-[#FAF7F2] border border-[#E2DACB] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] px-4 py-3 text-sm font-bold text-[#141518] shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#DCA51B] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#141518]/20 border-t-[#141518]"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
