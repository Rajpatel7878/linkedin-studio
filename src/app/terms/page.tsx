import React from 'react';
import { AlertCircle, FileCheck } from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';

export default function TermsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Lawyer Review Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Notice to Operators: Template Terms</span>
          <p className="leading-relaxed text-amber-300/80">
            These Terms of Service are a template standard for SaaS platforms. Please have qualified legal counsel review and customize these terms according to your jurisdiction and governing laws.
          </p>
        </div>
      </div>

      <Card3D depth={5} className="glass-panel-3d rounded-3xl border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-6 text-slate-300 text-sm leading-relaxed">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: August 28, 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using LinkedIn Studio (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, you must discontinue use of the Service immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Description of Service & Billing</h2>
          <p>
            LinkedIn Studio provides AI-assisted content drafting, voice matching, visual card generation, and scheduling tools. Subscriptions are billed on a recurring monthly or annual basis via Stripe. You may cancel at any time through the Billing Portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. User Conduct & LinkedIn Compliance</h2>
          <p>
            You agree to comply with all LinkedIn Developer and Platform Policies. You are solely responsible for all content published through your account. Spamming, harassment, or violating third-party intellectual property is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Intellectual Property & Output Ownership</h2>
          <p>
            You own all prompts, voice samples, and generated post outputs created through your account. LinkedIn Studio claims no intellectual property ownership over your content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranty of any kind. LinkedIn Studio shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the platform.
          </p>
        </section>
      </Card3D>
    </div>
  );
}
