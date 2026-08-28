'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, ArrowRight, Shield } from 'lucide-react';
import { PLANS } from '@/config/plans';
import { Card3D } from '@/components/ui/Card3D';

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Pricing Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="glass-badge-3d inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-cyan-300 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          Transparent, Predictable Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Simple Plans for High-Agency Creators & Teams
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Start free with no credit card required. Upgrade whenever you need unlimited scale.
        </p>

        {/* Toggle */}
        <div className="pt-4 flex items-center justify-center">
          <div className="glass-panel-3d p-1 rounded-2xl inline-flex items-center text-xs font-bold border border-slate-700">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-5 py-2 rounded-xl transition-all ${
                interval === 'monthly' ? 'bg-[#0a66c2] text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setInterval('annual')}
              className={`px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                interval === 'annual' ? 'bg-[#0a66c2] text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Free */}
        <Card3D depth={8} className="glass-panel-3d border border-slate-800 p-8 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">{PLANS.free.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{PLANS.free.description}</p>
            </div>
            <div className="text-4xl font-black text-white">$0</div>
            <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
              {PLANS.free.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-300">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="mt-8 w-full py-3 rounded-xl btn-3d-glass text-center font-bold text-xs text-slate-200 block"
          >
            Get Started Free
          </Link>
        </Card3D>

        {/* Pro */}
        <Card3D
          depth={15}
          glowColor="rgba(10, 102, 194, 0.45)"
          className="glass-panel-3d border-2 border-cyan-500/80 p-8 flex flex-col justify-between shadow-2xl relative"
        >
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
            Most Popular ⭐
          </span>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">{PLANS.pro.name}</h2>
              <p className="text-xs text-slate-300 mt-1">{PLANS.pro.description}</p>
            </div>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black text-cyan-300">
                ${interval === 'annual' ? PLANS.pro.priceAnnual : PLANS.pro.priceMonthly}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ month</span>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-700 text-xs">
              {PLANS.pro.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-200">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="mt-8 w-full py-3.5 rounded-xl btn-3d-primary text-white font-bold text-xs text-center shadow-lg block active:scale-98"
          >
            Start Pro 7-Day Trial
          </Link>
        </Card3D>

        {/* Team */}
        <Card3D depth={8} className="glass-panel-3d border border-slate-800 p-8 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">{PLANS.team.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{PLANS.team.description}</p>
            </div>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black text-purple-300">
                ${interval === 'annual' ? PLANS.team.priceAnnual : PLANS.team.priceMonthly}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ month</span>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
              {PLANS.team.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-300">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="mt-8 w-full py-3 rounded-xl btn-3d-glass text-purple-300 text-center font-bold text-xs block"
          >
            Contact Team Sales
          </Link>
        </Card3D>
      </div>
    </div>
  );
}
