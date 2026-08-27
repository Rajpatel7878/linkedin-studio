'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, ArrowRight, Shield } from 'lucide-react';
import { PLANS } from '@/config/plans';

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Pricing Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0a66c2] text-xs font-bold border border-blue-200">
          <Zap className="w-3.5 h-3.5" />
          Transparent, Predictable Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Simple Plans for High-Agency Creators & Teams
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Start free with no credit card required. Upgrade whenever you need unlimited scale.
        </p>

        {/* Toggle */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-slate-200/70 p-1 rounded-2xl inline-flex items-center text-xs font-bold text-slate-700">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-5 py-2 rounded-xl transition-all ${
                interval === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setInterval('annual')}
              className={`px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                interval === 'annual' ? 'bg-[#0a66c2] text-white shadow-xs' : 'hover:text-slate-900'
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
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{PLANS.free.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{PLANS.free.description}</p>
            </div>
            <div className="text-4xl font-black text-slate-900">$0</div>
            <div className="space-y-3 pt-6 border-t border-slate-100 text-xs">
              {PLANS.free.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-[#0a66c2] flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="mt-8 w-full py-3 rounded-xl border border-slate-300 text-center font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors block"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro */}
        <div className="bg-gradient-to-b from-blue-50/70 to-white rounded-3xl border-2 border-[#0a66c2] p-8 flex flex-col justify-between shadow-xl shadow-blue-500/10 relative">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0a66c2] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
            Most Popular
          </span>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{PLANS.pro.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{PLANS.pro.description}</p>
            </div>
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-5xl font-black">
                ${interval === 'annual' ? PLANS.pro.priceAnnual : PLANS.pro.priceMonthly}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-100 text-xs">
              {PLANS.pro.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-[#0a66c2] flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="mt-8 w-full py-3.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs text-center shadow-md shadow-blue-500/20 transition-all block active:scale-98"
          >
            Start Pro 7-Day Trial
          </Link>
        </div>

        {/* Team */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{PLANS.team.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{PLANS.team.description}</p>
            </div>
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-5xl font-black">
                ${interval === 'annual' ? PLANS.team.priceAnnual : PLANS.team.priceMonthly}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-100 text-xs">
              {PLANS.team.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="mt-8 w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-center font-bold text-xs transition-colors block"
          >
            Contact Team Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
