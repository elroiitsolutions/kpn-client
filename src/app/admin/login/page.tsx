'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@kpnpromoters.in');
  const [password, setPassword] = useState('Admin@KPN2026');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070d1e] px-4 py-12">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#f12131]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[400px] w-[400px] rounded-full bg-[#29247c]/20 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f12131] text-white shadow-xl shadow-red-900/30">
            <span className="text-2xl font-black">K</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            KPN Promoters
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            CMS & Admin Control Center
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-300">
            <ShieldCheck className="h-4 w-4 text-[#f12131]" />
            <span>Authorized Personnel Only</span>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kpnpromoters.in"
                  className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-600 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-600 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-[#f12131] text-sm font-extrabold text-white shadow-lg shadow-red-900/30 transition hover:bg-[#d81928] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-5 text-center text-xs text-slate-400">
            <span>KPN Promoters Real Estate Platform v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
