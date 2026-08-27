'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Loader2, FileText, Mic, Sparkles, TrendingUp } from 'lucide-react';
import { KPIGrid } from '@/components/analytics/KPIGrid';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { PostLeaderboard } from '@/components/analytics/PostLeaderboard';
import { AnalyticsSummary, PostItem } from '@/types';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSyncMetrics = async () => {
    try {
      const res = await fetch('/api/analytics/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#0a66c2]" />
            Studio Performance & Trends
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track engagement velocity, top-performing content templates, and voice resonance over time.
          </p>
        </div>

        <button
          onClick={handleSyncMetrics}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#0a66c2]" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {summary && (
        <>
          {/* KPI Highlight Grid */}
          <KPIGrid summary={summary} />

          {/* Velocity & Heatmap Charts */}
          <PerformanceChart summary={summary} />

          {/* Template & Voice Resonance Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Templates */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0a66c2]" />
                Content Template Performance
              </h3>
              <div className="space-y-2.5">
                {summary.topTemplates?.slice(0, 5).map((tpl, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block line-clamp-1">{tpl.name}</span>
                      <span className="text-[10px] text-slate-400">{tpl.postCount} posts published</span>
                    </div>
                    <span className="font-mono font-bold text-[#0a66c2]">
                      {tpl.avgImpressions.toLocaleString()} avg views
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Voices */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-600" />
                Voice Profile Resonance
              </h3>
              <div className="space-y-2.5">
                {summary.topVoices?.slice(0, 5).map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block line-clamp-1">{v.name}</span>
                      <span className="text-[10px] text-slate-400">{v.postCount} posts drafted</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">
                      {v.avgEngagement} avg interactions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <PostLeaderboard posts={posts} onSync={handleSyncMetrics} />
        </>
      )}
    </div>
  );
}
