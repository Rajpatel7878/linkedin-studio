'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Send,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Loader2,
  Bookmark,
  Zap,
  HelpCircle,
  Scissors,
  Flame,
  Layers,
  Smartphone,
  Monitor,
  Lightbulb,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { LinkedInPreview } from './LinkedInPreview';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { UnicodeToolbar } from './UnicodeToolbar';
import { analyzeContentMetrics } from '@/lib/unicodeFormat';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic: string;
  initialContent: string;
  initialTone?: string;
  initialImageUrl?: string | null;
  postId?: string | null;
  onSaved: () => void;
  onOpenStudio?: (headline: string) => void;
}

interface HookOption {
  angle: string;
  label: string;
  hookText: string;
  score: number;
  whyItWorks: string;
}

export function PostEditorModal({
  isOpen,
  onClose,
  initialTopic,
  initialContent,
  initialTone = 'professional',
  initialImageUrl = null,
  postId = null,
  onSaved,
  onOpenStudio,
}: PostEditorModalProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [content, setContent] = useState(initialContent);
  const [tone, setTone] = useState(initialTone);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [showScheduleInput, setShowScheduleInput] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // Hook Punch-Up Engine State
  const [showHookDrawer, setShowHookDrawer] = useState(false);
  const [isPunchingHook, setIsPunchingHook] = useState(false);
  const [hookOptions, setHookOptions] = useState<HookOption[]>([]);

  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'suggestions' | 'preview'>('editor');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTopic(initialTopic);
    setContent(initialContent);
    setTone(initialTone);
    setImageUrl(initialImageUrl);
    setStatusMessage(null);
    setShowHookDrawer(false);
    setHookOptions([]);
  }, [initialTopic, initialContent, initialTone, initialImageUrl, isOpen]);

  if (!isOpen) return null;

  const metrics = analyzeContentMetrics(content);
  const isOverLimit = metrics.characters > 3000;
  const isNearLimit = metrics.characters > 2700;

  // AI Refinement Call
  const handleAIQuickAction = async (instruction: string) => {
    setIsRefining(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent: content,
          instruction,
          topic,
        }),
      });

      const data = await res.json();
      if (data.success && data.refinedContent) {
        setContent(data.refinedContent);
        setStatusMessage({ text: '✨ Refinement applied successfully!', type: 'success' });
      } else {
        setStatusMessage({ text: data.error || 'Refinement failed', type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: e.message, type: 'error' });
    } finally {
      setIsRefining(false);
    }
  };

  // AI Hook Punch-Up Call
  const handlePunchUpHook = async () => {
    setShowHookDrawer(true);
    if (hookOptions.length > 0) return;

    setIsPunchingHook(true);
    try {
      const res = await fetch('/api/ai/punch-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          topic,
        }),
      });

      const data = await res.json();
      if (data.success && data.hooks) {
        setHookOptions(data.hooks);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsPunchingHook(false);
    }
  };

  const handleApplyHook = (hookText: string) => {
    const lines = content.split('\n');
    const remainingBody = lines.slice(2).join('\n').trim();
    const updated = hookText.trim() + '\n\n' + remainingBody;
    setContent(updated);
    setStatusMessage({ text: '🎣 Viral hook applied successfully!', type: 'success' });
    setShowHookDrawer(false);
  };

  const handleReplaceHook = (newHook: string) => {
    const lines = content.split('\n');
    lines[0] = newHook;
    setContent(lines.join('\n'));
    setStatusMessage({ text: '✓ Replaced hook with viral alternative', type: 'success' });
  };

  const handleAppendHashtag = (tag: string) => {
    if (!content.includes(tag)) {
      setContent(content.trim() + '\n\n' + tag);
    }
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const endpoint = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || 'LinkedIn Post',
          content,
          tone,
          status: 'DRAFT',
          imageUrl,
          mediaType: imageUrl ? 'IMAGE' : 'NONE',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: 'Saved to drafts successfully!', type: 'success' });
        onSaved();
        setTimeout(() => onClose(), 1200);
      } else {
        setStatusMessage({ text: data.error || 'Failed to save', type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: e.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Schedule Post
  const handleSchedulePost = async () => {
    if (!scheduledAt) {
      setStatusMessage({ text: 'Please choose a valid schedule date/time', type: 'error' });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      let currentPostId = postId;
      if (!currentPostId) {
        const createRes = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic || 'LinkedIn Post',
            content,
            tone,
            status: 'SCHEDULED',
            scheduledAt: new Date(scheduledAt).toISOString(),
            imageUrl,
            mediaType: imageUrl ? 'IMAGE' : 'NONE',
          }),
        });
        const createData = await createRes.json();
        currentPostId = createData.post.id;
      } else {
        await fetch(`/api/posts/${currentPostId}/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduledAt: new Date(scheduledAt).toISOString() }),
        });
      }

      setStatusMessage({ text: `Post scheduled for ${new Date(scheduledAt).toLocaleString()}`, type: 'success' });
      onSaved();
      setTimeout(() => onClose(), 1500);
    } catch (e: any) {
      setStatusMessage({ text: e.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Now to LinkedIn
  const handlePublishNow = async () => {
    if (!confirm('Publish this post directly to LinkedIn now?')) return;

    setIsPublishing(true);
    setStatusMessage(null);
    try {
      let currentPostId = postId;
      if (!currentPostId) {
        const createRes = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic || 'LinkedIn Post',
            content,
            tone,
            status: 'DRAFT',
            imageUrl,
            mediaType: imageUrl ? 'IMAGE' : 'NONE',
          }),
        });
        const createData = await createRes.json();
        currentPostId = createData.post.id;
      }

      const pubRes = await fetch(`/api/posts/${currentPostId}/publish`, { method: 'POST' });
      const pubData = await pubRes.json();

      if (pubData.success) {
        setStatusMessage({ text: '🎉 Published successfully to LinkedIn!', type: 'success' });
        onSaved();
        setTimeout(() => onClose(), 1800);
      } else if (pubData.rateLimited) {
        setStatusMessage({
          text: `⚠️ Rate limit reached. Post queued automatically for dispatch.`,
          type: 'warning',
        });
        onSaved();
      } else {
        setStatusMessage({ text: pubData.error || 'Publishing failed', type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: e.message, type: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="glass-panel-3d rounded-3xl shadow-2xl border border-slate-800 w-full max-w-6xl flex flex-col max-h-[96vh] sm:max-h-[94vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
              {postId ? 'Edit Post' : 'Post Editor'}
            </h2>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-full flex-shrink-0">
              {tone}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Tab switchers */}
            <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-400">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all ${
                  activeTab === 'editor' ? 'bg-[#0a66c2] text-white shadow-md' : 'hover:text-white'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'suggestions' ? 'bg-[#0a66c2] text-white shadow-md font-bold' : 'hover:text-cyan-300'
                }`}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
                <span className="hidden xs:inline">AI Suggestions</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-[#0a66c2] text-white shadow-md' : 'hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
                <span className="hidden xs:inline">Feed Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`px-4 sm:px-6 py-2 text-xs font-medium flex items-center justify-between border-b ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : statusMessage.type === 'warning'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                : 'bg-red-950/80 text-red-300 border-red-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Body Grid */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left / Main Column: Editor, Unicode Toolbar & Hook Engine */}
          <div className={`${activeTab === 'editor' ? 'lg:col-span-7' : activeTab === 'preview' ? 'lg:col-span-6' : 'lg:col-span-6'} space-y-3 sm:space-y-4`}>
            {/* Unicode Formatting Toolbar */}
            <UnicodeToolbar
              textareaRef={textareaRef}
              content={content}
              onChange={setContent}
            />

            {/* Hook Punch-Up Trigger Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-slate-200">Viral Hook Engine</span>
              </div>

              <button
                type="button"
                onClick={handlePunchUpHook}
                disabled={isPunchingHook}
                className="btn-3d-primary flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow-md active:scale-95 disabled:opacity-50"
              >
                {isPunchingHook ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Flame className="w-3.5 h-3.5 text-yellow-300" />
                )}
                <span>🎣 Punch-Up Hook (5 Angles)</span>
              </button>
            </div>

            {/* Hook Punch-Up 5 Variations Drawer */}
            {showHookDrawer && (
              <div className="p-3 sm:p-4 bg-slate-900/95 border border-cyan-500/40 rounded-2xl space-y-2.5 sm:space-y-3 animate-fade-in shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-xs">Choose a Scroll-Stopping Opening Hook</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHookDrawer(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {isPunchingHook ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-cyan-300">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                    <span>Synthesizing 5 high-converting hook angles...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {hookOptions.map((hook, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 sm:p-3 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all flex items-start justify-between gap-2.5"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                              {hook.label}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              ★ Viral {hook.score}/100
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-100 italic whitespace-pre-wrap">
                            &ldquo;{hook.hookText}&rdquo;
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {hook.whyItWorks}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyHook(hook.hookText)}
                          className="btn-3d-primary flex-shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-white text-[10px] sm:text-[11px] font-bold shadow-md active:scale-95"
                        >
                          Use Hook
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Image Drawer */}
            {showImageUrlInput && (
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-purple-300">
                  <span>Attached Image URL</span>
                  {imageUrl && (
                    <button
                      onClick={() => setImageUrl(null)}
                      className="text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste Image URL..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs"
                  />
                  <button
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        setImageUrl(customImageUrl.trim());
                        setCustomImageUrl('');
                        setShowImageUrlInput(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Attach
                  </button>
                </div>
              </div>
            )}

            {/* Textarea with Metrics */}
            <div className="relative space-y-1">
              <textarea
                ref={textareaRef}
                id="post-textarea"
                rows={11}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Draft your LinkedIn post here..."
                className={`w-full p-3.5 sm:p-4 rounded-2xl border font-sans text-xs sm:text-sm leading-relaxed text-white bg-slate-900/90 focus:outline-hidden focus:ring-2 transition-all resize-y shadow-inner ${
                  isOverLimit
                    ? 'border-red-500/80 focus:ring-red-500/40'
                    : 'border-slate-800 focus:ring-cyan-500/30 focus:border-cyan-400'
                }`}
              />

              {/* Real-Time Metrics Info */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-1 px-1 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
                  <span
                    className={`font-mono font-semibold ${
                      isOverLimit
                        ? 'text-red-400'
                        : isNearLimit
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {metrics.characters}/3000
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono">{metrics.words}w</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono">{metrics.readTimeFormatted}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px]">
                  <span className="text-slate-400">Readability:</span>
                  <span className={`font-bold font-mono ${metrics.readabilityColor}`}>
                    {metrics.readabilityLabel} ({metrics.readabilityScore}/100)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Re-Prompt Buttons */}
            <div className="p-2.5 sm:p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Quick AI Actions:
                </span>
                {isRefining && (
                  <span className="text-cyan-300 flex items-center gap-1 font-semibold text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" /> Polishing...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Make this post 30% shorter, punchier and eliminate filler')}
                  className="p-1.5 sm:p-2 rounded-xl btn-3d-glass text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Scissors className="w-3 h-3 text-cyan-400" />
                  <span>Shorter</span>
                </button>

                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Make the tone bolder, contrarian, and disruptive')}
                  className="p-1.5 sm:p-2 rounded-xl btn-3d-glass text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Flame className="w-3 h-3 text-red-400" />
                  <span>Bolder</span>
                </button>

                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Add a high-engagement, open-ended question at the very end to spark comments')}
                  className="p-1.5 sm:p-2 rounded-xl btn-3d-glass text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <HelpCircle className="w-3 h-3 text-cyan-400" />
                  <span>Add Q&A</span>
                </button>

                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Regenerate and completely fresh rewrite this draft with maximum viral hooks')}
                  className="p-1.5 sm:p-2 rounded-xl btn-3d-glass text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Rewrite</span>
                </button>
              </div>
            </div>

            {/* Schedule Input Drawer */}
            {showScheduleInput && (
              <div className="p-3 sm:p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl space-y-2.5">
                <span className="text-xs font-bold text-cyan-300 block">
                  Select Publishing Date & Time
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-medium text-white flex-1 min-w-[180px]"
                  />
                  <button
                    onClick={handleSchedulePost}
                    disabled={isSaving}
                    className="btn-3d-primary px-4 py-2 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    {isSaving ? 'Scheduling...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Suggestions Panel OR Live Feed Simulation */}
          <div className={`${activeTab === 'editor' ? 'lg:col-span-5' : 'lg:col-span-6'} space-y-4`}>
            {activeTab === 'suggestions' ? (
              <AISuggestionsPanel
                content={content}
                topic={topic}
                onReplaceHook={handleReplaceHook}
                onAppendHashtag={handleAppendHashtag}
                onOpenCarouselStudio={onOpenStudio || (() => {})}
              />
            ) : (
              <LinkedInPreview content={content} imageUrl={imageUrl} />
            )}
          </div>
        </div>

        {/* Modal Footer (Responsive Wrap) */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm disabled:opacity-50"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={() => setShowScheduleInput(!showScheduleInput)}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cyan-500/30 bg-blue-950/60 hover:bg-blue-900/60 text-xs font-semibold text-cyan-300 transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Schedule</span>
            </button>

            <button
              onClick={() => {
                const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
                window.open(shareUrl, '_blank', 'noopener,noreferrer');
              }}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cyan-500/30 bg-blue-950/60 hover:bg-blue-900/60 text-xs font-semibold text-cyan-300 transition-all shadow-sm"
              title="Open directly in LinkedIn Composer"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn Web</span>
            </button>

            <button
              onClick={handlePublishNow}
              disabled={isPublishing || isSaving || isOverLimit}
              className="btn-3d-primary flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-cyan-200" />
              )}
              <span>{isPublishing ? 'Posting...' : 'Direct Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
