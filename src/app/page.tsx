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
  Lightbulb,
  TrendingUp,
  Target,
  Briefcase,
  Users,
  Code2,
  Share2,
  Cpu,
  Compass,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { Card3D } from '@/components/ui/Card3D';
import { PLANS } from '@/config/plans';

export default function LandingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');
  const [demoTopic, setDemoTopic] = useState('Why good founders write memos instead of 40-slide decks');
  const [activeAngle, setActiveAngle] = useState<'bold' | 'listicle' | 'story'>('bold');

  const demoOutputs = {
    bold: `Unpopular opinion: Slide decks hide weak thinking behind bullet points and animations.\n\nMemos force clarity of thought:\n→ Problem definition\n→ Assumptions tested\n→ Quantitative impact\n→ Trade-offs accepted\n\nIf you cannot write it clearly in 2 pages, you do not understand the problem yet.\n\nAgree or disagree? #Leadership #Strategy #Founders`,
    listicle: `5 non-obvious rules for scaling engineering velocity (bookmark this): 🧠\n\n1️⃣ Replace 30-min status meetings with 2-min async memos\n2️⃣ Measure shipped impact, not green Slack dots\n3️⃣ Protect 4-hour focus blocks every morning\n4️⃣ Share messy learnings, not just the highlights\n5️⃣ Keep team sizes under 6 engineers\n\nWhich of these 5 is your team implementing? #Engineering #Productivity`,
    story: `3 years ago, I gave a 40-slide pitch that almost lost us our biggest enterprise client:\n\nI was rambling through animations and buzzwords.\n\nThe CEO stopped me on slide 6 and said: "Write me a 1-page memo on what actually changes for our bottom line."\n\nThat uncomfortable feedback transformed how we communicate.\n\nHave you ever had to unlearn a bad corporate habit? What was your turning point? #FounderLessons`,
  };

  const contentCategories = [
    {
      role: 'Founders & CEOs',
      icon: TrendingUp,
      badgeColor: 'from-blue-500 to-cyan-500',
      ideas: [
        'Lessons learned scaling from 0 to $1M ARR',
        'Unpopular beliefs about hiring top 1% talent',
        'Transparent post-mortems of product failures',
        'Behind-the-scenes decision memos and pivots',
      ],
    },
    {
      role: 'Software Engineers',
      icon: Code2,
      badgeColor: 'from-purple-500 to-indigo-500',
      ideas: [
        'Architecture breakdowns of high-scale systems',
        'Mistakes made during cloud database migrations',
        'Why clean code beats clever code every time',
        'Tools and workflows that 10x developer speed',
      ],
    },
    {
      role: 'Growth Marketers',
      icon: Target,
      badgeColor: 'from-emerald-500 to-teal-500',
      ideas: [
        'Organic distribution playbooks and funnel metrics',
        'A/B test case studies with exact numbers',
        'Frameworks for high-converting copywriting',
        'How to repurpose 1 podcast into 10 LinkedIn posts',
      ],
    },
    {
      role: 'Sales Executives',
      icon: Briefcase,
      badgeColor: 'from-amber-500 to-orange-500',
      ideas: [
        'Frameworks for closing 6-figure enterprise deals',
        'The #1 mistake reps make on discovery calls',
        'How to build trust with C-suite buyers',
        'Contract negotiation tactics that save deals',
      ],
    },
  ];

  const faqs = [
    {
      q: 'What is the best content to post on LinkedIn to get high engagement?',
      a: 'The highest-performing content on LinkedIn follows 3 core formats: 1) Contrarian opinions backed by real experience, 2) Actionable listicles with bullet points, and 3) Vulnerable storytelling about failures and key career turnarounds. LinkedIn Studio automatically formats your raw ideas into all 3 angles.',
    },
    {
      q: 'How often should I post content on LinkedIn?',
      a: 'Top LinkedIn creators post 3 to 5 times per week. Consistent weekday posting between 8:00 AM – 10:00 AM local time yields the highest algorithmic distribution. With LinkedIn Studio’s auto-scheduler, you can schedule a whole month of content in 30 minutes.',
    },
    {
      q: 'How does the AI Voice Cloner replicate my personal writing style?',
      a: 'You paste 3–5 of your past LinkedIn posts. Our engine extracts your stylistic DNA — sentence cadence, emoji density, hook style, and signature vocabulary — and applies it to every generated post so it sounds authentically like you.',
    },
    {
      q: 'Does it post directly to my LinkedIn profile?',
      a: 'Yes! We support official LinkedIn OAuth 2.0 integration. You can publish directly to your feed with 1 click, schedule future posts, or use the 1-click LinkedIn Web Share button.',
    },
    {
      q: 'Can I use LinkedIn Studio for free?',
      a: 'Yes! Our Starter Free plan includes 15 post generations per month, 5 scheduled posts, and full access to all 8 content templates with zero credit card required.',
    },
  ];

  return (
    <div className="relative space-y-32 pb-24 overflow-hidden">
      {/* 3D Ambient Background Mesh Gradients */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[900px] overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 blur-[130px] animate-mesh" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-500/20 blur-[140px] animate-mesh" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-[500px] bg-perspective-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 1. 3D Hero Section */}
      <section className="pt-12 sm:pt-20 text-center max-w-5xl mx-auto px-4 space-y-8 relative">
        {/* Floating 3D Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-badge-3d text-blue-300 text-xs font-black shadow-xl animate-float">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Next-Gen 3D AI Content Engine for LinkedIn</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* 3D Gradient Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
          Generate Viral LinkedIn Posts in{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent underline decoration-cyan-400/30 decoration-wavy decoration-2">
            3D Speed & Voice
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The all-in-one studio for founders, creators, and executives. Turn rough thoughts into viral hooks, branded stat cards, and scheduled campaigns in seconds.
        </p>

        {/* 3D Tactile CTA Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/login"
            className="btn-3d-primary flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white text-sm font-black shadow-2xl active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Start Creating Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="btn-3d-glass px-8 py-4 rounded-2xl text-slate-200 text-sm font-bold active:scale-95"
          >
            Explore Pricing & Plans
          </Link>
        </div>

        {/* 3D Social Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4 font-semibold">
          <span className="flex items-center gap-2 glass-badge-3d px-3.5 py-1.5 rounded-full text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Free Forever Tier ($0)
          </span>
          <span className="flex items-center gap-2 glass-badge-3d px-3.5 py-1.5 rounded-full text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Official LinkedIn OAuth 2.0
          </span>
          <span className="flex items-center gap-2 glass-badge-3d px-3.5 py-1.5 rounded-full text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Real Google & LinkedIn Auth
          </span>
        </div>
      </section>

      {/* 2. Interactive 3D Live Studio Showcase */}
      <section className="max-w-6xl mx-auto px-4 relative">
        {/* Floating 3D Satellite Badges */}
        <div className="hidden lg:flex items-center gap-3 absolute -top-8 -left-6 z-30 glass-panel-3d px-4 py-2.5 rounded-2xl text-xs font-bold text-emerald-300 border-emerald-500/30 shadow-2xl animate-float">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Viral Hook Score: <strong className="text-white font-mono">98/100</strong></span>
        </div>

        <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -right-6 z-30 glass-panel-3d px-4 py-2.5 rounded-2xl text-xs font-bold text-cyan-300 border-cyan-500/30 shadow-2xl animate-float-reverse">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>LinkedIn Algorithm 2026 Boosted 🚀</span>
        </div>

        {/* 3D Tilt Card Container */}
        <Card3D
          depth={8}
          glowColor="rgba(56, 189, 248, 0.25)"
          className="glass-panel-3d border border-slate-700/60 shadow-2xl"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm shadow-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/50" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/50" />
              <span className="font-bold text-slate-200 ml-2 tracking-wide">
                Interactive 3D Creator Studio
              </span>
            </div>

            {/* 3D Angle Switcher Tabs */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 font-bold text-xs">
              <button
                onClick={() => setActiveAngle('bold')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeAngle === 'bold'
                    ? 'bg-[#0a66c2] text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 Bold Hook
              </button>
              <button
                onClick={() => setActiveAngle('listicle')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeAngle === 'listicle'
                    ? 'bg-[#0a66c2] text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔢 Listicle
              </button>
              <button
                onClick={() => setActiveAngle('story')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeAngle === 'story'
                    ? 'bg-[#0a66c2] text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📖 Story
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Input Prompt Box */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Enter Any Rough Idea or Topic:</span>
                  <span className="text-[10px] text-cyan-400 uppercase font-mono">Live Generator</span>
                </label>
                <textarea
                  rows={4}
                  value={demoTopic}
                  onChange={(e) => setDemoTopic(e.target.value)}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-700 bg-slate-900/90 text-white focus:outline-hidden focus:ring-2 focus:ring-[#0a66c2] transition-all shadow-inner"
                />
              </div>

              <div className="p-4 rounded-2xl glass-panel-3d border border-blue-500/20 text-xs space-y-2 text-slate-300">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>3D Personal Voice Cloner Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Extracts your 1-sentence paragraph cadence, bold contrarian openings, and arrow bullet points for authentic engagement.
                </p>
              </div>
            </div>

            {/* Generated Output Card */}
            <div className="md:col-span-7 rounded-2xl glass-panel-3d border border-slate-700/80 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/30">
                  AR
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Alex Rivera</span>
                  <span className="text-[11px] text-slate-400">Founder & Tech Strategist • Just now</span>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-line font-sans select-text">
                {demoOutputs[activeAngle]}
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hook Score: <strong className="text-emerald-400 font-mono">92/100 (Viral)</strong></span>
                <span>Cutoff: <strong className="text-cyan-400 font-mono">148 / 210 chars</strong></span>
              </div>
            </div>
          </div>
        </Card3D>
      </section>

      {/* 3. 3D Industry Content Cards */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider glass-badge-3d px-3.5 py-1 rounded-full">
            Tailored Industry Frameworks
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Popular Content Ideas to Post on LinkedIn
          </h2>
          <p className="text-sm text-slate-400">
            Tailored content structures engineered for your specific niche and target audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card3D
                key={idx}
                depth={12}
                glowColor="rgba(14, 165, 233, 0.2)"
                className="glass-panel-3d p-6 space-y-5 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.badgeColor} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">{cat.role}</h3>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {cat.ideas.map((idea, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">→</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/login"
                  className="w-full py-2.5 px-3 rounded-xl btn-3d-glass text-cyan-300 font-bold text-xs text-center border border-slate-700 block transition-all"
                >
                  Generate for {cat.role.split(' ')[0]} &rarr;
                </Link>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* 4. 3D Feature Matrix */}
      <section id="features" className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider glass-badge-3d px-3.5 py-1 rounded-full">
            Full 3D Content Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Everything You Need to Dominate LinkedIn
          </h2>
          <p className="text-sm text-slate-400">
            A complete suite of creator tools designed specifically for LinkedIn’s unique algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card3D depth={10} className="glass-panel-3d p-8 space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Angle Post Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate 3 distinct variations per topic: Storytelling Narrative, Listicle & Bullets, and Bold Scroll-Stopping Hook.
            </p>
          </Card3D>

          <Card3D depth={10} className="glass-panel-3d p-8 space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Few-Shot Voice Cloner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste 3–5 past posts. The AI extracts sentence length, emoji frequency, and vocabulary to replicate your exact tone.
            </p>
          </Card3D>

          <Card3D depth={10} className="glass-panel-3d p-8 space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">8 Proven Content Templates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prebuilt structures for intros, career milestones, lesson learned stories, hot takes, build-in-public metrics, and case studies.
            </p>
          </Card3D>

          <Card3D depth={10} className="glass-panel-3d p-8 space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Hook & Readability Inspector</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live Hook Strength scoring (0–100), 3 alternative hook rewrites, corporate jargon flags, and ranked hashtag suggestions.
            </p>
          </Card3D>

          <Card3D depth={10} className="glass-panel-3d p-8 space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Visual Headline & Stat Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate branded quote and stat graphic cards with 6 theme presets. Export as PNG or attach directly to posts.
            </p>
          </Card3D>

          <Card3D depth={10} className="glass-panel-3d p-8 space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Official LinkedIn Scheduler</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official OAuth 2.0 publishing with automated rate-limit detection and auto-retry queueing instead of silent failures.
            </p>
          </Card3D>
        </div>
      </section>

      {/* 5. 3D Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider glass-badge-3d px-3.5 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Plans for Creators at Every Stage
          </h2>
          <p className="text-sm text-slate-400">
            Start for free and upgrade whenever you are ready for unlimited generation.
          </p>

          <div className="pt-2 flex items-center justify-center">
            <div className="glass-panel-3d p-1 rounded-2xl inline-flex items-center text-xs font-bold border border-slate-700">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  billingInterval === 'monthly' ? 'bg-[#0a66c2] text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('annual')}
                className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  billingInterval === 'annual' ? 'bg-[#0a66c2] text-white shadow-lg' : 'text-slate-400 hover:text-white'
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
          <Card3D depth={8} className="glass-panel-3d p-8 flex flex-col justify-between border border-slate-800">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{PLANS.free.name}</h3>
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
              Start Free
            </Link>
          </Card3D>

          {/* Pro (Elevated 3D) */}
          <Card3D
            depth={15}
            glowColor="rgba(10, 102, 194, 0.45)"
            className="glass-panel-3d p-8 flex flex-col justify-between border-2 border-cyan-500/80 shadow-2xl relative"
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
              Most Popular ⭐
            </span>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{PLANS.pro.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{PLANS.pro.description}</p>
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-5xl font-black text-cyan-300">
                  ${billingInterval === 'annual' ? PLANS.pro.priceAnnual : PLANS.pro.priceMonthly}
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
              className="mt-8 w-full py-3.5 rounded-xl btn-3d-primary text-white font-bold text-xs text-center block active:scale-98"
            >
              Get Started with Pro
            </Link>
          </Card3D>

          {/* Team */}
          <Card3D depth={8} className="glass-panel-3d p-8 flex flex-col justify-between border border-slate-800">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{PLANS.team.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{PLANS.team.description}</p>
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-5xl font-black text-purple-300">
                  ${billingInterval === 'annual' ? PLANS.team.priceAnnual : PLANS.team.priceMonthly}
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
              Get Team Plan
            </Link>
          </Card3D>
        </div>
      </section>

      {/* 6. 3D FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about creating viral content on LinkedIn.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card3D key={idx} depth={5} className="glass-panel-3d p-6 space-y-2 border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6.5">{faq.a}</p>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-800/80 pt-12 text-xs text-slate-400 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-sm">LinkedIn Studio 3D</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 border-t border-slate-800/60 pt-6">
          © {new Date().getFullYear()} LinkedIn Studio SaaS. All rights reserved. Not affiliated with LinkedIn Corporation.
        </div>
      </footer>
    </div>
  );
}
