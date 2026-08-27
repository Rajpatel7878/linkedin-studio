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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Published
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Scheduled
          </span>
        );
      case 'QUEUED_RATE_LIMITED':
        return (
          <span
            title={errorMessage || 'Rate limit queued'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Queued (Rate Limited)
          </span>
        );
      case 'FAILED':
        return (
          <span
            title={errorMessage || 'Failed'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
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
                ? 'bg-[#0a66c2] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedStatus === tab.key
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No posts in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create a new draft in the Post Generator and schedule or save it.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Topic, Content Preview, Metadata */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  {getStatusBadge(post.status, post.errorMessage)}
                  <span className="text-[11px] font-semibold text-[#0a66c2] bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                    {post.tone}
                  </span>
                  {post.scheduledAt && (
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Scheduled for {format(new Date(post.scheduledAt), 'MMM d, yyyy @ h:mm a')}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Published on {format(new Date(post.publishedAt), 'MMM d, yyyy @ h:mm a')}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {post.topic || 'LinkedIn Post Draft'}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Published Performance Telemetry (if published) */}
                {post.status === 'PUBLISHED' && (
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">
                      {post.impressions} impressions
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-blue-600" /> {post.likes}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" /> {post.comments}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Quick Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={() => onEditPost(post)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {post.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => onPublishPost(post)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </button>
                )}

                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
