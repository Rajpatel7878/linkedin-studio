'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Bold,
  Italic,
  List,
  ArrowRight,
  Eye,
  Loader2,
  Bookmark,
  Zap,
  HelpCircle,
  Scissors,
  Flame,
  Layers,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { LinkedInPreview } from './LinkedInPreview';
import { AISuggestionsPanel } from './AISuggestionsPanel';

// Unicode bold/italic converter helpers
const toUnicodeBold = (text: string) => {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bold = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';
  return text
    .split('')
    .map((char) => {
      const idx = normal.indexOf(char);
      return idx !== -1 ? Array.from(bold)[idx] : char;
    })
    .join('');
};

const toUnicodeItalic = (text: string) => {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const italic = '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡';
  return text
    .split('')
    .map((char) => {
      const idx = normal.indexOf(char);
      return idx !== -1 ? Array.from(italic)[idx] : char;
    })
    .join('');
};

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
  
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'suggestions' | 'preview'>('editor');

  useEffect(() => {
    setTopic(initialTopic);
    setContent(initialContent);
    setTone(initialTone);
    setImageUrl(initialImageUrl);
    setStatusMessage(null);
  }, [initialTopic, initialContent, initialTone, initialImageUrl, isOpen]);

  if (!isOpen) return null;

  const characterCount = content.length;
  const isOverLimit = characterCount > 3000;
  const isNearLimit = characterCount > 2700 && !isOverLimit;
  const seeMoreCutoffIndex = 210;

  // Insert formatted text or bullets
  const applyTextFormat = (formatType: 'bold' | 'italic' | 'bullet' | 'arrow' | 'emoji') => {
    const textarea = document.getElementById('post-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let replacement = '';
    if (formatType === 'bold') {
      replacement = selectedText ? toUnicodeBold(selectedText) : '𝗯𝗼𝗹𝗱 𝘁𝗲𝘅𝘁';
    } else if (formatType === 'italic') {
      replacement = selectedText ? toUnicodeItalic(selectedText) : '𝘪𝘵𝘢𝘭𝘪𝘤 𝘵𝘦𝘅𝘵';
    } else if (formatType === 'bullet') {
      replacement = `\n• ${selectedText || 'Key point here'}`;
    } else if (formatType === 'arrow') {
      replacement = `\n→ ${selectedText || 'Action step'}`;
    } else if (formatType === 'emoji') {
      replacement = ` 💡 `;
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  // AI Quick Actions (Make shorter, Make bolder, Add question, Regenerate)
  const handleAIQuickAction = async (instruction: string) => {
    setIsRefining(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, instruction }),
      });
      const data = await res.json();
      if (data.success && data.refinedContent) {
        setContent(data.refinedContent);
        setStatusMessage({ text: `Refinement applied: "${instruction}"`, type: 'success' });
      }
    } catch (e: any) {
      setStatusMessage({ text: 'Failed to refine content', type: 'error' });
    } finally {
      setIsRefining(false);
    }
  };

  // Replace Opening Hook from suggestions
  const handleReplaceHook = (newHook: string) => {
    const lines = content.split('\n');
    lines[0] = newHook;
    setContent(lines.join('\n'));
    setStatusMessage({ text: 'Hook replaced successfully!', type: 'success' });
  };

  // Append Hashtag from suggestions
  const handleAppendHashtag = (tag: string) => {
    if (!content.includes(tag)) {
      setContent((prev) => `${prev.trim()}\n${tag}`);
    }
  };

  // Save Draft to Database
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      let res;
      if (postId) {
        res = await fetch(`/api/posts/${postId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic,
            content,
            tone,
            imageUrl,
            mediaType: imageUrl ? 'IMAGE' : 'NONE',
          }),
        });
      } else {
        res = await fetch('/api/posts', {
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
      }

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: 'Draft saved successfully!', type: 'success' });
        onSaved();
        setTimeout(() => onClose(), 1200);
      } else {
        setStatusMessage({ text: data.error || 'Failed to save draft', type: 'error' });
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
      setStatusMessage({ text: 'Please pick a schedule date and time', type: 'warning' });
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl flex flex-col max-h-[94vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              {postId ? 'Edit LinkedIn Post' : 'Fine-Tune & Polish Post'}
            </h2>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#0a66c2] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {tone}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switchers */}
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'editor' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'suggestions' ? 'bg-white text-purple-700 shadow-2xs font-bold' : 'hover:text-purple-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Suggestions</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-white text-[#0a66c2] shadow-2xs' : 'hover:text-[#0a66c2]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#0a66c2]" />
                <span>Feed Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : statusMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Body Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main Column: Editor & Formatting Toolbar (7 cols or full depending on view) */}
          <div className={`${activeTab === 'editor' ? 'lg:col-span-7' : activeTab === 'preview' ? 'lg:col-span-6' : 'lg:col-span-6'} space-y-4`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => applyTextFormat('bold')}
                  title="Unicode Bold"
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyTextFormat('italic')}
                  title="Unicode Italic"
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700 italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  onClick={() => applyTextFormat('bullet')}
                  title="Insert Bullet"
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 text-slate-700 font-medium"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>• Bullet</span>
                </button>
                <button
                  onClick={() => applyTextFormat('arrow')}
                  title="Insert Arrow"
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 text-slate-700 font-medium"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>→ Step</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onOpenStudio && (
                  <button
                    onClick={() => onOpenStudio(content.slice(0, 80))}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-medium text-xs transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>Create Visual Card</span>
                  </button>
                )}

                <button
                  onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                  className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                    imageUrl
                      ? 'bg-blue-50 text-[#0a66c2] border-blue-200 font-medium'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{imageUrl ? 'Image Attached' : 'Attach Image'}</span>
                </button>
              </div>
            </div>

            {/* Image Drawer */}
            {showImageUrlInput && (
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-purple-900">
                  <span>Attached Image URL</span>
                  {imageUrl && (
                    <button
                      onClick={() => setImageUrl(null)}
                      className="text-red-600 hover:underline"
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
                    className="flex-1 px-3 py-1.5 rounded-lg border border-purple-200 bg-white text-xs"
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

            {/* Textarea with See-More Cutoff Line Overlay */}
            <div className="relative space-y-1">
              {/* LinkedIn Cutoff Indicator Bar */}
              <div className="flex items-center justify-between text-[11px] px-1 font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0a66c2]" />
                  Above-the-fold Hook ({Math.min(characterCount, seeMoreCutoffIndex)} / ~210 chars)
                </span>
                <span className="text-[10px] text-slate-400">
                  Visible in feed before user clicks &ldquo;...see more&rdquo;
                </span>
              </div>

              <div className="relative">
                <textarea
                  id="post-textarea"
                  rows={13}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your LinkedIn post here..."
                  className={`w-full p-4 rounded-2xl border font-sans text-sm leading-relaxed text-slate-900 bg-white focus:outline-hidden focus:ring-2 transition-all resize-y ${
                    isOverLimit
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-slate-200 focus:ring-blue-100 focus:border-[#0a66c2]'
                  }`}
                />
              </div>

              {/* Character Counter Info */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span
                  className={`font-mono font-semibold ${
                    isOverLimit
                      ? 'text-red-600'
                      : isNearLimit
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }`}
                >
                  {characterCount} / 3,000 chars
                </span>
                {isOverLimit && (
                  <span className="text-red-600 font-bold">
                    Exceeds LinkedIn 3,000 limit!
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Re-Prompt Buttons */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Quick AI Re-Prompt Actions:
                </span>
                {isRefining && (
                  <span className="text-purple-600 flex items-center gap-1 font-semibold">
                    <Loader2 className="w-3 h-3 animate-spin" /> Polishing...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Make this post 30% shorter and punchier')}
                  className="p-2 rounded-xl bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                >
                  <Scissors className="w-3 h-3 text-purple-500" />
                  <span>Make shorter</span>
                </button>

                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Make the tone bolder, contrarian, and disruptive')}
                  className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                >
                  <Flame className="w-3 h-3 text-red-500" />
                  <span>Make bolder</span>
                </button>

                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Add a high-engagement, open-ended question at the very end to spark comments')}
                  className="p-2 rounded-xl bg-white hover:bg-blue-50 hover:text-[#0a66c2] border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                >
                  <HelpCircle className="w-3 h-3 text-[#0a66c2]" />
                  <span>Add question</span>
                </button>

                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => handleAIQuickAction('Regenerate and completely fresh rewrite this draft with maximum viral hooks')}
                  className="p-2 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 text-emerald-500" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Schedule Input Drawer */}
            {showScheduleInput && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-[#0a66c2] block">
                  Select Publishing Date & Time
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800"
                  />
                  <button
                    onClick={handleSchedulePost}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#0a66c2] text-white rounded-xl text-xs font-semibold hover:bg-[#004182] transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Scheduling...' : 'Confirm Schedule'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Suggestions Panel OR Live Feed Simulation */}
          <div className={`${activeTab === 'editor' ? 'lg:col-span-5' : 'lg:col-span-6'} space-y-4`}>
            {activeTab === 'suggestions' || activeTab === 'editor' ? (
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

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-all shadow-2xs disabled:opacity-50"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={() => setShowScheduleInput(!showScheduleInput)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#0a66c2] transition-all shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => {
                const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
                window.open(shareUrl, '_blank', 'noopener,noreferrer');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#0a66c2] transition-all shadow-2xs"
              title="Open directly in LinkedIn Composer"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>Share to LinkedIn Web</span>
            </button>

            <button
              onClick={handlePublishNow}
              disabled={isPublishing || isSaving || isOverLimit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isPublishing ? 'Publishing...' : '1-Click Direct Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
