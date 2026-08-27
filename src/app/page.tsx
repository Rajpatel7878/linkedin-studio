'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
  Mic,
  FileText,
  Image as ImageIcon,
  Calendar,
  BarChart3,
  Star,
  Check,
  HelpCircle,
  Clock,
  Layers,
  Flame,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { PLANS } from '@/config/plans';

export default function LandingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');
  const [demoTopic, setDemoTopic] = useState('Why good founders write memos instead of 40-slide decks');
  const [activeAngle, setActiveAngle] = useState<'story' | 'listicle' | 'bold'>('bold');

  const demoOutputs = {
    bold: `Unpopular opinion: Slide decks hide weak thinking behind bullet points and animations.\n\nMemos force clarity of thought:\n→ Problem definition\n→ Assumptions tested\n→ Quantitative impact\n→ Trade-offs accepted\n\nIf you cannot write it clearly in 2 pages, you do not understand the problem yet.\n\nAgree or disagree? #Leadership #Strategy #Founders`,
    listicle: `5 non-obvious rules for scaling engineering velocity (bookmark this): 🧠\n\n1️⃣ Replace 30-min status meetings with 2-min async memos\n2️⃣ Measure shipped impact, not green Slack dots\n3️⃣ Protect 4-hour focus blocks every morning\n4️⃣ Share messy learnings, not just the highlights\n5️⃣ Keep team sizes under 6 engineers\n\nWhich of these 5 is your team implementing? #Engineering #Productivity`,
    story: `3 years ago, I gave a 40-slide pitch that almost lost us our biggest enterprise client:\n\nI was rambling through animations and buzzwords.\n\nThe CEO stopped me on slide 6 and said: "Write me a 1-page memo on what actually changes for our bottom line."\n\nThat uncomfortable feedback transformed how we communicate.\n\nHave you ever had to unlearn a bad corporate habit? What was your turning point? #FounderLessons`,
  };

  const faqs = [
    {
      q: 'How does Voice Matching work?',
      a: 'You paste in 3–5 of your real past LinkedIn posts. Our AI extracts your stylistic DNA (sentence length, emoji density, hook style, and vocabulary) and uses it as few-shot context so every post sounds authentically like you.',
    },
    {
      q: 'Does it publish directly to my personal LinkedIn profile?',
      a: 'Yes! We use LinkedIn’s official Share on LinkedIn API via secure OAuth 2.0. Your tokens are encrypted with AES-256-GCM at rest, and we respect all API rate limits automatically.',
    },
    {
      q: 'Can I use this for free?',
      a: 'Yes! Our Starter Free plan includes 15 post generations per month, 5 scheduled posts, and access to all 8 prebuilt content templates without needing a credit card.',
    },
    {
      q: 'What happens if I hit LinkedIn API rate limits?',
      a: 'Unlike other tools that fail silently, our intelligent background dispatcher automatically detects rate limits, transitions your post to a queued state, and safely retries on schedule.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-20 text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0a66c2] text-xs font-bold shadow-2xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#0a66c2]" />
          <span>The Next-Gen AI Content Studio for LinkedIn</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
          Write Viral LinkedIn Posts in{' '}
          <span className="text-[#0a66c2] underline decoration-blue-200 decoration-wavy decoration-2">
            Your Authentic Voice
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The all-in-one studio for founders, creators, and executives. Turn rough ideas into high-converting posts, visual graphic cards, and automated schedules in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Creating for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold border border-slate-300 shadow-2xs transition-all"
          >
            View Pricing & Plans
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Official LinkedIn API
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Setup in 2 minutes
          </span>
        </div>
      </section>

      {/* 2. Interactive Live Studio Preview */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="font-bold text-slate-700 ml-2">Interactive Studio Demo</span>
            </div>

            {/* Angle Switcher */}
            <div className="flex items-center bg-slate-200 p-1 rounded-xl font-bold">
              <button
                onClick={() => setActiveAngle('bold')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeAngle === 'bold' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                🔥 Bold Hook
              </button>
              <button
                onClick={() => setActiveAngle('listicle')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeAngle === 'listicle' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                🔢 Listicle & Bullets
              </button>
              <button
                onClick={() => setActiveAngle('story')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeAngle === 'story' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                📖 Story Narrative
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Prompt Input Box */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Test Any Topic or Idea:</label>
                <textarea
                  rows={4}
                  value={demoTopic}
                  onChange={(e) => setDemoTopic(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-2 text-slate-700">
                <div className="font-bold text-[#0a66c2] flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Matching Active</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Injects your 1-sentence paragraph cadence, bold contrarian openings, and arrow bullet points.
                </p>
              </div>
            </div>

            {/* Live Feed Output */}
            <div className="md:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm">
                  AR
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Alex Rivera</span>
                  <span className="text-[11px] text-slate-500">Founder & Tech Strategist • Just now</span>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans">
                {demoOutputs[activeAngle]}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hook Score: <strong className="text-emerald-600 font-mono">92/100 (Viral)</strong></span>
                <span>Above-the-fold Cutoff: <strong className="text-blue-600 font-mono">148 / 210 chars</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Feature Pillars Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0a66c2] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            Full Content Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need to Dominate LinkedIn
          </h2>
          <p className="text-sm text-slate-500">
            A complete suite of creator tools designed specifically for LinkedIn’s unique engagement algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0a66c2] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Angle Post Generator</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate 3 distinct variations per topic: Storytelling Narrative, Listicle & Bullets, and Bold Scroll-Stopping Hook.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Few-Shot Voice Cloner</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste 3–5 real past posts. The AI extracts sentence length, emoji frequency, and vocabulary to replicate your exact tone.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">8 Proven Content Templates</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prebuilt structures for intros, career milestones, lesson learned stories, hot takes, build-in-public metrics, and case studies.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hook & Readability Inspector</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live Hook Strength scoring (0–100), 3 alternative hook rewrites, corporate jargon flags, and ranked hashtag suggestions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Visual Headline & Stat Cards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate branded quote and stat graphic cards with 6 theme presets. Export as PNG or attach directly to posts.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Official LinkedIn Scheduler</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official OAuth 2.0 publishing with automated rate-limit detection and auto-retry queueing instead of silent failures.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0a66c2] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Plans for Creators at Every Stage
          </h2>
          <p className="text-sm text-slate-500">
            Start for free and upgrade whenever you are ready for unlimited generation.
          </p>

          <div className="pt-2 flex items-center justify-center">
            <div className="bg-slate-200/70 p-1 rounded-2xl inline-flex items-center text-xs font-bold text-slate-700">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  billingInterval === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('annual')}
                className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  billingInterval === 'annual' ? 'bg-[#0a66c2] text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-black">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Free */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{PLANS.free.name}</h3>
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
              Start Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-blue-50/70 to-white rounded-3xl border-2 border-[#0a66c2] p-8 flex flex-col justify-between shadow-xl shadow-blue-500/10 relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0a66c2] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
              Most Popular
            </span>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{PLANS.pro.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{PLANS.pro.description}</p>
              </div>
              <div className="flex items-baseline gap-1 text-slate-900">
                <span className="text-5xl font-black">
                  ${billingInterval === 'annual' ? PLANS.pro.priceAnnual : PLANS.pro.priceMonthly}
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
              Get Started with Pro
            </Link>
          </div>

          {/* Team */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{PLANS.team.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{PLANS.team.description}</p>
              </div>
              <div className="flex items-baseline gap-1 text-slate-900">
                <span className="text-5xl font-black">
                  ${billingInterval === 'annual' ? PLANS.team.priceAnnual : PLANS.team.priceMonthly}
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
              Get Team Plan
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about the product.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0a66c2] flex-shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-200 pt-12 text-xs text-slate-500 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white font-bold">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">LinkedIn Studio</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 border-t border-slate-100 pt-6">
          © {new Date().getFullYear()} LinkedIn Studio SaaS. All rights reserved. Not affiliated with LinkedIn Corporation.
        </div>
      </footer>
    </div>
  );
}
