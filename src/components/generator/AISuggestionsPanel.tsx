'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Hash,
  Layers,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import { AISuggestionsResponse } from '@/types';

interface AISuggestionsPanelProps {
  content: string;
  topic: string;
  onReplaceHook: (newHook: string) => void;
  onAppendHashtag: (tag: string) => void;
  onOpenCarouselStudio: (headline: string) => void;
}

export function AISuggestionsPanel({
  content,
  topic,
  onReplaceHook,
  onAppendHashtag,
  onOpenCarouselStudio,
}: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!content || content.trim().length < 20) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, topic }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error('Suggestions fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 800);
    return () => clearTimeout(timer);
  }, [content]);

  if (!suggestions && isLoading) {
    return (
      <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
        <span className="text-xs font-semibold">Analyzing Hook & Readability in 3D...</span>
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
        Type at least 20 characters to see live AI suggestions.
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40';
    if (score >= 75) return 'text-cyan-300 bg-blue-950/80 border-cyan-500/40';
    if (score >= 60) return 'text-amber-300 bg-amber-950/80 border-amber-500/40';
    return 'text-red-300 bg-red-950/80 border-red-500/40';
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Hook Strength Gauge Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Hook Strength Score
          </span>
          <span
            className={`font-mono font-black text-xs px-2.5 py-1 rounded-full border ${getScoreColor(
              suggestions.hookScore
            )}`}
          >
            {suggestions.hookScore} / 100
          </span>
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${suggestions.hookScore}%` }}
            className={`h-full rounded-full transition-all ${
              suggestions.hookScore >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : suggestions.hookScore >= 60
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                : 'bg-gradient-to-r from-red-500 to-amber-400'
            }`}
          />
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {suggestions.hookFeedback}
        </p>
      </div>

      {/* 2. Alternative Hook Rewrites */}
      {suggestions.hookAlternatives && suggestions.hookAlternatives.length > 0 && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-md">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Viral Alternative Hook Rewrites:
          </span>

          <div className="space-y-2">
            {suggestions.hookAlternatives.map((hook, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2"
              >
                <p className="text-slate-200 italic font-medium leading-relaxed font-sans">
                  &ldquo;{hook}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => onReplaceHook(hook)}
                  className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Use This Hook</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Readability & Formatting Telemetry */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-md">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Readability & Feed Diagnostics
        </span>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block">Grade Level:</span>
            <span className="font-bold text-slate-200">{suggestions.readabilityGrade}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block">Estimated Read:</span>
            <span className="font-bold text-cyan-300">{suggestions.estimatedReadTime}</span>
          </div>
        </div>

        {/* Corporate Jargon Flags */}
        {suggestions.jargonFlags && suggestions.jargonFlags.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              Corporate Jargon Detected:
            </span>
            <p className="text-slate-400 text-[10px]">
              Consider replacing: {suggestions.jargonFlags.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* 4. Ranked Hashtags */}
      {suggestions.rankedHashtags && suggestions.rankedHashtags.length > 0 && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2.5 shadow-md">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-cyan-400" />
            Recommended Niche Hashtags:
          </span>

          <div className="flex flex-wrap gap-1.5">
            {suggestions.rankedHashtags.map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onAppendHashtag(tag);
                  setCopiedTag(tag);
                  setTimeout(() => setCopiedTag(null), 1500);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 font-mono text-[11px] flex items-center gap-1 transition-colors"
              >
                <span>{tag}</span>
                {copiedTag === tag ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-slate-500">+</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
