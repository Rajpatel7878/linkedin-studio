'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Mic,
  FileText,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [voiceName, setVoiceName] = useState('Bold Founder & Builder');

  const handleConnectLinkedIn = () => {
    // In sandbox / dev mode, simulate instant connection
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isConnected: true, isSandboxMode: true }),
    }).then(() => setStep(2));
  };

  const handleFinish = () => {
    router.push('/generator');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6 animate-scale-up">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-[#0a66c2] text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {step === 1 ? '1' : '✓'}
            </span>
            <span className={step === 1 ? 'text-slate-900 font-bold' : 'text-slate-600'}>
              Connect Profile
            </span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-[#0a66c2] text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Choose Voice
            </span>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0a66c2]/10 text-[#0a66c2] flex items-center justify-center mx-auto">
              <LinkedinIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                Connect Your LinkedIn Account
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Authorize LinkedIn Studio to publish and schedule posts directly to your profile with full rate-limit queueing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-left text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-[#0a66c2]">
                <Shield className="w-4 h-4" />
                <span>Bank-grade token security</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Tokens are encrypted with AES-256-GCM at rest. We never post without your explicit schedule or publish command.
              </p>
            </div>

            <button
              onClick={handleConnectLinkedIn}
              className="w-full py-3 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>Connect with LinkedIn (OAuth 2.0)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <Mic className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Pick Your Signature Voice Style
              </h2>
              <p className="text-xs text-slate-500">
                You can clone your voice from past posts anytime in the studio.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Bold Founder & Builder', desc: 'Direct, contrarian, high-agency, bullet points' },
                { name: 'Warm Mentor & Guide', desc: 'Empathetic, reflective, storytelling, actionable tips' },
                { name: 'Technical Systems Expert', desc: 'Analytical, frameworks, architecture breakdowns' },
              ].map((v) => (
                <button
                  key={v.name}
                  onClick={() => setVoiceName(v.name)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    voiceName === v.name
                      ? 'border-[#0a66c2] bg-blue-50/70 ring-1 ring-[#0a66c2]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{v.name}</span>
                    <span className="text-[11px] text-slate-500">{v.desc}</span>
                  </div>
                  {voiceName === v.name && <CheckCircle2 className="w-4 h-4 text-[#0a66c2] mt-0.5" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
