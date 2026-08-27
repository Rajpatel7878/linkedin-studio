'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';

export default function LoginPage() {
  const [email, setEmail] = useState('alex@example.com');
  const [name, setName] = useState('Alex Rivera');
  const [plan, setPlan] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await signIn('google', { callbackUrl: '/generator', redirect: false });
      if (res?.error) {
        // Fallback: instant sign-in
        await signIn('demo-login', {
          email: 'google.creator@gmail.com',
          name: 'Google Creator',
          plan: 'pro',
          callbackUrl: '/generator',
          redirect: false,
        });
        window.location.href = '/generator';
      } else if (res?.url) {
        window.location.href = res.url;
      } else {
        window.location.href = '/generator';
      }
    } catch (e) {
      window.location.href = '/generator';
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('demo-login', {
        email,
        name,
        plan,
        callbackUrl: '/generator',
        redirect: false,
      });
      window.location.href = '/generator';
    } catch (e) {
      window.location.href = '/generator';
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-scale-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0a66c2] text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <LinkedinIcon className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to LinkedIn Studio
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to start creating viral, high-converting LinkedIn content.
          </p>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-98 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0a66c2]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Signing into Studio...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400">
              Or Fast Demo Login
            </span>
          </div>

          {/* Quick Dev/Demo Login Form */}
          <form onSubmit={handleDemoSignIn} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Plan Tier
                </label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="free">Free Tier</option>
                  <option value="pro">Pro Creator</option>
                  <option value="team">Team Tier</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-98 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Enter Content Studio</span>
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 leading-normal">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-[#0a66c2] underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#0a66c2] underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
