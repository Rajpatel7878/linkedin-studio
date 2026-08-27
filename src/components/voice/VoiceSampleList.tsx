'use client';

import React, { useState } from 'react';
import {
  Mic,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { VoiceProfileItem, VoiceSampleItem } from '@/types';

interface VoiceSampleListProps {
  profile: VoiceProfileItem;
  onRefresh: () => void;
}

export function VoiceSampleList({ profile, onRefresh }: VoiceSampleListProps) {
  const [samples, setSamples] = useState<VoiceSampleItem[]>(profile.samples || []);
  const [instructions, setInstructions] = useState(profile.instructions || '');
  const [isSavingInstructions, setIsSavingInstructions] = useState(false);
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  // New sample form state
  const [isAddingSample, setIsAddingSample] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveInstructions = async () => {
    setIsSavingInstructions(true);
    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PROFILE',
          profileId: profile.id,
          instructions,
        }),
      });
      if (res.ok) {
        setInstructionsSaved(true);
        setTimeout(() => setInstructionsSaved(false), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingInstructions(false);
    }
  };

  const handleAddSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_SAMPLE',
          profileId: profile.id,
          title: title.trim(),
          content: content.trim(),
          tags: tags.trim() || undefined,
        }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setTags('');
        setIsAddingSample(false);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSample = async (id: string) => {
    if (!confirm('Are you sure you want to delete this writing sample?')) return;
    try {
      const res = await fetch(`/api/voice/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Voice DNA Analysis */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Few-Shot Voice Learning Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile.name}
            </h1>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Feed the AI 3–5 examples of your past high-performing LinkedIn posts.
              The engine analyzes your rhythm, sentence length, and vocabulary so all future drafts sound unmistakably like you.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[140px]">
            <div className="text-3xl font-black text-white">{profile.samples?.length || 0} / 5</div>
            <div className="text-xs text-blue-200 font-medium mt-0.5">Voice Samples Saved</div>
            <div className="mt-2 text-[11px] text-emerald-300 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full inline-block">
              {profile.samples?.length >= 3 ? '✓ Optimal Voice DNA' : 'Add 3+ for best results'}
            </div>
          </div>
        </div>
      </div>

      {/* Author Guidelines Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#0a66c2]" />
              Custom Writing Style Guidelines
            </h2>
            <p className="text-xs text-slate-500">
              Rules and negative constraints the AI will enforce on every post.
            </p>
          </div>

          <button
            onClick={handleSaveInstructions}
            disabled={isSavingInstructions}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold transition-all disabled:opacity-50"
          >
            {instructionsSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSavingInstructions ? 'Saving...' : 'Save Rules'}</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Use 1-sentence paragraphs. Avoid corporate buzzwords (synergy, leverage). Always end with a thought-provoking open question..."
          className="w-full p-4 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-[#0a66c2] transition-all"
        />
      </div>

      {/* Voice Samples List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Writing Samples ({profile.samples?.length || 0})
            </h2>
            <p className="text-xs text-slate-500">
              Your real past posts used as few-shot context during generation.
            </p>
          </div>

          {!isAddingSample && (
            <button
              onClick={() => setIsAddingSample(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Past Post Sample</span>
            </button>
          )}
        </div>

        {/* Add Sample Form Modal / Inline Box */}
        {isAddingSample && (
          <form
            onSubmit={handleAddSample}
            className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0a66c2] flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Add Past Post or Writing Example
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingSample(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Sample Title / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaling Startup to 10k users"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. startup, leadership, hiring"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Full Post Content
              </label>
              <textarea
                rows={6}
                required
                placeholder="Paste the exact text of your past LinkedIn post here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingSample(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Sample...' : 'Save Voice Sample'}
              </button>
            </div>
          </form>
        )}

        {/* Samples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.samples?.map((sample) => (
            <div
              key={sample.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0a66c2] transition-colors">
                    {sample.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteSample(sample.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete sample"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {sample.tags && (
                  <div className="flex flex-wrap gap-1">
                    {sample.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-6 whitespace-pre-wrap font-sans bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  {sample.content}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{sample.content.length} characters</span>
                <span className="text-emerald-600 font-medium">Active Context</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
