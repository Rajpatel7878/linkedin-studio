'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Loader2,
  QrCode,
  CreditCard,
  Copy,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { PLANS } from '@/config/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onUpgraded?: () => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan = 'free',
  onUpgraded,
}: UpgradeModalProps) {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr'>('qr');
  const [selectedPlanId, setSelectedPlanId] = useState<'pro' | 'team'>('pro');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // QR Payment State
  const [qrConfig, setQrConfig] = useState<any>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmittingQr, setIsSubmittingQr] = useState(false);
  const [qrSuccess, setQrSuccess] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/billing/qr-config')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setQrConfig(d.config);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStripeCheckout = async (planId: 'pro' | 'team') => {
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(null);
    }
  };

  const calculateAmount = (planId: 'pro' | 'team') => {
    if (!qrConfig) return { inr: 799, usd: 24 };
    if (planId === 'pro') {
      return {
        inr: interval === 'annual' ? (qrConfig.inrProAnnual ?? 799) : (qrConfig.inrProMonthly ?? 999),
        usd: interval === 'annual' ? (qrConfig.usdProAnnual ?? 24) : (qrConfig.usdProMonthly ?? 29),
      };
    } else {
      return {
        inr: interval === 'annual' ? (qrConfig.inrTeamAnnual ?? 2499) : (qrConfig.inrTeamMonthly ?? 2999),
        usd: interval === 'annual' ? (qrConfig.usdTeamAnnual ?? 65) : (qrConfig.usdTeamMonthly ?? 79),
      };
    }
  };

  const currentAmount = calculateAmount(selectedPlanId);

  const handleCopyUpi = () => {
    if (qrConfig?.upiId) {
      navigator.clipboard.writeText(qrConfig.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleQrPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setQrError('Please enter your 12-digit UTR / Reference ID from your payment app.');
      return;
    }

    setIsSubmittingQr(true);
    setQrError(null);
    setQrSuccess(null);

    try {
      const res = await fetch('/api/billing/qr-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          interval,
          amount: currentAmount.inr,
          currency: qrConfig?.currency || 'INR',
          transactionRef: transactionRef.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQrSuccess(data.message || 'Payment verified! Plan is now active.');
        setTimeout(() => {
          if (onUpgraded) onUpgraded();
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        setQrError(data.error || 'Failed to verify transaction ID.');
      }
    } catch (e: any) {
      setQrError(e.message || 'Submission error');
    } finally {
      setIsSubmittingQr(false);
    }
  };

  // Build dynamic QR Image URL embedding the exact plan amount
  const getDynamicQrUrl = () => {
    if (qrConfig?.qrCodeImageUrl && !qrConfig.qrCodeImageUrl.includes('api.qrserver.com')) {
      return qrConfig.qrCodeImageUrl;
    }
    const upiId = qrConfig?.upiId || 'creator@upi';
    const amount = currentAmount.inr;
    const name = encodeURIComponent(qrConfig?.accountName || 'LinkedIn Studio');
    const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${name}&am=${amount}&cu=INR&tn=LinkedInStudio_${selectedPlanId.toUpperCase()}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiPayload)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-panel-3d rounded-3xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[94vh] overflow-y-auto p-6 sm:p-8 animate-scale-up relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
          <span className="glass-badge-3d inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-cyan-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Upgrade Content Studio
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Choose Your Plan & Payment Method
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pay securely with Credit Card or scan the Payment QR code to pay directly to our account.
          </p>

          {/* Payment Method Switcher Tabs */}
          <div className="pt-3 flex items-center justify-center gap-3">
            <div className="glass-panel-3d p-1 rounded-2xl inline-flex items-center text-xs font-bold border border-slate-700">
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  paymentMethod === 'qr'
                    ? 'bg-[#0a66c2] text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Scan & Pay (QR / UPI)</span>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-black">
                  Instant
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-[#0a66c2] text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card (Stripe)</span>
              </button>
            </div>
          </div>

          {/* Billing Interval Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl inline-flex items-center text-xs font-semibold text-slate-400">
              <button
                type="button"
                onClick={() => setInterval('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  interval === 'monthly' ? 'bg-[#0a66c2] text-white font-bold' : ''
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setInterval('annual')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  interval === 'annual' ? 'bg-[#0a66c2] text-white font-bold' : ''
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* METHOD 1: SCAN & PAY QR CODE */}
        {paymentMethod === 'qr' ? (
          <div className="space-y-6">
            {/* Plan Tier Selector Bar */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setSelectedPlanId('pro')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  selectedPlanId === 'pro'
                    ? 'border-cyan-500/80 bg-blue-950/60 ring-1 ring-cyan-500 shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-white block">Pro Creator Tier</span>
                <span className="text-lg font-black text-cyan-300">
                  ₹{interval === 'annual' ? (qrConfig?.inrProAnnual ?? 799) : (qrConfig?.inrProMonthly ?? 999)}
                </span>
                <span className="text-[10px] text-slate-400 block">/ month</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlanId('team')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  selectedPlanId === 'team'
                    ? 'border-purple-500/80 bg-purple-950/60 ring-1 ring-purple-500 shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-white block">Team Agency Tier</span>
                <span className="text-lg font-black text-purple-300">
                  ₹{interval === 'annual' ? (qrConfig?.inrTeamAnnual ?? 2499) : (qrConfig?.inrTeamMonthly ?? 2999)}
                </span>
                <span className="text-[10px] text-slate-400 block">/ month</span>
              </button>
            </div>

            {/* Error or Success Alerts */}
            {qrError && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{qrError}</span>
              </div>
            )}

            {qrSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{qrSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Dynamic QR Card (5 cols) */}
              <div className="md:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-center space-y-3 shadow-inner">
                <div className="inline-flex p-3 bg-white rounded-2xl shadow-md mx-auto">
                  <img
                    src={getDynamicQrUrl()}
                    alt="Payment QR Code"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-200 block">
                    Amount to Pay:{' '}
                    <strong className="text-emerald-400 font-black text-sm">
                      ₹{interval === 'annual' ? currentAmount.inr * 12 : currentAmount.inr}
                    </strong>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      ({interval === 'annual' ? '₹' + currentAmount.inr + '/mo billed annually' : 'Monthly'})
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Account: <strong className="text-white">{qrConfig?.accountName || 'LinkedIn Studio'}</strong>
                  </span>
                </div>
              </div>

              {/* Right Steps & UTR Form (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                    Step 1: Scan & Pay
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Scan using <strong>Google Pay, PhonePe, Paytm, BHIM, or any Banking App</strong>.
                  </p>
                </div>

                {/* Copy UPI Handle Box */}
                {qrConfig?.upiId && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">UPI ID / Handle</span>
                      <span className="font-mono font-bold text-cyan-300 block">{qrConfig.upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="btn-3d-glass flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-200 font-bold text-xs"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Step 2 Form */}
                <form onSubmit={handleQrPaymentSubmit} className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      Step 2: Enter Transaction ID / UTR
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Copy the 12-digit UTR/Ref number from your payment confirmation screen.
                    </p>
                  </div>

                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. 423891029384 or Ref ID"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 font-mono text-white focus:outline-hidden focus:border-cyan-400"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingQr || !transactionRef.trim()}
                    className="btn-3d-primary w-full py-3 px-4 rounded-xl text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isSubmittingQr ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Activating Access...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-cyan-200" />
                        <span>Verify & Activate {selectedPlanId.toUpperCase()} Plan</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* METHOD 2: STRIPE CARD CHECKOUT */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pro Plan */}
            <div className="rounded-3xl border-2 border-cyan-500/80 glass-panel-3d p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 left-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] uppercase font-black tracking-wider px-3 py-0.5 rounded-full shadow-md">
                Most Popular ⭐
              </span>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{PLANS.pro.name}</h3>
                  <p className="text-xs text-slate-300">{PLANS.pro.description}</p>
                </div>

                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-black text-cyan-300">
                    ${interval === 'annual' ? PLANS.pro.priceAnnual : PLANS.pro.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                  {interval === 'annual' && (
                    <span className="text-[11px] text-emerald-400 font-bold ml-1">
                      (billed annually)
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-700 text-xs">
                  {PLANS.pro.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-200">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStripeCheckout('pro')}
                disabled={loadingPlan !== null}
                className="mt-6 btn-3d-primary w-full py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-60"
              >
                {loadingPlan === 'pro' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                )}
                <span>{currentPlan === 'pro' ? 'Current Plan' : 'Pay via Stripe (Card)'}</span>
              </button>
            </div>

            {/* Team Plan */}
            <div className="rounded-3xl border border-slate-800 glass-panel-3d p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{PLANS.team.name}</h3>
                  <p className="text-xs text-slate-400">{PLANS.team.description}</p>
                </div>

                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-black text-purple-300">
                    ${interval === 'annual' ? PLANS.team.priceAnnual : PLANS.team.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                  {interval === 'annual' && (
                    <span className="text-[11px] text-emerald-400 font-bold ml-1">
                      (billed annually)
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                  {PLANS.team.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-300">
                      <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStripeCheckout('team')}
                disabled={loadingPlan !== null}
                className="mt-6 btn-3d-glass w-full py-3 px-4 rounded-xl text-purple-300 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-60"
              >
                {loadingPlan === 'team' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{currentPlan === 'team' ? 'Current Plan' : 'Pay via Stripe (Card)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
