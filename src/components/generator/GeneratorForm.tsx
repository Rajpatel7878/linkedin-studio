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
} from 'lucide-react';
import { PostAngle, PostTone, VoiceProfileItem, ContentTemplateItem } from '@/types';
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

export function GeneratorForm({
  onGenerate,
  isLoading,
  voiceProfiles,
  selectedVoiceProfileId,
  onSelectVoiceProfile,
  onOpenLearnVoice,
  initialTemplateId = null,
}: GeneratorFormProps) {
  const [topic, setTopic] = useState('');
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
    if (!topic.trim() || isLoading) return;

    onGenerate({
      topic: topic.trim(),
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
    '3 unexpected lessons learned while scaling revenue to \$100k MRR',
    'Why good product managers write concise memos instead of 40-slide decks',
    'How to build a personal brand on LinkedIn in 15 minutes a day without feeling salesy',
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
    >
      {/* Header with Voice Profile Selector & Learn Voice Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[#0a66c2]" />
            Describe Your Idea, Topic, or Rough Notes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The AI will craft 3 distinct draft variations using your personal voice and structure.
          </p>
        </div>

        {/* Voice Selector & Learn Button */}
        <div className="flex items-center gap-2">
          {voiceProfiles && voiceProfiles.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200/80 px-3 py-1.5 rounded-xl">
              <Mic className="w-4 h-4 text-[#0a66c2]" />
              <span className="text-xs text-slate-600 font-medium">Voice:</span>
              <select
                value={selectedVoiceProfileId}
                onChange={(e) => onSelectVoiceProfile(e.target.value)}
                className="text-xs font-semibold text-[#0a66c2] bg-transparent border-none focus:outline-hidden cursor-pointer"
              >
                {voiceProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.samples?.length || 0} samples)
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenLearnVoice}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Learn My Voice</span>
          </button>
        </div>
      </div>

      {/* Content Template Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0a66c2]" />
            Apply Content Template (Optional):
          </span>
          {selectedTemplate && (
            <span className="text-xs font-semibold text-[#0a66c2] bg-blue-50 px-2 py-0.5 rounded-md">
              Active: {selectedTemplate.name}
            </span>
          )}
        </div>

        <ContentTemplatePicker
          selectedTemplateId={selectedTemplate?.id || null}
          onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
        />
      </div>

      {/* Main Topic Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">
          Topic / Core Insight
        </label>
        <textarea
          rows={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Most founders spend way too much time optimizing pitch decks and not enough time talking directly with users about their real pain points..."
          className="w-full p-4 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-[#0a66c2] resize-y transition-all"
        />

        {/* Quick Sample Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
            Try prompt:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTopic(prompt)}
              className="text-[11px] text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-[#0a66c2] px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors border border-slate-200/60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Generation Angles Multi-Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Generate Drafts in These 3 Angles:
          </span>
          <span className="text-slate-400">
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
                    ? 'border-[#0a66c2] bg-blue-50/70 shadow-xs ring-1 ring-[#0a66c2]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xl mb-1">{def.emoji}</div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[#0a66c2]' : 'text-slate-800'
                    }`}
                  >
                    {def.label}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {def.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Strategy Accordion */}
      <div className="border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
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
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Early-stage founders, VP of Eng"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Key Takeaway
              </label>
              <input
                type="text"
                value={keyTakeaway}
                onChange={(e) => setKeyTakeaway(e.target.value)}
                placeholder="e.g. Focus on retention before acquisition"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Desired CTA / Question
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. What is your team's biggest challenge?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Generate Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full py-4 px-6 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating 3 Draft Angles with Voice Matching...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate {selectedAngles.length} LinkedIn Post Drafts</span>
          </>
        )}
      </button>
    </form>
  );
}
