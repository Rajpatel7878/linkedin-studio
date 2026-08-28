'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Quote,
  Type,
} from 'lucide-react';
import { GraphicCardConfig } from '@/types';

const THEMES: Record<
  GraphicCardConfig['theme'],
  { label: string; bg: string; text: string; sub: string; accent: string; badgeBg: string; badgeText: string }
> = {
  'dark-luxe': {
    label: 'Dark Luxe',
    bg: 'linear-gradient(135deg, #090d16 0%, #111827 50%, #0f172a 100%)',
    text: '#ffffff',
    sub: '#94a3b8',
    accent: '#38bdf8',
    badgeBg: '#1e293b',
    badgeText: '#38bdf8',
  },
  'gradient-indigo': {
    label: 'Gradient Tech',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
    text: '#ffffff',
    sub: '#c7d2fe',
    accent: '#818cf8',
    badgeBg: '#4f46e5',
    badgeText: '#ffffff',
  },
  'minimal-ivory': {
    label: 'Minimal Ivory',
    bg: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
    text: '#1c1917',
    sub: '#57534e',
    accent: '#0a66c2',
    badgeBg: '#e7e5e4',
    badgeText: '#1c1917',
  },
  'bold-crimson': {
    label: 'Bold Crimson',
    bg: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
    text: '#ffffff',
    sub: '#fecaca',
    accent: '#f87171',
    badgeBg: '#b91c1c',
    badgeText: '#ffffff',
  },
  'emerald-growth': {
    label: 'Emerald Growth',
    bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
    text: '#ffffff',
    sub: '#a7f3d0',
    accent: '#34d399',
    badgeBg: '#047857',
    badgeText: '#ffffff',
  },
  'ocean-deep': {
    label: 'Ocean Authority',
    bg: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #075985 100%)',
    text: '#ffffff',
    sub: '#bae6fd',
    accent: '#38bdf8',
    badgeBg: '#0284c7',
    badgeText: '#ffffff',
  },
};

interface GraphicCardStudioProps {
  initialHeadline?: string;
  onAttachToPost?: (imageUrl: string) => void;
}

