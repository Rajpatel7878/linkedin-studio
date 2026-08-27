'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Sparkles,
  Zap,
  CheckCircle2,
  Check,
  ExternalLink,
  Shield,
  ArrowRight,
  Loader2,
  QrCode,
  Clock,
} from 'lucide-react';
import { PLANS, getPlanConfig } from '@/config/plans';
import { UpgradeModal } from '@/components/billing/UpgradeModal';

export default function BillingPage() {
  const [userData, setUserData] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const fetchBilling = async () => {
    try {
      const [settingsRes, analyticsRes, txRes] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/analytics').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/billing/transactions').then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (settingsRes?.success) setUserData(settingsRes.user);
      if (analyticsRes?.success) setUsageData(analyticsRes.summary?.usage);
      if (txRes?.success) setTransactions(txRes.transactions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleOpenStripePortal = async () => {
    setIsOpeningPortal(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpeningPortal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  const currentPlan = getPlanConfig(userData?.plan || 'free');
  const genMax = currentPlan?.limits?.postsGeneratedPerMonth ?? 15;
  const genUsed = usageData?.postsGenerated || 0;
  const genPct = genMax === -1 ? 100 : Math.min(100, Math.round((genUsed / Math.max(1, genMax)) * 100));

  const pubMax = currentPlan?.limits?.postsPublishedPerMonth ?? 5;
  const pubUsed = usageData?.postsPublished || 0;
  const pubPct = pubMax === -1 ? 100 : Math.min(100, Math.round((pubUsed / Math.max(1, pubMax)) * 100));

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-[#0a66c2]" />
          Subscription & Usage Metering
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your active tier, track monthly post generation quotas, and view payment history.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-[#0a66c2] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full">
              Active Subscription
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {currentPlan.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentPlan.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userData?.plan === 'free' ? (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade Plan</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUpgradeOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Switch / Extend Plan</span>
                </button>

                <button
                  onClick={handleOpenStripePortal}
                  disabled={isOpeningPortal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isOpeningPortal ? 'Loading...' : 'Stripe Portal'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Usage Progress Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Post Generations Meter */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Post Generations</span>
              <span className="font-mono">
                {genUsed} / {genMax === -1 ? '∞ Unlimited' : `${genMax} this month`}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${genMax === -1 ? 100 : genPct}%` }}
                className={`h-full rounded-full transition-all ${
                  genPct >= 90 && genMax !== -1 ? 'bg-red-500' : 'bg-[#0a66c2]'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Resets automatically at the start of each billing period.
            </p>
          </div>

          {/* Posts Published Meter */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Scheduled & Published Posts</span>
              <span className="font-mono">
                {pubUsed} / {pubMax === -1 ? '∞ Unlimited' : `${pubMax} this month`}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${pubMax === -1 ? 100 : pubPct}%` }}
                className={`h-full rounded-full transition-all ${
                  pubPct >= 90 && pubMax !== -1 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Covers automated scheduler dispatch & live posts.
            </p>
          </div>
        </div>

        {/* Plan Features Checklist */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-3">
            Included in your {currentPlan.name}:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            {currentPlan.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direct Payment History Table */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Direct Payment & Transaction History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Plan Tier</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Reference / UTR</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 capitalize">
                      {tx.planId} ({tx.interval})
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 font-semibold">
                      {tx.transactionRef}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {tx.currency === 'INR' ? '₹' : '$'}{tx.amount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentPlan={userData?.plan}
        onUpgraded={fetchBilling}
      />
    </div>
  );
}
