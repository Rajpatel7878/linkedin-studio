'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Loader2, FileText, Mic, Sparkles, TrendingUp } from 'lucide-react';
import { KPIGrid } from '@/components/analytics/KPIGrid';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { PostLeaderboard } from '@/components/analytics/PostLeaderboard';
import { AnalyticsSummary, PostItem } from '@/types';
import { Card3D } from '@/components/ui/Card3D';

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
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            Studio Performance & Trends
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track engagement velocity, top-performing content templates, and voice resonance over time.
          </p>
        </div>

        <button
          onClick={handleSyncMetrics}
          className="btn-3d-glass flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
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
            <Card3D depth={8} className="glass-panel-3d rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Content Template Performance
              </h3>
              <div className="space-y-2.5">
                {summary.topTemplates?.slice(0, 5).map((tpl, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block line-clamp-1">{tpl.name}</span>
                      <span className="text-[10px] text-slate-400">{tpl.postCount} posts published</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-400">
                      {tpl.avgImpressions.toLocaleString()} avg views
                    </span>
                  </div>
                ))}
              </div>
            </Card3D>

            {/* Top Voices */}
            <Card3D depth={8} className="glass-panel-3d rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-400" />
                Voice Profile Resonance
              </h3>
              <div className="space-y-2.5">
                {summary.topVoices?.slice(0, 5).map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block line-clamp-1">{v.name}</span>
                      <span className="text-[10px] text-slate-400">{v.postCount} posts drafted</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      {v.avgEngagement} avg interactions
                    </span>
                  </div>
                ))}
              </div>
            </Card3D>
          </div>

          {/* Leaderboard Table */}
          <PostLeaderboard posts={posts} onSync={handleSyncMetrics} />
        </>
      )}
    </div>
  );
}
