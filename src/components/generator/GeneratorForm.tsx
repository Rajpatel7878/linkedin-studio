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
      className="glass-panel-3d rounded-3xl border border-slate-800 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 shadow-2xl"
    >
      {/* Mode Switcher Tabs + Voice Bar (Responsive Horizontal Scroll) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-800">
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-2xl gap-1 overflow-x-auto no-scrollbar max-w-full">
          <button
            type="button"
            onClick={() => setMode('topic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {voiceProfiles && voiceProfiles.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl">
              <Mic className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">Voice:</span>
              <select
                value={selectedVoiceProfileId}
                onChange={(e) => onSelectVoiceProfile(e.target.value)}
                className="text-xs font-semibold text-cyan-300 bg-transparent border-none focus:outline-hidden cursor-pointer max-w-[110px] sm:max-w-none truncate"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-3d-glass text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shadow-md flex-shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Learn My Voice</span>
          </button>
        </div>
      </div>

      {/* MODE 1: TEMPLATES SWIPE BOOK PICKER */}
      {mode === 'templates' && (
        <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Select Proven Viral Framework from Swipe Book:
            </span>
            {selectedTemplate && (
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                Active: {selectedTemplate.name}
              </span>
            )}
          </div>
          <ContentTemplatePicker
            selectedTemplateId={selectedTemplate?.id || null}
            onSelectTemplate={(t) => setSelectedTemplate(t)}
          />
        </div>
      )}

      {/* MODE 2: URL / ARTICLE TO POST */}
      {mode === 'url' && (
        <div className="space-y-2 p-3.5 sm:p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
          <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Article / Newsletter / Blog URL:</span>
          </label>
          <input
            type="url"
            required
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            placeholder="https://techcrunch.com/article... or https://substacks.com/post..."
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
          <p className="text-[11px] text-slate-400">
            Our AI will parse the core insights, remove filler, and create 3 viral LinkedIn posts based on this article.
          </p>
        </div>
      )}

      {/* Topic / Prompt Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              {mode === 'templates'
                ? `What is your post topic using the "${selectedTemplate?.name || 'Selected'}" Framework?`
                : mode === 'url'
                ? 'Optional: What angle or focus should we emphasize from the article?'
                : mode === 'hooks'
                ? 'What is the topic you want 5 scroll-stopping viral hooks for?'
                : 'What idea or topic do you want to share?'}
            </span>
          </label>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            required={mode !== 'url'}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={
              mode === 'templates'
                ? `e.g. 3 counter-intuitive management lessons I learned after scaling from 5 to 50 employees...`
                : mode === 'url'
                ? `e.g. Focus on the lessons for early-stage B2B SaaS founders...`
                : mode === 'hooks'
                ? `e.g. Why most founders waste money on Google Ads before product-market fit...`
                : `e.g. Why most startups fail by building features before validating distribution...`
            }
            className="w-full p-3.5 sm:p-4 rounded-2xl border border-slate-800 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none shadow-inner"
          />
        </div>

        {/* Quick Inspo Chips */}
        {mode === 'topic' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 whitespace-nowrap">
              <Lightbulb className="w-3 h-3 text-yellow-400" />
              <span>Inspo:</span>
            </span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopic(prompt)}
                className="text-[11px] bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Multi-Angle Selectors */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            Generate 3 Distinct Strategic Angles:
          </span>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Selected: {selectedAngles.length} variations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {(Object.keys(ANGLE_DEFINITIONS) as PostAngle[]).map((angleKey) => {
            const angle = ANGLE_DEFINITIONS[angleKey];
            const isSelected = selectedAngles.includes(angleKey);

            return (
              <button
                key={angleKey}
                type="button"
                onClick={() => toggleAngle(angleKey)}
                className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'glass-card-3d-active border-cyan-500/50 bg-blue-950/40 shadow-lg'
                    : 'glass-panel-3d border-slate-800/80 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-cyan-300' : 'text-slate-200'
                    }`}
                  >
                    {angle.label}
                  </span>
                  {isSelected ? (
                    <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {angle.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Settings Drawer Accordion */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/40">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-3 sm:p-3.5 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Audience & Custom CTA (Optional)</span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-3 sm:p-4 border-t border-slate-800 space-y-3 animate-fade-in bg-slate-950/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Seed founders, B2B Marketers, Tech Leaders"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Custom Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="e.g. Follow for weekly SaaS growth tactics"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Generate Button */}
      <button
        type="submit"
        disabled={isLoading || (mode === 'url' ? !articleUrl.trim() : !topic.trim())}
        className="w-full btn-3d-primary py-3 sm:py-3.5 px-6 rounded-2xl text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
            <span>Synthesizing Viral Posts in 3D...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Generate 3 High-Impact LinkedIn Posts</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 hidden xs:inline" />
          </>
        )}
      </button>
    </form>
  );
}
