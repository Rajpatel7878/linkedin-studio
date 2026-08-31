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
  Share2,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { Card3D } from '@/components/ui/Card3D';
import { GeneratedDraftOption } from '@/types';

interface DraftCardProps {
  draft: GeneratedDraftOption;
  topic: string;
  onEdit: (draft: GeneratedDraftOption) => void;
  onSaveAsDraft: (draft: GeneratedDraftOption) => Promise<void>;
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

  const handleDirectLinkedInPost = () => {
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      draft.content
    )}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const getAngleBadgeStyle = (angle: string) => {
    switch (angle) {
      case 'storytelling':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'listicle':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-red-950/60 text-red-300 border-red-500/40';
    }
  };

  const cutoff = draft.seeMoreIndex || 210;
  const aboveFold = draft.content.slice(0, cutoff);

  return (
    <Card3D depth={10} glowColor="rgba(56, 189, 248, 0.2)" className="glass-panel-3d border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden group">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
        <span
          className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border ${getAngleBadgeStyle(
            draft.angle
          )}`}
        >
          {draft.angleLabel}
        </span>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
          <span className="font-mono">{draft.characterCount} chars</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            {draft.estimatedReadTime}
          </span>
        </div>
      </div>

      {/* Opening Hook with Feed Cutoff Highlight */}
      <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3 bg-blue-950/40 border-b border-blue-800/40 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
          <span>Above-The-Fold Hook (~210 chars)</span>
          <span className="font-normal text-slate-400 hidden xs:inline">Visible before &ldquo;see more&rdquo;</span>
        </div>
        <p className="text-xs font-semibold text-slate-100 italic line-clamp-2">
          &ldquo;{aboveFold}&rdquo;
        </p>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-5 flex-1 text-xs sm:text-sm leading-relaxed text-slate-200 font-normal whitespace-pre-wrap select-text font-sans line-clamp-10">
        {draft.content}
      </div>

      {/* Footer Action Bar (Responsive Wrap) */}
      <div className="p-3 sm:p-4 bg-slate-900/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-sm"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenStudio(draft.hook || topic)}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-sm"
            title="Create matching graphic card"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Graphic Card</span>
          </button>

          <button
            onClick={handleDirectLinkedInPost}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-cyan-300 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-sm"
            title="Open in LinkedIn post composer"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span>Post to LinkedIn</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            disabled={saving || savedSuccess}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onEdit(draft)}
            className="btn-3d-primary flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-200" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </Card3D>
  );
}
