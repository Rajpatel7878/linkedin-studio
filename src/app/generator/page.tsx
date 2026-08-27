'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { DraftCard } from '@/components/generator/DraftCard';
import { PostEditorModal } from '@/components/generator/PostEditorModal';
import { GraphicCardStudio } from '@/components/studio/GraphicCardStudio';
import { LearnMyVoiceModal } from '@/components/voice/LearnMyVoiceModal';
import { GeneratedDraftOption, PostAngle, VoiceProfileItem } from '@/types';

function GeneratorContent() {
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get('templateId');

  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfileItem[]>([]);
  const [selectedVoiceProfileId, setSelectedVoiceProfileId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<GeneratedDraftOption[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [modelUsed, setModelUsed] = useState<string | null>(null);

  // Editor Modal state
  const [editingDraft, setEditingDraft] = useState<GeneratedDraftOption | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorImageUrl, setEditorImageUrl] = useState<string | null>(null);

  // Studio Modal state
  const [studioHeadline, setStudioHeadline] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Learn Voice Modal state
  const [isLearnVoiceOpen, setIsLearnVoiceOpen] = useState(false);

  // Fetch Voice Profiles
  const fetchVoiceProfiles = async () => {
    try {
      const res = await fetch('/api/voice');
      const data = await res.json();
      if (data.success) {
        setVoiceProfiles(data.profiles || []);
        if (data.defaultProfile && !selectedVoiceProfileId) {
          setSelectedVoiceProfileId(data.defaultProfile.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVoiceProfiles();
  }, []);

  // Handle Post Generation
  const handleGenerate = async (payload: {
    topic: string;
    angles: PostAngle[];
    targetAudience?: string;
    keyTakeaway?: string;
    callToAction?: string;
    voiceProfileId?: string;
    templateId?: string;
  }) => {
    setIsLoading(true);
    setCurrentTopic(payload.topic);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.drafts) {
        setGeneratedDrafts(data.drafts);
        setModelUsed(data.modelUsed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Save Draft directly to Database
  const handleSaveAsDraft = async (draft: GeneratedDraftOption) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: currentTopic || 'LinkedIn Post',
        content: draft.content,
        tone: draft.tone,
        angle: draft.angle,
        status: 'DRAFT',
        voiceProfileId: selectedVoiceProfileId || undefined,
      }),
    });
  };

  const handleEdit = (draft: GeneratedDraftOption) => {
    setEditingDraft(draft);
    setIsEditorOpen(true);
  };

  const handleSchedule = (draft: GeneratedDraftOption) => {
    setEditingDraft(draft);
    setIsEditorOpen(true);
  };

  const handleOpenStudio = (headline: string) => {
    setStudioHeadline(headline);
    setIsStudioOpen(true);
  };

  const handleAttachStudioCardToDraft = (imageUrl: string) => {
    setEditorImageUrl(imageUrl);
    setIsStudioOpen(false);
    if (!isEditorOpen && generatedDrafts.length > 0) {
      setEditingDraft(generatedDrafts[0]);
      setIsEditorOpen(true);
    }
  };

  const handleProfileLearned = (newProfile: VoiceProfileItem) => {
    setVoiceProfiles((prev) => [newProfile, ...prev]);
    setSelectedVoiceProfileId(newProfile.id);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-[#0a66c2]" />
          AI Post Generator & Studio
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Turn your ideas into 3 high-converting LinkedIn post variations styled with your personal voice and proven templates.
        </p>
      </div>

      {/* Generator Form */}
      <GeneratorForm
        onGenerate={handleGenerate}
        isLoading={isLoading}
        voiceProfiles={voiceProfiles}
        selectedVoiceProfileId={selectedVoiceProfileId}
        onSelectVoiceProfile={setSelectedVoiceProfileId}
        onOpenLearnVoice={() => setIsLearnVoiceOpen(true)}
        initialTemplateId={initialTemplateId}
      />

      {/* Generated Results Section */}
      {generatedDrafts.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0a66c2]" />
                Generated Post Drafts ({generatedDrafts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Click &ldquo;Open Studio&rdquo; to test live hook scores, readability, and LinkedIn feed preview.
              </p>
            </div>

            {modelUsed && (
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Engine: {modelUsed}
              </span>
            )}
          </div>

          {/* Drafts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedDrafts.map((draft, idx) => (
              <DraftCard
                key={idx}
                draft={draft}
                topic={currentTopic}
                onEdit={handleEdit}
                onSaveAsDraft={handleSaveAsDraft}
                onSchedule={handleSchedule}
                onOpenStudio={handleOpenStudio}
              />
            ))}
          </div>
        </div>
      )}

      {/* Post Editor Modal with Live AI Suggestions */}
      {editingDraft && (
        <PostEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingDraft(null);
            setEditorImageUrl(null);
          }}
          initialTopic={currentTopic}
          initialContent={editingDraft.content}
          initialTone={editingDraft.tone}
          initialImageUrl={editorImageUrl}
          onSaved={() => {}}
          onOpenStudio={handleOpenStudio}
        />
      )}

      {/* Graphic Studio Modal */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsStudioOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-sm font-semibold px-3 py-1 rounded-lg bg-slate-100"
            >
              Close Studio
            </button>
            <GraphicCardStudio
              initialHeadline={studioHeadline || currentTopic}
              onAttachToPost={handleAttachStudioCardToDraft}
            />
          </div>
        </div>
      )}

      {/* Learn My Voice Modal */}
      <LearnMyVoiceModal
        isOpen={isLearnVoiceOpen}
        onClose={() => setIsLearnVoiceOpen(false)}
        onProfileCreated={handleProfileLearned}
      />
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Studio...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}
