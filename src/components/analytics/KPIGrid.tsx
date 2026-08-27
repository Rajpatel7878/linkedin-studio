'use client';

import React from 'react';
import {
  Eye,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Award,
  Sparkles,
} from 'lucide-react';
import { AnalyticsSummary } from '@/types';

interface KPIGridProps {
  summary: AnalyticsSummary;
}

export function KPIGrid({ summary }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Impressions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Impressions
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0a66c2] flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {summary.totalImpressions.toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Across {summary.publishedPosts} published posts</span>
        </div>
      </div>

      {/* Average Engagement Rate */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Avg Engagement Rate
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {summary.averageEngagementRate}%
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Benchmark: ~2.5% - 4.5% on LinkedIn
        </div>
      </div>

      {/* Reactions & Comments */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Reactions & Comments
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
          <span>{summary.totalLikes}</span>
          <span className="text-xs font-normal text-slate-400">likes</span>
          <span>•</span>
          <span>{summary.totalComments}</span>
          <span className="text-xs font-normal text-slate-400">cmts</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          {summary.totalShares} total reposts
        </div>
      </div>

      {/* Pipeline Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Content Pipeline
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
          <span className="text-[#0a66c2]">{summary.scheduledPosts}</span>
          <span className="text-xs font-normal text-slate-400">scheduled</span>
          <span>/</span>
          <span className="text-slate-600">{summary.draftPosts}</span>
          <span className="text-xs font-normal text-slate-400">drafts</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          {summary.totalPosts} total created in library
        </div>
      </div>
    </div>
  );
}
