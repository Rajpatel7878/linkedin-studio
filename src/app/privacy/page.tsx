import React from 'react';
import Link from 'next/link';
import { Shield, AlertCircle } from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';

export default function PrivacyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Lawyer Review Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Notice to Operators: Template Policy</span>
          <p className="leading-relaxed text-amber-300/80">
            This Privacy Policy is a comprehensive template tailored for GDPR and CCPA compliance. Please have qualified legal counsel review and adapt this document to your specific corporate jurisdiction prior to public commercial operation.
          </p>
        </div>
      </div>

      <Card3D depth={5} className="glass-panel-3d rounded-3xl border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-6 text-slate-300 text-sm leading-relaxed">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: August 28, 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When you create an account on LinkedIn Studio, we collect your name, email address, and profile picture via Google OAuth 2.0. If you choose to connect your LinkedIn account, we receive authorization tokens necessary to publish and schedule posts on your behalf.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Security & Token Encryption</h2>
          <p>
            All third-party access and refresh tokens (including LinkedIn OAuth credentials) are encrypted at rest using AES-256-GCM encryption. We do not store plaintext access tokens or unauthorized personal data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Artificial Intelligence & Data Usage</h2>
          <p>
            Topic inputs, draft texts, and few-shot voice samples are processed through our AI providers (Google Gemini or OpenAI) solely for the purpose of generating drafts and analyzing readability. Your private drafts are never used to train generalized foundation models without your explicit opt-in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. GDPR Rights & Data Portability</h2>
          <p>
            Under GDPR and CCPA, you retain full rights over your data. You may download a complete JSON archive of all your drafts, voice profiles, and metrics via <strong className="text-white">Settings &rarr; Export Data</strong>, or permanently delete your account and all associated records via <strong className="text-white">Settings &rarr; Delete Account</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Contact Information</h2>
          <p>
            For privacy inquiries or compliance requests, contact our Data Protection Officer at{' '}
            <span className="text-cyan-400 font-semibold">privacy@linkedinstudio.ai</span>.
          </p>
        </section>
      </Card3D>
    </div>
  );
}
