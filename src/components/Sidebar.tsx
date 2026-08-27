'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Sparkles,
  FileText,
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
} from 'lucide-react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { UpgradeModal } from './billing/UpgradeModal';

const NAV_ITEMS = [
  {
    label: 'Post Generator',
    href: '/generator',
    icon: Sparkles,
    badge: 'AI',
  },
  {
    label: 'Content Templates',
    href: '/templates',
    icon: FileText,
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
  const { data: session } = useSession();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [plan, setPlan] = useState<string>('free');

  useEffect(() => {
    if (session?.user) {
      setPlan((session.user as any).plan || 'free');
    }
  }, [session]);

  const isMarketingPage =
    pathname === '/' || pathname === '/pricing' || pathname === '/privacy' || pathname === '/terms' || pathname === '/login';

  // If on marketing / legal / login pages, hide the dashboard sidebar
  if (isMarketingPage) return null;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-30 shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/generator" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <LinkedinIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base leading-tight block">
              LinkedIn Studio
            </span>
            <span className="text-xs text-slate-500 font-medium">SaaS Platform</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 pb-2">
        <Link
          href="/generator"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Post Draft</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Studio Workflows
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-[#0a66c2] font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0a66c2]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-100 text-[#0a66c2]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Account & Plan Banner */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        {plan === 'free' && (
          <div className="p-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-200">Free Tier</span>
              <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                15 Posts/Mo
              </span>
            </div>
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-white text-[#0a66c2] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        )}

        {/* User Card */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {session?.user?.name ? session.user.name[0] : 'U'}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-slate-800 block truncate text-xs">
                {session?.user?.name || 'Alex Rivera'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-medium">
                {plan} Plan
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentPlan={plan}
      />
    </aside>
  );
}
