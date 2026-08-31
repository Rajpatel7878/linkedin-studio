'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  CreditCard,
  LogOut,
  LogIn,
  User,
  Settings,
  Shield,
  Activity,
  Menu,
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
      <header className="w-full bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                LinkedIn Studio
              </span>
              <span className="text-[9px] uppercase font-mono font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded-md hidden xs:inline-block">
                3D
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold text-slate-400">
            <Link href="/generator" className="hover:text-cyan-300 transition-colors">
              Post Generator
            </Link>
            <Link href="/templates" className="hover:text-cyan-300 transition-colors">
              Templates & Books
            </Link>
            <Link href="/pricing" className="hover:text-cyan-300 transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/generator"
                  className="btn-3d-primary flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg active:scale-95"
                >
                  <span>Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700/80 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="btn-3d-primary flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-white font-black text-xs shadow-lg active:scale-95"
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
    <header className="h-16 bg-[#0d121f]/95 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xl">
      {/* Left: Brand Icon on Mobile + Quick Status */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs">
        <Link href="/generator" className="lg:hidden flex items-center gap-1.5 mr-1 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0a66c2] to-cyan-500 flex items-center justify-center text-white shadow-md">
            <LinkedinIcon className="w-4 h-4" />
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50 flex-shrink-0" />
          <span className="font-bold text-slate-200 text-xs hidden sm:inline">LinkedIn Cloud</span>
          {accountInfo?.isSandboxMode && (
            <span className="text-[9px] sm:text-[10px] bg-amber-500/15 text-amber-300 font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-500/30">
              Sandbox
            </span>
          )}
        </div>

        <span className="text-slate-700 hidden sm:inline">|</span>

        <div className="text-slate-400 text-xs">
          <span className="hidden sm:inline">Daily Quota: </span>
          <span className="font-mono font-bold text-cyan-400">
            {accountInfo?.dailyPostCount || 0}/{accountInfo?.dailyPostLimit || 25}
          </span>
        </div>
      </div>

      {/* Right: Quick Links, Profile & Log Out */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link
          href="/billing"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-sm"
        >
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Subscription</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-1.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Account Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {status === 'authenticated' ? (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700/80 text-xs font-bold transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-3d-primary text-white text-xs font-bold"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
