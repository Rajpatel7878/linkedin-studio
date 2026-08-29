'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Loader2,
  Wand2,
  FileText,
  Zap,
  Link as LinkIcon,
  Lightbulb,
  BookOpen,
  Check,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { PostAngle, VoiceProfileItem, ContentTemplateItem } from '@/types';
import { ANGLE_DEFINITIONS } from '@/lib/ai/promptBuilder';
import { ContentTemplatePicker } from './ContentTemplatePicker';

interface GeneratorFormProps {
  onGenerate: (payload: {
    topic: string;
    angles: PostAngle[];
    targetAudience?: string;
    keyTakeaway?: string;
    callToAction?: string;
    voiceProfileId?: string;
    templateId?: string;
  }) => Promise<void>;
  isLoading: boolean;
  voiceProfiles: VoiceProfileItem[];
  selectedVoiceProfileId: string;
  onSelectVoiceProfile: (id: string) => void;
  onOpenLearnVoice: () => void;
  initialTemplateId?: string | null;
}

type GeneratorMode = 'topic' | 'templates' | 'url' | 'hooks';

export function GeneratorForm({
  onGenerate,
  isLoading,
  voiceProfiles,
  selectedVoiceProfileId,
  onSelectVoiceProfile,
  onOpenLearnVoice,
  initialTemplateId = null,
}: GeneratorFormProps) {
  const [mode, setMode] = useState<GeneratorMode>(initialTemplateId ? 'templates' : 'topic');
  const [topic, setTopic] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [selectedAngles, setSelectedAngles] = useState<PostAngle[]>([
    'storytelling',
    'listicle',
    'bold-hook',
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplateItem | null>(null);
  const [targetAudience, setTargetAudience] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (initialTemplateId) {
      setMode('templates');
      fetch(`/api/templates/${initialTemplateId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.template) {
            setSelectedTemplate(d.template);
          }
        })
        .catch(console.error);
    }
  }, [initialTemplateId]);

  const toggleAngle = (angle: PostAngle) => {
    if (selectedAngles.includes(angle)) {
      if (selectedAngles.length > 1) {
        setSelectedAngles(selectedAngles.filter((a) => a !== angle));
      }
    } else {
      setSelectedAngles([...selectedAngles, angle]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalTopic = topic.trim();

    if (mode === 'url') {
      if (!articleUrl.trim()) return;
      finalTopic = `Summarize and transform this article/resource into high-impact LinkedIn content: ${articleUrl.trim()}${topic ? ` (Focus note: ${topic})` : ''}`;
    } else if (mode === 'hooks') {
      if (!topic.trim()) return;
      finalTopic = `Generate 5 viral scroll-stopping LinkedIn hooks and full post expansions for: ${topic.trim()}`;
    }

    if (!finalTopic || isLoading) return;

    onGenerate({
      topic: finalTopic,
      angles: selectedAngles,
      targetAudience: targetAudience.trim() || undefined,
      keyTakeaway: keyTakeaway.trim() || undefined,
      callToAction: callToAction.trim() || undefined,
      voiceProfileId: selectedVoiceProfileId || undefined,
      templateId: selectedTemplate?.id || undefined,
    });
  };

  const samplePrompts = [
    'Why remote teams fail when they mimic in-office calendar meetings',
    '3 unexpected lessons learned while scaling revenue to $100k MRR',
    'Why high-agency creators write concise memos instead of 40-slide decks',
    'How to build a personal brand on LinkedIn in 15 minutes a day',
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel-3d rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl"
    >
      {/* MagicPost-Style Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setMode('topic')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'topic'
                ? 'bg-[#0a66c2] text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Idea / Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('templates')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'templates'
                ? 'bg-[#0a66c2] text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Swipe Books</span>
            <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
              8
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'url'
                ? 'bg-[#0a66c2] text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>URL to Post</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('hooks')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'hooks'
                ? 'bg-[#0a66c2] text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span>Viral Hooks</span>
          </button>
        </div>

        {/* Voice Selector & Learn Button */}
        <div className="flex items-center gap-2">
          {voiceProfiles && voiceProfiles.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
              <Mic className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">Voice:</span>
              <select
                value={selectedVoiceProfileId}
                onChange={(e) => onSelectVoiceProfile(e.target.value)}
                className="text-xs font-semibold text-cyan-300 bg-transparent border-none focus:outline-hidden cursor-pointer"
              >
                {voiceProfiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenLearnVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-3d-glass text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Learn My Voice</span>
          </button>
        </div>
      </div>

      {/* MODE 1: TEMPLATES SWIPE BOOK PICKER */}
      {mode === 'templates' && (
        <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Select Proven Viral Framework from Swipe Book:
            </span>
            {selectedTemplate && (
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-md">
                Active: {selectedTemplate.name}
              </span>
            )}
          </div>

          <ContentTemplatePicker
            selectedTemplateId={selectedTemplate?.id || null}
            onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
          />
        </div>
      )}

      {/* MODE 2: URL / ARTICLE TO POST */}
      {mode === 'url' && (
        <div className="space-y-3 p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              Paste Article / Blog / Resource Link:
            </span>
            <p className="text-[11px] text-slate-400">
              The AI will read the key takeaways and synthesize them into high-engagement LinkedIn posts.
            </p>
          </div>

          <input
            type="url"
            required
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            placeholder="https://example.com/blog/how-to-scale-retention or newsletter link..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-cyan-300 focus:outline-hidden focus:border-cyan-400"
          />
        </div>
      )}

      {/* Main Topic / Insight Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 block">
          {mode === 'url'
            ? 'Additional Angle or Specific Insight (Optional)'
            : mode === 'hooks'
            ? 'What is the topic you want viral hooks for?'
            : 'Topic, Core Insight, or Rough Bullet Points'}
        </label>
        <textarea
          rows={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={
            mode === 'hooks'
              ? 'e.g. Why most entrepreneurs burn out in year 2...'
              : mode === 'url'
              ? 'e.g. Emphasize why customer onboarding matters more than paid marketing...'
              : 'e.g. Most founders spend way too much time optimizing pitch decks and not enough time talking directly with users about their real pain points...'
          }
          className="w-full p-4 rounded-2xl border border-slate-700 bg-slate-900/90 text-sm leading-relaxed text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 resize-y transition-all shadow-inner"
        />

        {/* Quick Sample Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
            Try prompt:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTopic(prompt)}
              className="text-[11px] text-slate-300 bg-slate-800/80 hover:bg-cyan-950/50 hover:text-cyan-300 hover:border-cyan-500/40 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Generation Angles Multi-Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            Generate Drafts in These 3 Angles:
          </span>
          <span className="text-slate-500">
            {selectedAngles.length} angles selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(ANGLE_DEFINITIONS) as PostAngle[]).map((angleKey) => {
            const def = ANGLE_DEFINITIONS[angleKey];
            const isSelected = selectedAngles.includes(angleKey);

            return (
              <button
                key={angleKey}
                type="button"
                onClick={() => toggleAngle(angleKey)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-cyan-500/80 bg-blue-950/40 ring-1 ring-cyan-500/80 shadow-lg'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/80'
                }`}
              >
                <div className="text-xl mb-1">{def.emoji}</div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isSelected ? 'text-cyan-300' : 'text-slate-200'
                    }`}
                  >
                    {def.label}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {def.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Strategy Accordion */}
      <div className="border-t border-slate-800 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Advanced Tuning (Target Audience, Takeaways, CTA)</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 animate-fade-in">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Early-stage founders, VP of Eng"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Key Takeaway
              </label>
              <input
                type="text"
                value={keyTakeaway}
                onChange={(e) => setKeyTakeaway(e.target.value)}
                placeholder="e.g. Focus on retention before acquisition"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Desired CTA / Question
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. What is your team's biggest challenge?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Generate Submit Button */}
      <button
        type="submit"
        disabled={isLoading || (mode === 'url' ? !articleUrl.trim() : !topic.trim())}
        className="w-full btn-3d-primary py-4 px-6 rounded-2xl text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-cyan-200" />
            <span>Generating {selectedAngles.length} Viral Variations...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <span>Generate {selectedAngles.length} LinkedIn Post Drafts</span>
          </>
        )}
      </button>
    </form>
  );
}
