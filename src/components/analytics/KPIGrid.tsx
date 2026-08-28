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
import { Card3D } from '@/components/ui/Card3D';

interface KPIGridProps {
  summary: AnalyticsSummary;
}

export function KPIGrid({ summary }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Impressions */}
      <Card3D depth={8} className="glass-panel-3d rounded-2xl border border-slate-800 shadow-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Impressions
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-500/30 text-cyan-400 flex items-center justify-center shadow-sm">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white">
          {summary.totalImpressions.toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Across {summary.publishedPosts} published posts</span>
        </div>
      </Card3D>

      {/* Average Engagement Rate */}
      <Card3D depth={8} className="glass-panel-3d rounded-2xl border border-slate-800 shadow-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Avg Engagement Rate
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white">
          {summary.averageEngagementRate}%
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Benchmark: ~2.5% - 4.5% on LinkedIn
        </div>
      </Card3D>

      {/* Reactions & Comments */}
      <Card3D depth={8} className="glass-panel-3d rounded-2xl border border-slate-800 shadow-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Reactions & Comments
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-sm">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white flex items-baseline gap-2">
          <span className="text-amber-300">{summary.totalLikes}</span>
          <span className="text-xs font-normal text-slate-400">likes</span>
          <span>•</span>
          <span className="text-cyan-300">{summary.totalComments}</span>
          <span className="text-xs font-normal text-slate-400">cmts</span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          {summary.totalShares} total reposts
        </div>
      </Card3D>

      {/* Pipeline Status */}
      <Card3D depth={8} className="glass-panel-3d rounded-2xl border border-slate-800 shadow-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Content Pipeline
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-sm">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white flex items-baseline gap-2">
          <span className="text-cyan-300">{summary.scheduledPosts}</span>
          <span className="text-xs font-normal text-slate-400">scheduled</span>
          <span>/</span>
          <span className="text-slate-300">{summary.draftPosts}</span>
          <span className="text-xs font-normal text-slate-400">drafts</span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          {summary.totalPosts} total created in library
        </div>
      </Card3D>
    </div>
  );
}
