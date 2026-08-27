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
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[300px] text-slate-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#0a66c2]" />
        <span className="text-xs font-semibold">Analyzing Hook & Readability...</span>
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
        Type at least 20 characters to see live AI suggestions.
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Hook Strength Gauge Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Hook Strength Score
          </span>
          <span
            className={`font-mono font-black text-xs px-2.5 py-1 rounded-full border ${getScoreColor(
              suggestions.hookScore
            )}`}
          >
            {suggestions.hookScore} / 100 ({suggestions.hookRating})
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${suggestions.hookScore}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              suggestions.hookScore >= 80
                ? 'bg-emerald-500'
                : suggestions.hookScore >= 60
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
          />
        </div>

        <p className="text-[11px] text-slate-500 leading-normal">
          {suggestions.hookAnalysis}
        </p>

        {/* 3 Stronger Hook Alternatives */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Click to Apply Stronger Opening Hook:
          </span>
          {suggestions.alternativeHooks.map((altHook, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onReplaceHook(altHook)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-slate-800 text-[11px] leading-relaxed transition-all flex items-start gap-2 group"
            >
              <ArrowRight className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <span className="font-medium line-clamp-2">&ldquo;{altHook}&rdquo;</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Readability & Jargon Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-purple-600" />
          Readability & Jargon Check
        </span>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Grade Level</span>
            <span className="font-bold text-slate-800">
              {suggestions.readability.gradeLevel}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Avg Sentence</span>
            <span className="font-bold text-slate-800">
              {suggestions.readability.avgSentenceLength} words/line
            </span>
          </div>
        </div>

        {/* Jargon Flags */}
        {suggestions.readability.jargonFound.length > 0 ? (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
            <span className="font-bold flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Corporate Jargon Detected:
            </span>
            <div className="flex flex-wrap gap-1">
              {suggestions.readability.jargonFound.map((jargon, i) => (
                <span
                  key={i}
                  className="bg-white text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[10px]"
                >
                  &ldquo;{jargon}&rdquo;
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium bg-emerald-50 p-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero corporate jargon detected (clean & direct)</span>
          </div>
        )}
      </div>

      {/* 3. One-Click Carousel Suggestion Card */}
      {suggestions.carouselSuggestion?.isApplicable && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-purple-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-300" />
              Carousel Opportunity Detected
            </span>
            <span className="text-[10px] font-bold bg-purple-500/30 border border-purple-400/40 px-2 py-0.5 rounded-full">
              {suggestions.carouselSuggestion.slideCount} Slides
            </span>
          </div>

          <p className="text-[11px] text-purple-100/80 leading-relaxed">
            {suggestions.carouselSuggestion.reason}
          </p>

          <button
            type="button"
            onClick={() => onOpenCarouselStudio(topic || content.slice(0, 50))}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Generate Graphic Cards for Post</span>
          </button>
        </div>
      )}

      {/* 4. Suggested Hashtags */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-[#0a66c2]" />
            Ranked Relevant Hashtags
          </span>
          <span className="text-[10px] text-slate-400">Click to append</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {suggestions.suggestedHashtags.map((tag, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onAppendHashtag(tag);
                setCopiedTag(tag);
                setTimeout(() => setCopiedTag(null), 1500);
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0a66c2] font-semibold text-[11px] border border-blue-200 transition-colors flex items-center gap-1"
            >
              <span>{tag}</span>
              {copiedTag === tag ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <span className="text-[9px] text-blue-400">+</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Best Posting Time */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-slate-700">
        <Clock className="w-4 h-4 text-[#0a66c2] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#0a66c2] uppercase tracking-wider block">
            Best Posting Time
          </span>
          <p className="text-[11px] font-medium text-slate-800">
            {suggestions.bestPostingTime}
          </p>
        </div>
      </div>
    </div>
  );
}
