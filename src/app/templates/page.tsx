'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Layers,
  Zap,
} from 'lucide-react';
import { ContentTemplateItem } from '@/types';
import Link from 'next/link';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ContentTemplateItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isCreating, setIsCreating] = useState(false);

  // New Template Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('framework');
  const [description, setDescription] = useState('');
  const [hookPattern, setHookPattern] = useState('');
  const [bodyPattern, setBodyPattern] = useState('');
  const [ctaPattern, setCtaPattern] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          hookPattern: hookPattern.trim(),
          bodyPattern: bodyPattern.trim(),
          ctaPattern: ctaPattern.trim(),
        }),
      });

      if (res.ok) {
        setName('');
        setDescription('');
        setHookPattern('');
        setBodyPattern('');
        setCtaPattern('');
        setIsCreating(false);
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTemplates();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = [
    { label: 'All Templates', key: 'ALL' },
    { label: 'Framework & Listicle', key: 'framework' },
    { label: 'Career & Intro', key: 'career' },
    { label: 'Story & Lessons', key: 'story' },
    { label: 'Hot Takes & Opinion', key: 'opinion' },
    { label: 'Build in Public', key: 'growth' },
    { label: 'Engagement Polls', key: 'engagement' },
  ];

  const filteredTemplates =
    activeCategory === 'ALL'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#0a66c2]" />
            Content Templates Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Proven hook, body, and CTA structures that you can use or customize for your content.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Template</span>
        </button>
      </div>

      {/* Create Template Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateTemplate}
          className="bg-white rounded-3xl border border-blue-200 shadow-md p-6 sm:p-8 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0a66c2]" />
              New Content Template
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Template Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 3-Step Tactical Framework"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="framework">Framework & Listicle</option>
                <option value="career">Career & Intro</option>
                <option value="story">Story & Lessons</option>
                <option value="opinion">Hot Takes & Opinion</option>
                <option value="growth">Build in Public</option>
                <option value="engagement">Engagement Polls</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this template high-converting..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hook Pattern</label>
              <textarea
                rows={3}
                required
                value={hookPattern}
                onChange={(e) => setHookPattern(e.target.value)}
                placeholder="e.g. The #1 mistake [Target Audience] makes with [Topic]..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Body Pattern</label>
              <textarea
                rows={3}
                required
                value={bodyPattern}
                onChange={(e) => setBodyPattern(e.target.value)}
                placeholder="e.g. Instead of [Wrong Way], here is what works: → [Step 1] → [Step 2]..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">CTA Pattern</label>
              <textarea
                rows={3}
                value={ctaPattern}
                onChange={(e) => setCtaPattern(e.target.value)}
                placeholder="e.g. What is your take on [Topic]? Let's discuss in the comments."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-[#0a66c2] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-[#0a66c2] bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {template.category}
                </span>
                {!template.isPrebuilt && (
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0a66c2] transition-colors">
                {template.name}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                {template.description}
              </p>

              <div className="space-y-2 pt-2 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Hook Pattern
                  </span>
                  <p className="font-medium text-slate-800 italic line-clamp-2">
                    &ldquo;{template.hookPattern}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                {template.usageCount} times used
              </span>
              <Link
                href={`/generator?templateId=${template.id}`}
                className="flex items-center gap-1 text-xs font-bold text-[#0a66c2] hover:underline"
              >
                <span>Write With Template</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
