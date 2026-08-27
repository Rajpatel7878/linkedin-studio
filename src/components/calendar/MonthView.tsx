'use client';

import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { PostItem } from '@/types';

interface MonthViewProps {
  posts: PostItem[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSelectPost: (post: PostItem) => void;
  onCreateForDate: (date: Date) => void;
}

export function MonthView({
  posts,
  currentDate,
  onDateChange,
  onSelectPost,
  onCreateForDate,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'QUEUED_RATE_LIMITED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <h2 className="text-lg font-bold text-slate-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Today
          </button>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
            <button
              onClick={() => onDateChange(subMonths(currentDate, 1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-l-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDateChange(addMonths(currentDate, 1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-r-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-500 py-2.5">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[580px]">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          // Find posts scheduled or published on this day
          const dayPosts = posts.filter((p) => {
            const dateToCheck = p.scheduledAt || p.publishedAt || p.createdAt;
            return dateToCheck && isSameDay(new Date(dateToCheck), day);
          });

          return (
            <div
              key={day.toISOString()}
              className={`p-2 min-h-[100px] flex flex-col justify-between group transition-colors ${
                isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-300'
              } ${isCurrentDay ? 'bg-blue-50/30' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                    isCurrentDay
                      ? 'bg-[#0a66c2] text-white shadow-2xs'
                      : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                <button
                  onClick={() => onCreateForDate(day)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0a66c2] hover:bg-blue-50 rounded transition-opacity"
                  title="Plan post on this day"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Posts Pills */}
              <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-none flex-1">
                {dayPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className={`w-full text-left p-1.5 rounded-lg border text-[11px] font-medium truncate flex items-center gap-1.5 shadow-2xs hover:scale-[1.02] transition-transform ${getStatusColor(
                      post.status
                    )}`}
                  >
                    {post.scheduledAt && (
                      <span className="text-[9px] opacity-75 font-mono">
                        {format(new Date(post.scheduledAt), 'HH:mm')}
                      </span>
                    )}
                    <span className="truncate">{post.topic || post.content.slice(0, 20)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
