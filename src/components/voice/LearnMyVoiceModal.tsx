'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { VoiceProfileItem } from '@/types';

interface LearnMyVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: VoiceProfileItem) => void;
}

export function LearnMyVoiceModal({
  isOpen,
  onClose,
  onProfileCreated,
}: LearnMyVoiceModalProps) {
  const [profileName, setProfileName] = useState('My Signature Style');
  const [posts, setPosts] = useState<string[]>([
    '',
    '',
    '',
  ]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddPostBox = () => {
    if (posts.length < 8) {
      setPosts([...posts, '']);
    }
  };

  const handleUpdatePost = (index: number, text: string) => {
    const updated = [...posts];
    updated[index] = text;
    setPosts(updated);
  };

  const handleRemovePostBox = (index: number) => {
    if (posts.length > 1) {
      setPosts(posts.filter((_, i) => i !== index));
    }
  };

  const handleExtractAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validPosts = posts.map((p) => p.trim()).filter((p) => p.length > 20);

    if (validPosts.length < 1) {
      setError('Please paste at least 1-3 substantial past posts (20+ characters each).');
      return;
    }

    setIsExtracting(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/learn-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileName: profileName.trim() || 'Learned Signature Voice',
          posts: validPosts,
        }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        onProfileCreated(data.profile);
        onClose();
      } else {
        setError(data.error || 'Failed to extract voice DNA');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-300" />
              Automated AI Stylistic DNA Extractor
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Learn My Voice from Past Posts
            </h2>
            <p className="text-xs text-blue-200/80 max-w-xl">
              Paste in 3–5 of your real past LinkedIn posts. The AI will analyze your sentence length, emoji frequency, hook patterns, and vocabulary to clone your writing style.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="px-6 py-3 bg-red-50 text-red-700 text-xs font-medium border-b border-red-200">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleExtractAndSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Voice Profile Name
            </label>
            <input
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="e.g. My Authentic Founder Tone"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Past Posts Inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Past Post Examples ({posts.length})
              </label>
              {posts.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddPostBox}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0a66c2] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Example Box</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {posts.map((postText, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Example Post #{idx + 1}</span>
                    {posts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePostBox(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={postText}
                    onChange={(e) => handleUpdatePost(idx, e.target.value)}
                    placeholder="Paste the full text of a real post that performed well..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleExtractAndSave}
            disabled={isExtracting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Stylistic DNA & Saving...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Learn My Voice Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
