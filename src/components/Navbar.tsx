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

  // 3D Glass Public Marketing Navbar
  if (isMarketingPage) {
    return (
      <header className="w-full bg-[#090d16]/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">
                LinkedIn Studio
              </span>
              <span className="text-[10px] uppercase font-mono font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded-md">
                3D
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-400">
            <Link href="/#features" className="hover:text-cyan-300 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-cyan-300 transition-colors">
              Pricing & Plans
            </Link>
            <Link href="/#faq" className="hover:text-cyan-300 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {status === 'authenticated' ? (
              <Link
                href="/generator"
                className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg active:scale-95"
              >
                <span>Go to Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-black text-xs shadow-lg active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
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
    <header className="h-16 bg-[#0d121f]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xl">
      {/* Left: Quick Status */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <span className="font-bold text-slate-200">LinkedIn Cloud</span>
          {accountInfo?.isSandboxMode && (
            <span className="text-[10px] bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              Sandbox Active
            </span>
          )}
        </div>

        <span className="text-slate-700">|</span>

        <div className="text-slate-400">
          Daily Quota:{' '}
          <span className="font-mono font-bold text-cyan-400">
            {accountInfo?.dailyPostCount || 0}/{accountInfo?.dailyPostLimit || 25}
          </span>
        </div>
      </div>

      {/* Right: Quick Links & Profile */}
      <div className="flex items-center gap-3">
        <Link
          href="/billing"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-all shadow-sm"
        >
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Subscription & Usage</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-1.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Settings"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
