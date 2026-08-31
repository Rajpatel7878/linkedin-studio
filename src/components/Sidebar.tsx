'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Sparkles,
  BookOpen,
  Mic,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  Settings,
  CreditCard,
  PlusCircle,
  Zap,
  LogOut,
  LogIn,
  Layers,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { UpgradeModal } from './billing/UpgradeModal';

export const NAV_ITEMS = [
  {
    label: 'Post Generator',
    href: '/generator',
    icon: Sparkles,
    badge: 'AI',
  },
  {
    label: 'Templates & Swipe Books',
    href: '/templates',
    icon: BookOpen,
  },
  {
    label: 'Voice Profiles',
    href: '/voice',
    icon: Mic,
  },
  {
    label: 'Content Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    label: 'Visual Card Studio',
    href: '/card-studio',
    icon: ImageIcon,
  },
  {
    label: 'Analytics & Trends',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Billing & Plan',
    href: '/billing',
    icon: CreditCard,
  },
  {
    label: 'Settings & OAuth',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [plan, setPlan] = useState<string>('free');

  useEffect(() => {
    if (session?.user) {
      setPlan((session.user as any).plan || 'free');
    }
  }, [session]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  const isMarketingPage =
    pathname === '/' || pathname === '/pricing' || pathname === '/privacy' || pathname === '/terms' || pathname === '/login';

  // If on marketing / legal / login pages, hide the dashboard sidebar
  if (isMarketingPage) return null;

  return (
    <>
      {/* 1. DESKTOP PERMANENT SIDEBAR (Screens >= 1024px) */}
      <aside className="hidden lg:flex w-64 bg-[#0d121f] border-r border-slate-800/80 flex-col h-screen sticky top-0 z-30 shadow-2xl flex-shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/generator" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <LinkedinIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base leading-tight block">
                  LinkedIn Studio
                </span>
                <span className="text-[9px] uppercase font-mono font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1 py-0.2 rounded">
                  3D
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Dark Creator Studio</span>
            </div>
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 pb-2">
          <Link
            href="/generator"
            className="w-full btn-3d-primary flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Post Draft</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Studio Workflows
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-cyan-400 border border-blue-500/30 shadow-lg shadow-blue-900/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase font-mono font-black px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account & Plan Banner */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090d16] space-y-2">
          {plan === 'free' && (
            <div className="p-3 bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800/40 text-white rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Free Tier</span>
                <span className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                  15 Posts/Mo
                </span>
              </div>
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="w-full py-1.5 px-2.5 rounded-xl btn-3d-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span>Upgrade to Pro</span>
              </button>
            </div>
          )}

          {status === 'authenticated' ? (
            <div className="flex items-center justify-between px-2 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a66c2] to-cyan-500 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                    {session?.user?.name ? session.user.name[0] : 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-bold text-slate-200 block truncate text-xs">
                    {session?.user?.name || 'Creator'}
                  </span>
                  <span className="text-[10px] text-cyan-400 capitalize font-medium">
                    {plan} Plan
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full py-2.5 px-3 rounded-2xl btn-3d-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Studio</span>
            </Link>
          )}
        </div>
      </aside>

      {/* 2. MOBILE & TABLET SLIDE-OUT DRAWER OVERLAY (Screens < 1024px) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#0d121f] border-r border-slate-800/80 h-full flex flex-col z-50 shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <Link
                href="/generator"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-sm">LinkedIn Studio</span>
              </Link>

              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Button */}
            <div className="p-3">
              <Link
                href="/generator"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full btn-3d-primary flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-white font-bold text-xs shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Post Draft</span>
              </Link>
            </div>

            {/* Nav list */}
            <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] uppercase font-mono font-black px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer in drawer */}
            <div className="p-3 border-t border-slate-800 bg-[#090d16] space-y-2">
              {status === 'authenticated' ? (
                <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="User"
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {session?.user?.name ? session.user.name[0] : 'U'}
                      </div>
                    )}
                    <span className="font-bold text-slate-200 truncate text-xs">
                      {session?.user?.name || 'Creator'}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-1 rounded text-slate-400 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-2 px-3 rounded-xl btn-3d-primary text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SLEEK 3D MOBILE BOTTOM NAVIGATION BAR (Screens < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d121f]/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        <Link
          href="/generator"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
            pathname === '/generator' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generator</span>
        </Link>

        <Link
          href="/templates"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
            pathname === '/templates' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Templates</span>
        </Link>

        <Link
          href="/voice"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
            pathname === '/voice' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice DNA</span>
        </Link>

        <Link
          href="/calendar"
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
            pathname === '/calendar' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendar</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentPlan={plan}
      />
    </>
  );
}
