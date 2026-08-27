'use client';

import React from 'react';
import { BarChart, TrendingUp, Calendar, Clock } from 'lucide-react';
import { AnalyticsSummary } from '@/types';

interface PerformanceChartProps {
  summary: AnalyticsSummary;
}

export function PerformanceChart({ summary }: PerformanceChartProps) {
  const impressionsData = summary.impressionsByDay || [];
  const maxImp = Math.max(1, ...impressionsData.map((d) => d.impressions));

  const dayOfWeek = summary.dayOfWeekBreakdown || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 7-Day Impressions Velocity (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0a66c2]" />
              7-Day Impressions Velocity
            </h3>
            <p className="text-xs text-slate-500">
              Daily views generated across your published LinkedIn content.
            </p>
          </div>
        </div>

        {/* Bar Chart Visualizer */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
          {impressionsData.map((day, idx) => {
            const heightPercent = Math.max(12, Math.round((day.impressions / maxImp) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.impressions}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-[#0a66c2] to-blue-400 rounded-t-lg transition-all group-hover:from-[#004182] group-hover:to-blue-500 shadow-2xs"
                />
                <span className="text-[11px] font-semibold text-slate-600 mt-1 whitespace-nowrap">
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Posting Day & Timing Insights (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            Posting Heatmap & Timing
          </h3>
          <p className="text-xs text-slate-500">
            Average engagement by day of the week.
          </p>
        </div>

        <div className="space-y-2.5">
          {dayOfWeek.map((item) => {
            return (
              <div key={item.day} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 w-8">{item.day}</span>
                <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, item.count * 25)}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  {item.count} posts
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
          💡 <strong>Peak Performance Window:</strong> Tuesday & Thursday mornings (8:00 AM – 9:30 AM local time) see up to 2.4x higher comment engagement.
        </div>
      </div>
    </div>
  );
}
