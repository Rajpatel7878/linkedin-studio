'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Bell,
  Sparkles,
  Zap,
  Globe,
  ArrowRight,
  CreditCard,
  LogOut,
  User,
  Shield,
  Activity,
} from 'lucide-react';
import { LinkedinIcon } from './icons/LinkedinIcon';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [accountInfo, setAccountInfo] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAccountInfo(d.account);
      })
      .catch(() => {});
  }, []);

  const isMarketingPage =
    pathname === '/' || pathname === '/pricing' || pathname === '/privacy' || pathname === '/terms' || pathname === '/login';

  // Public Marketing Navbar
  if (isMarketingPage) {
    return (
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">
              LinkedIn Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/#features" className="hover:text-[#0a66c2] transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-[#0a66c2] transition-colors">
              Pricing & Plans
            </Link>
            <Link href="/#testimonials" className="hover:text-[#0a66c2] transition-colors">
              Wall of Love
            </Link>
            <Link href="/#faq" className="hover:text-[#0a66c2] transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {status === 'authenticated' ? (
              <Link
                href="/generator"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <span>Go to Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Authenticated Dashboard Navbar
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left: Quick Status */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">LinkedIn Cloud</span>
          {accountInfo?.isSandboxMode && (
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Sandbox Active
            </span>
          )}
        </div>

        <span className="text-slate-300">|</span>

        <div className="text-slate-500">
          Daily Quota:{' '}
          <span className="font-mono font-bold text-slate-800">
            {accountInfo?.dailyPostCount || 0}/{accountInfo?.dailyPostLimit || 25}
          </span>
        </div>
      </div>

      {/* Right: Quick Links & Profile */}
      <div className="flex items-center gap-3">
        <Link
          href="/billing"
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all"
        >
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Subscription & Usage</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-1.5 p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Settings"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