export function GraphicCardStudio({
  initialHeadline = 'The single biggest mistake founders make with AI is treating it like a search engine instead of a strategic collaborator.',
  onAttachToPost,
}: GraphicCardStudioProps) {
  const [cardType, setCardType] = useState<'headline' | 'quote' | 'stat'>('headline');
  const [headline, setHeadline] = useState(initialHeadline);
  const [subtext, setSubtext] = useState('Swipe to see the 4-step framework →');
  const [statNumber, setStatNumber] = useState('84%');
  const [statLabel, setStatLabel] = useState('of high-performing founders automate written briefings');
  const [categoryTag, setCategoryTag] = useState('LEADERSHIP & AI');
  const [authorName, setAuthorName] = useState('Alex Rivera');
  const [authorTitle, setAuthorTitle] = useState('Founder & Tech Strategist');
  const [theme, setTheme] = useState<GraphicCardConfig['theme']>('dark-luxe');
  const [aspectRatio, setAspectRatio] = useState<GraphicCardConfig['aspectRatio']>('1:1');
  const [attached, setAttached] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialHeadline) setHeadline(initialHeadline);
  }, [initialHeadline]);

  const currentTheme = THEMES[theme];

  // Render card to Canvas & export as PNG
  const generatePngDataUrl = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const width = 1080;
      let height = 1080;
      if (aspectRatio === '4:5') height = 1350;
      if (aspectRatio === '16:9') height = 608;

      canvas.width = width;
      canvas.height = height;

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (theme === 'dark-luxe') {
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#111827');
        grad.addColorStop(1, '#0f172a');
      } else if (theme === 'gradient-indigo') {
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#312e81');
        grad.addColorStop(1, '#4338ca');
      } else if (theme === 'minimal-ivory') {
        grad.addColorStop(0, '#fafaf9');
        grad.addColorStop(1, '#f5f5f4');
      } else if (theme === 'bold-crimson') {
        grad.addColorStop(0, '#450a0a');
        grad.addColorStop(0.5, '#7f1d1d');
        grad.addColorStop(1, '#991b1b');
      } else if (theme === 'emerald-growth') {
        grad.addColorStop(0, '#022c22');
        grad.addColorStop(0.5, '#064e3b');
        grad.addColorStop(1, '#065f46');
      } else {
        grad.addColorStop(0, '#082f49');
        grad.addColorStop(0.5, '#0c4a6e');
        grad.addColorStop(1, '#075985');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Category Badge
      if (categoryTag) {
        ctx.fillStyle = currentTheme.badgeBg;
        const badgeX = 80;
        const badgeY = 90;
        const badgeText = categoryTag.toUpperCase();
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        const textMetrics = ctx.measureText(badgeText);

        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, textMetrics.width + 48, 44, 10);
        ctx.fill();

        ctx.fillStyle = currentTheme.badgeText;
        ctx.fillText(badgeText, badgeX + 24, badgeY + 30);
      }

      if (cardType === 'stat') {
        // Draw Big Stat Number
        ctx.fillStyle = currentTheme.accent;
        ctx.font = 'black 140px system-ui, -apple-system, sans-serif';
        ctx.fillText(statNumber, 80, height * 0.42);

        // Draw Stat Label
        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
        ctx.fillText(statLabel, 80, height * 0.52);

        // Draw Subtext
        if (subtext) {
          ctx.fillStyle = currentTheme.sub;
          ctx.font = '500 30px system-ui, -apple-system, sans-serif';
          ctx.fillText(subtext, 80, height * 0.62);
        }
      } else {
        // Draw Main Headline / Quote
        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 50px system-ui, -apple-system, sans-serif';
        const maxTextWidth = width - 160;
        const words = (cardType === 'quote' ? `“${headline}”` : headline).split(' ');
        let line = '';
        let y = 230;
        const lineHeight = 70;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth && n > 0) {
            ctx.fillText(line, 80, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 80, y);

        // Subtext
        if (subtext) {
          y += 40;
          ctx.fillStyle = currentTheme.sub;
          ctx.font = '500 32px system-ui, -apple-system, sans-serif';
          ctx.fillText(subtext, 80, y);
        }
      }

      // Draw Author Watermark
      const bottomY = height - 120;
      ctx.strokeStyle = currentTheme.sub;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(80, bottomY - 30);
      ctx.lineTo(width - 80, bottomY - 30);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = currentTheme.text;
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
      ctx.fillText(authorName, 80, bottomY + 15);

      ctx.fillStyle = currentTheme.sub;
      ctx.font = '400 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(authorTitle, 80, bottomY + 50);

      // LinkedIn badge
      ctx.fillStyle = '#0a66c2';
      ctx.beginPath();
      ctx.roundRect(width - 130, bottomY, 50, 50, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
      ctx.fillText('in', width - 118, bottomY + 36);

      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleDownload = async () => {
    const dataUrl = await generatePngDataUrl();
    const link = document.createElement('a');
    link.download = `linkedin-${cardType}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleAttach = async () => {
    const dataUrl = await generatePngDataUrl();
    if (onAttachToPost) {
      onAttachToPost(dataUrl);
      setAttached(true);
      setTimeout(() => setAttached(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <ImageIcon className="w-7 h-7 text-cyan-400" />
          Visual Headline, Quote & Stat Card Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate branded graphic cards for your posts to stop the mobile scroll.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 glass-panel-3d rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-5">
          {/* Card Type Selector (Headline / Quote / Stat Card) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Card Template Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCardType('headline')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  cardType === 'headline'
                    ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300 ring-1 ring-cyan-500/80 shadow-md'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white bg-slate-900/60'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Headline</span>
              </button>
              <button
                type="button"
                onClick={() => setCardType('quote')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  cardType === 'quote'
                    ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300 ring-1 ring-cyan-500/80 shadow-md'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white bg-slate-900/60'
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Quote</span>
              </button>
              <button
                type="button"
                onClick={() => setCardType('stat')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  cardType === 'stat'
                    ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300 ring-1 ring-cyan-500/80 shadow-md'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white bg-slate-900/60'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Stat Card</span>
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              Color Theme Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as GraphicCardConfig['theme'][]).map((tKey) => {
                const t = THEMES[tKey];
                const isSelected = theme === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setTheme(tKey)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300 ring-1 ring-cyan-500/80 shadow-md'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`py-1.5 rounded-xl text-xs font-semibold border ${
                  aspectRatio === '1:1'
                    ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300'
                    : 'border-slate-800 text-slate-400 bg-slate-900/60'
                }`}
              >
                1:1 Square
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('4:5')}
                className={`py-1.5 rounded-xl text-xs font-semibold border ${
                  aspectRatio === '4:5'
                    ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300'
                    : 'border-slate-800 text-slate-400 bg-slate-900/60'
                }`}
              >
                4:5 Portrait
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-1.5 rounded-xl text-xs font-semibold border ${
                  aspectRatio === '16:9'
                    ? 'border-cyan-500/80 bg-blue-950/60 text-cyan-300'
                    : 'border-slate-800 text-slate-400 bg-slate-900/60'
                }`}
              >
                16:9 Landscape
              </button>
            </div>
          </div>

          {/* Category Tag */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category / Topic Badge
            </label>
            <input
              type="text"
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Card Content Inputs Based on Type */}
          {cardType === 'stat' ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Big Stat / Metric
                </label>
                <input
                  type="text"
                  value={statNumber}
                  onChange={(e) => setStatNumber(e.target.value)}
                  placeholder="e.g. 84% or 3.2x"
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Stat Label / Statement
                </label>
                <textarea
                  rows={2}
                  value={statLabel}
                  onChange={(e) => setStatLabel(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {cardType === 'quote' ? 'Quote Text' : 'Headline Text'}
              </label>
              <textarea
                rows={3}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          )}

          {/* Subtext */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Subtext / CTA Note
            </label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Right Preview Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Live Card Preview</span>
            <span className="capitalize">{cardType} • {aspectRatio}</span>
          </div>

          {/* Dynamic Rendered Card */}
          <div
            ref={cardRef}
            style={{
              background: currentTheme.bg,
              aspectRatio: aspectRatio === '4:5' ? '4/5' : aspectRatio === '16:9' ? '16/9' : '1/1',
            }}
            className="w-full rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-700/30 select-none"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              {categoryTag && (
                <span
                  style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.badgeText }}
                  className="text-xs sm:text-sm font-bold tracking-wider px-3.5 py-1.5 rounded-lg uppercase"
                >
                  {categoryTag}
                </span>
              )}
              <div
                style={{ backgroundColor: currentTheme.accent }}
                className="w-2.5 h-2.5 rounded-full animate-ping opacity-75"
              />
            </div>

            {/* Middle Content */}
            <div className="my-auto space-y-4">
              {cardType === 'stat' ? (
                <div className="space-y-2">
                  <div
                    style={{ color: currentTheme.accent }}
                    className="text-5xl sm:text-7xl font-black tracking-tight"
                  >
                    {statNumber}
                  </div>
                  <div
                    style={{ color: currentTheme.text }}
                    className="text-lg sm:text-2xl font-bold leading-tight"
                  >
                    {statLabel}
                  </div>
                </div>
              ) : (
                <h2
                  style={{ color: currentTheme.text }}
                  className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
                >
                  {cardType === 'quote' ? `“${headline}”` : headline}
                </h2>
              )}

              {subtext && (
                <p style={{ color: currentTheme.sub }} className="text-sm font-medium">
                  {subtext}
                </p>
              )}
            </div>

            {/* Bottom Author Bar */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <div style={{ color: currentTheme.text }} className="font-bold text-sm sm:text-base">
                  {authorName}
                </div>
                <div style={{ color: currentTheme.sub }} className="text-xs">
                  {authorTitle}
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs shadow-md">
                in
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {onAttachToPost && (
              <button
                type="button"
                onClick={handleAttach}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                {attached ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Attached to Post!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Attach to Current Post</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
