'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  Bookmark,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { GeneratedDraftOption } from '@/types';

interface DraftCardProps {
  draft: GeneratedDraftOption;
  topic: string;
  onEdit: (draft: GeneratedDraftOption) => void;
  onSaveAsDraft: (draft: GeneratedDraftOption) => Promise<void>;
  onSchedule: (draft: GeneratedDraftOption) => void;
  onOpenStudio: (headline: string) => void;
}

export function DraftCard({
  draft,
  topic,
  onEdit,
  onSaveAsDraft,
  onOpenStudio,
}: DraftCardProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveAsDraft(draft);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const getAngleBadgeStyle = (angle: string) => {
    switch (angle) {
      case 'storytelling':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'listicle':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const cutoff = draft.seeMoreIndex || 210;
  const aboveFold = draft.content.slice(0, cutoff);
  const belowFold = draft.content.slice(cutoff);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${getAngleBadgeStyle(
            draft.angle
          )}`}
        >
          {draft.angleLabel}
        </span>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono">{draft.characterCount} chars</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {draft.estimatedReadTime}
          </span>
        </div>
      </div>

      {/* Opening Hook with Feed Cutoff Highlight */}
      <div className="px-5 pt-4 pb-3 bg-blue-50/40 border-b border-blue-100/60 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#0a66c2] uppercase tracking-wider">
          <span>Above-The-Fold Hook (~210 chars)</span>
          <span className="font-normal text-slate-400">Visible before &ldquo;see more&rdquo;</span>
        </div>
        <p className="text-xs font-semibold text-slate-900 italic line-clamp-2">
          &ldquo;{aboveFold}&rdquo;
        </p>
      </div>

      {/* Main Content Body */}
      <div className="p-5 flex-1 text-sm leading-relaxed text-slate-700 font-normal whitespace-pre-wrap select-text font-sans line-clamp-10">
        {draft.content}
      </div>

      {/* Footer Action Bar */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-all shadow-2xs"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenStudio(draft.hook || topic)}
            className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-xl transition-all shadow-2xs"
            title="Create matching graphic card"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Graphic Card</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            disabled={saving || savedSuccess}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-all shadow-2xs disabled:opacity-60"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Draft Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span>{saving ? 'Saving...' : 'Save Draft'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onEdit(draft)}
            className="flex items-center gap-1 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#004182] px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Open Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
