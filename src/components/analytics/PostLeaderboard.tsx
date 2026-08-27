'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Trophy,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Eye,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PostItem } from '@/types';

interface PostLeaderboardProps {
  posts: PostItem[];
  onSync: () => Promise<void>;
}

export function PostLeaderboard({ posts, onSync }: PostLeaderboardProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const publishedPosts = posts
    .filter((p) => p.status === 'PUBLISHED')
    .sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares));

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Performing Content Leaderboard
          </h3>
          <p className="text-xs text-slate-500">
            Ranked by total engagement (likes, comments, reposts).
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0a66c2]' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Fresh Metrics'}</span>
        </button>
      </div>

      {/* Table */}
      {publishedPosts.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400">
          No published posts yet. Publish or schedule a draft to see analytics!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Post & Topic</th>
                <th className="py-3 px-4">Tone</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4 text-right">Impressions</th>
                <th className="py-3 px-4 text-right">Likes</th>
                <th className="py-3 px-4 text-right">Comments</th>
                <th className="py-3 px-4 text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {publishedPosts.map((post, idx) => {
                const totalInteractions = post.likes + post.comments + post.shares;
                const engRate =
                  post.impressions > 0
                    ? ((totalInteractions / post.impressions) * 100).toFixed(1)
                    : '0.0';

                return (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-400">
                      {idx === 0 ? (
                        <span className="text-amber-500 text-sm font-black">🥇 1</span>
                      ) : idx === 1 ? (
                        <span className="text-slate-400 text-sm font-black">🥈 2</span>
                      ) : idx === 2 ? (
                        <span className="text-amber-700 text-sm font-black">🥉 3</span>
                      ) : (
                        idx + 1
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1 mb-0.5">
                        {post.topic || 'LinkedIn Post'}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 font-normal">
                        {post.content}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[10px] font-semibold text-[#0a66c2] bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {post.tone}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '—'}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                      {post.impressions.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-blue-600 font-semibold">
                      {post.likes}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-700 font-semibold">
                      {post.comments}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-600">
                      {engRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
