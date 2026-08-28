'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Linkedin,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Download,
  Trash2,
  ExternalLink,
  User,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { Card3D } from '@/components/ui/Card3D';
import Link from 'next/link';

export default function SettingsPage() {
  const [account, setAccount] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(true);
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');

  // Payment QR Config State
  const [qrConfig, setQrConfig] = useState<any>({
    qrCodeImageUrl: '',
    upiId: '',
    accountName: '',
    currency: 'INR',
    inrProMonthly: 999,
    inrProAnnual: 799,
    inrTeamMonthly: 2999,
    inrTeamAnnual: 2499,
    instructions: '',
  });

  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [qrSaveStatus, setQrSaveStatus] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const redirectUri = 'https://linkedin-studio-gules.vercel.app/api/auth/linkedin/callback';

  const fetchSettings = async () => {
    try {
      const [settingsRes, qrRes] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/billing/qr-config').then((r) => r.json()),
      ]);

      if (settingsRes.success) {
        setUserData(settingsRes.user);
        setAccount(settingsRes.account);
        setIsSandboxMode(settingsRes.account?.isSandboxMode ?? true);
        setName(settingsRes.account?.name || '');
        setHeadline(settingsRes.account?.headline || '');
      }

      if (qrRes.success && qrRes.config) {
        setQrConfig(qrRes.config);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAccountProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          headline,
          isSandboxMode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('Settings updated successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (e) {
      setSaveStatus('Failed to update settings');
    }
  };

  const handleSaveQrConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrSaveStatus('Saving QR payment settings...');
    try {
      const res = await fetch('/api/billing/qr-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qrConfig),
      });
      const data = await res.json();
      if (data.success) {
        setQrConfig(data.config);
        setQrSaveStatus('Payment QR settings updated successfully!');
        setTimeout(() => setQrSaveStatus(null), 3000);
      }
    } catch (e) {
      setQrSaveStatus('Failed to update QR settings');
    }
  };

  const handleToggleSandbox = async () => {
    const nextVal = !isSandboxMode;
    setIsSandboxMode(nextVal);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isSandboxMode: nextVal }),
    });
  };

  const handleExportData = () => {
    window.location.href = '/api/user/export';
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setDeleteError('Please type exact confirmation phrase: DELETE MY ACCOUNT');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmText }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/';
      } else {
        setDeleteError(data.error || 'Failed to delete account');
      }
    } catch (e: any) {
      setDeleteError(e.message || 'Deletion error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-400" />
          Account & Payment Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your direct Payment QR code / UPI handle, LinkedIn OAuth connection, and GDPR compliance.
        </p>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-blue-950/80 text-cyan-300 border border-blue-500/40 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* 1. Direct QR Code & UPI Payment Settings (FOR OWNER / ADMIN) */}
      <Card3D depth={8} className="glass-panel-3d rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Direct Payment QR Code & UPI Settings
              </h2>
              <p className="text-xs text-slate-400">
                Receive direct subscription payments to your own UPI ID or bank account
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold px-3 py-1 rounded-full">
            Direct Account Settlement
          </span>
        </div>

        {qrSaveStatus && (
          <div className="p-3.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{qrSaveStatus}</span>
          </div>
        )}

        <form onSubmit={handleSaveQrConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Your UPI ID / Payment Handle
              </label>
              <input
                type="text"
                value={qrConfig.upiId || ''}
                onChange={(e) => setQrConfig({ ...qrConfig, upiId: e.target.value })}
                placeholder="e.g. yourname@okaxis or pay@company"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 font-mono text-cyan-300 focus:outline-hidden focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Automatic QR code will be generated for GPay, PhonePe, Paytm, and BHIM.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Merchant / Account Holder Name
              </label>
              <input
                type="text"
                value={qrConfig.accountName || ''}
                onChange={(e) => setQrConfig({ ...qrConfig, accountName: e.target.value })}
                placeholder="e.g. Alex Rivera or Company Name"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Custom Payment QR Code Image URL (Optional)
            </label>
            <input
              type="text"
              value={qrConfig.qrCodeImageUrl || ''}
              onChange={(e) => setQrConfig({ ...qrConfig, qrCodeImageUrl: e.target.value })}
              placeholder="https://... (Leave blank to auto-generate dynamic QR from UPI ID)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 font-mono text-cyan-300 focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Pricing Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pro Monthly (₹ INR)
              </label>
              <input
                type="number"
                value={qrConfig.inrProMonthly || 999}
                onChange={(e) => setQrConfig({ ...qrConfig, inrProMonthly: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-slate-900 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pro Annual / mo (₹ INR)
              </label>
              <input
                type="number"
                value={qrConfig.inrProAnnual || 799}
                onChange={(e) => setQrConfig({ ...qrConfig, inrProAnnual: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-slate-900 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Team Monthly (₹ INR)
              </label>
              <input
                type="number"
                value={qrConfig.inrTeamMonthly || 2999}
                onChange={(e) => setQrConfig({ ...qrConfig, inrTeamMonthly: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-slate-900 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Team Annual / mo (₹ INR)
              </label>
              <input
                type="number"
                value={qrConfig.inrTeamAnnual || 2499}
                onChange={(e) => setQrConfig({ ...qrConfig, inrTeamAnnual: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-slate-900 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-3d-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md active:scale-95"
            >
              Save Payment QR Settings
            </button>
          </div>
        </form>
      </Card3D>

      {/* 2. User Account Overview */}
      <Card3D depth={8} className="glass-panel-3d rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          User Profile & Subscription
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Account Email</span>
            <span className="font-bold text-white text-sm">{userData?.email}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Active Tier</span>
              <span className="font-bold text-cyan-300 text-sm capitalize">{userData?.plan} Plan</span>
            </div>
            <Link
              href="/billing"
              className="text-cyan-400 hover:underline font-bold text-xs"
            >
              Manage Subscription &rarr;
            </Link>
          </div>
        </div>
      </Card3D>

      {/* 3. LinkedIn OAuth Connection & Sandbox Toggle */}
      <Card3D depth={8} className="glass-panel-3d rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LinkedinIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                LinkedIn Official OAuth 2.0 Connection
              </h2>
              <p className="text-xs text-slate-400">
                Official Share on LinkedIn API integration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSandbox}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              isSandboxMode
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isSandboxMode ? 'Sandbox Mode (Active)' : 'Live Production API'}
          </button>
        </div>

        {/* Sandbox Notice */}
        {isSandboxMode && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Sandbox Mode Enabled</span>
            </div>
            <p className="text-amber-300/80 text-[11px] leading-relaxed">
              Sandbox mode simulates LinkedIn OAuth and publishing with zero setup. You can publish, test rate limits, and view analytics immediately.
            </p>
          </div>
        )}

        {/* 1-Click Connect LinkedIn Account Banner */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-bold text-xs text-white block">
              {account?.isConnected ? 'LinkedIn Account Connected ✅' : 'Connect LinkedIn Account'}
            </span>
            <p className="text-[11px] text-slate-400">
              Authorize LinkedIn Studio to publish and schedule posts directly to your profile.
            </p>
          </div>

          <a
            href="/api/auth/linkedin/authorize"
            className="btn-3d-primary px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span>{account?.isConnected ? 'Reconnect LinkedIn Profile' : 'Connect LinkedIn Profile'}</span>
          </a>
        </div>

        <form onSubmit={handleSaveAccountProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Display Author Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Author Headline / Title
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Authorized Redirect URI (for LinkedIn Developer Portal)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={redirectUri}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 font-mono text-cyan-300"
              />
              <button
                type="button"
                onClick={handleCopyUri}
                className="btn-3d-glass px-3.5 py-2 rounded-xl text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-3d-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Card3D>

      {/* 4. GDPR Data Portability & Account Deletion */}
      <Card3D depth={8} className="glass-panel-3d rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Privacy & GDPR Data Compliance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Data */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-xs text-white block">
                Export Complete Data Archive
              </span>
              <p className="text-[11px] text-slate-400">
                Download a complete JSON archive containing all your posts, voice profiles, templates, and analytics snapshots.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportData}
              className="btn-3d-glass w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON Archive</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/30 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-xs text-red-300 block">
                Permanent Account Deletion
              </span>
              <p className="text-[11px] text-red-400/80">
                Permanently purge your account, drafts, voice samples, and linked tokens. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-red-900/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </Card3D>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-3d rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-red-500/40">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">Are you absolutely sure?</h3>
              <p className="text-xs text-slate-400">
                This will permanently delete all your drafts, voice profiles, and cancel any active subscriptions.
              </p>
            </div>

            {deleteError && (
              <div className="p-2.5 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-medium">
                {deleteError}
              </div>
            )}

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-300 block">
                Type <span className="font-mono text-red-400">DELETE MY ACCOUNT</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                onClick={handleDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
