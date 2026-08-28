'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Send,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { PostItem, PostStatus } from '@/types';
import { Card3D } from '@/components/ui/Card3D';

interface ListViewProps {
  posts: PostItem[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onEditPost: (post: PostItem) => void;
  onPublishPost: (post: PostItem) => void;
  onDeletePost: (id: string) => void;
}

export function ListView({
  posts,
  selectedStatus,
  onStatusChange,
  onEditPost,
  onPublishPost,
  onDeletePost,
}: ListViewProps) {
  const filteredPosts =
    selectedStatus === 'ALL'
      ? posts
      : posts.filter((p) => p.status === selectedStatus);

  const getStatusBadge = (status: PostStatus, errorMessage?: string | null) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Published
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-cyan-300 border border-blue-500/40">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Scheduled
          </span>
        );
      case 'QUEUED_RATE_LIMITED':
        return (
          <span
            title={errorMessage || 'Rate limit queued'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Queued (Rate Limited)
          </span>
        );
      case 'FAILED':
        return (
          <span
            title={errorMessage || 'Failed'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-500/40"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { label: 'All Posts', key: 'ALL', count: posts.length },
          { label: 'Drafts', key: 'DRAFT', count: posts.filter((p) => p.status === 'DRAFT').length },
          { label: 'Scheduled', key: 'SCHEDULED', count: posts.filter((p) => p.status === 'SCHEDULED').length },
          { label: 'Published', key: 'PUBLISHED', count: posts.filter((p) => p.status === 'PUBLISHED').length },
          {
            label: 'Queued (Rate Limited)',
            key: 'QUEUED_RATE_LIMITED',
            count: posts.filter((p) => p.status === 'QUEUED_RATE_LIMITED').length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onStatusChange(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedStatus === tab.key
                ? 'bg-[#0a66c2] text-white shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedStatus === tab.key
                  ? 'bg-blue-900 text-white font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="glass-panel-3d rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No posts in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create a new draft in the Post Generator and schedule or save it.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Card3D
              key={post.id}
              depth={5}
              className="glass-panel-3d border border-slate-800 p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              {/* Left Column: Topic, Content Preview, Metadata */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  {getStatusBadge(post.status, post.errorMessage)}
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md uppercase">
                    {post.tone}
                  </span>
                  {post.scheduledAt && (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Scheduled for {format(new Date(post.scheduledAt), 'MMM d, yyyy @ h:mm a')}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Published on {format(new Date(post.publishedAt), 'MMM d, yyyy @ h:mm a')}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-1">
                  {post.topic || 'LinkedIn Post Draft'}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Published Performance Telemetry (if published) */}
                {post.status === 'PUBLISHED' && (
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="font-semibold text-cyan-300">
                      {post.impressions} impressions
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-400" /> {post.likes}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {post.comments}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Quick Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={() => onEditPost(post)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Edit</span>
                </button>

                {post.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => onPublishPost(post)}
                    className="btn-3d-primary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Publish</span>
                  </button>
                )}

                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card3D>
          ))}
        </div>
      )}
    </div>
  );
}
