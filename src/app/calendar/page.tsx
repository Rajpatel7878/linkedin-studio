'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  RefreshCw,
  Clock,
  Send,
  Loader2,
} from 'lucide-react';
import { MonthView } from '@/components/calendar/MonthView';
import { ListView } from '@/components/calendar/ListView';
import { PostEditorModal } from '@/components/generator/PostEditorModal';
import { PostItem } from '@/types';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Editor Modal
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [defaultScheduleDate, setDefaultScheduleDate] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSelectPost = (post: PostItem) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleCreateForDate = (date: Date) => {
    // Set schedule time to 9:00 AM on that day
    const scheduledTime = new Date(date);
    scheduledTime.setHours(9, 0, 0, 0);

    setEditingPost({
      id: '',
      topic: '',
      content: '',
      tone: 'professional',
      status: 'SCHEDULED',
      scheduledAt: scheduledTime.toISOString(),
      publishedAt: null,
      linkedinPostUrn: null,
      imageUrl: null,
      mediaType: 'NONE',
      errorMessage: null,
      retryCount: 0,
      lastRetryAt: null,
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      voiceProfileId: null,
    });
    setIsEditorOpen(true);
  };

  const handlePublishPost = async (post: PostItem) => {
    if (!confirm('Publish this post directly to LinkedIn now?')) return;
    try {
      const res = await fetch(`/api/posts/${post.id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Post published successfully!');
        fetchPosts();
      } else {
        alert(data.error || data.message || 'Publishing failed');
        fetchPosts();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-[#0a66c2]" />
            Content Calendar & Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Plan, schedule, and monitor your upcoming and published LinkedIn content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Calendar / List View Mode Toggle */}
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#0a66c2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#0a66c2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List Pipeline</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingPost(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
        </div>
      ) : viewMode === 'calendar' ? (
        <MonthView
          posts={posts}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onSelectPost={handleSelectPost}
          onCreateForDate={handleCreateForDate}
        />
      ) : (
        <ListView
          posts={posts}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onEditPost={handleSelectPost}
          onPublishPost={handlePublishPost}
          onDeletePost={handleDeletePost}
        />
      )}

      {/* Post Editor Modal */}
      {isEditorOpen && (
        <PostEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingPost(null);
          }}
          initialTopic={editingPost?.topic || ''}
          initialContent={editingPost?.content || ''}
          initialTone={editingPost?.tone || 'professional'}
          initialImageUrl={editingPost?.imageUrl || null}
          postId={editingPost?.id || null}
          onSaved={() => {
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
