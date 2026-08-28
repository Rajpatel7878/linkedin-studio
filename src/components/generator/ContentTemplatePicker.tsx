'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  ChevronRight,
  Plus,
  Check,
  Zap,
} from 'lucide-react';
import { ContentTemplateItem } from '@/types';

interface ContentTemplatePickerProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: ContentTemplateItem | null) => void;
}

export function ContentTemplatePicker({
  selectedTemplateId,
  onSelectTemplate,
}: ContentTemplatePickerProps) {
  const [templates, setTemplates] = useState<ContentTemplateItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const categories = [
    { label: 'All Templates', key: 'ALL' },
    { label: 'Framework & Listicle', key: 'framework' },
    { label: 'Career & Intro', key: 'career' },
    { label: 'Story & Lessons', key: 'story' },
    { label: 'Hot Takes', key: 'opinion' },
    { label: 'Build in Public', key: 'growth' },
    { label: 'Engagement Poll', key: 'engagement' },
  ];

  const filteredTemplates =
    activeCategory === 'ALL'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-3">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-[#0a66c2] text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* No Template Option */}
        <button
          type="button"
          onClick={() => onSelectTemplate(null)}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
            selectedTemplateId === null
              ? 'border-cyan-500/80 bg-blue-950/40 ring-1 ring-cyan-500/80 shadow-lg'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">
              ✨ Freeform / Custom Topic
            </span>
            {selectedTemplateId === null && (
              <Check className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            AI generates drafts purely from your prompt notes without fixed template structures.
          </p>
        </button>

        {/* Template Cards */}
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-cyan-500/80 bg-blue-950/40 ring-1 ring-cyan-500/80 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {template.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span className="capitalize text-slate-400">{template.category}</span>
                <span className="text-cyan-400 font-semibold">Use Pattern →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
