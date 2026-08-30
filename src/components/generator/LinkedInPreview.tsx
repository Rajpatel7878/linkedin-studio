'use client';

import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Heart,
  Lightbulb,
  Smartphone,
  Monitor,
  Eye,
  Sparkles,
} from 'lucide-react';

interface LinkedInPreviewProps {
  content: string;
  authorName?: string;
  authorHeadline?: string;
  authorAvatar?: string;
  imageUrl?: string | null;
  timestamp?: string;
  isMobile?: boolean;
}

export function LinkedInPreview({
  content,
  authorName = 'Creator Profile',
  authorHeadline = 'Product Builder & Creator | LinkedIn Studio',
  authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  imageUrl,
  timestamp = 'Just now',
  isMobile: initialIsMobile = false,
}: LinkedInPreviewProps) {
  const [isMobileView, setIsMobileView] = useState(initialIsMobile);
  const [isExpanded, setIsExpanded] = useState(false);

  // Cutoff character limits
  const cutoffLimit = isMobileView ? 140 : 210;
  const isLong = content.length > cutoffLimit;
  const displayContent = !isLong || isExpanded ? content : content.slice(0, cutoffLimit);

  // Format content text into paragraphs
  const paragraphs = displayContent ? displayContent.split('\n') : ['Your generated LinkedIn post draft will appear here in real-time...'];

  return (
    <div className="space-y-3">
      {/* Device Switcher Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Feed Cutoff Simulator</span>
        </span>

        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => {
              setIsMobileView(false);
              setIsExpanded(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-semibold ${
              !isMobileView
                ? 'bg-[#0a66c2] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Desktop (~210c)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMobileView(true);
              setIsExpanded(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-semibold ${
              isMobileView
                ? 'bg-[#0a66c2] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile (~140c)</span>
          </button>
        </div>
      </div>

      {/* Simulated LinkedIn Post Card */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-900 transition-all ${
          isMobileView ? 'max-w-[340px] mx-auto text-xs' : 'w-full'
        }`}
      >
        {/* Header with Author info & LinkedIn icon */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-900 hover:text-[#0a66c2] hover:underline cursor-pointer">
                  {authorName}
                </span>
                <span className="text-xs text-slate-400 font-normal">• 1st</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-[240px]">
                {authorHeadline}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <span>{timestamp}</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Main Post Content with Cutoff */}
        <div className="px-4 pb-3 text-[13.5px] leading-relaxed text-slate-800 font-normal select-text space-y-1">
          {paragraphs.map((line, idx) => {
            if (!line.trim()) {
              return <div key={idx} className="h-1.5" />;
            }

            const parts = line.split(/(#[a-zA-Z0-9_]+)/g);

            return (
              <p key={idx} className="whitespace-pre-wrap break-words">
                {parts.map((part, pIdx) =>
                  part.startsWith('#') ? (
                    <span
                      key={pIdx}
                      className="text-[#0a66c2] font-medium hover:underline cursor-pointer"
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={pIdx}>{part}</span>
                  )
                )}
              </p>
            );
          })}

          {isLong && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-500 hover:text-[#0a66c2] font-medium text-xs pt-1 hover:underline block"
            >
              {isExpanded ? '...show less' : '...see more'}
            </button>
          )}
        </div>

        {/* Attached Media / Graphic Card Image */}
        {imageUrl && (
          <div className="w-full bg-slate-50 border-y border-slate-100 overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Post graphic"
              className="w-full max-h-[360px] object-contain"
            />
          </div>
        )}

        {/* Social Reactions Counter Bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1 items-center">
              <span className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center text-white shadow-2xs">
                <ThumbsUp className="w-2.5 h-2.5 fill-current" />
              </span>
              <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white shadow-2xs">
                <Heart className="w-2.5 h-2.5 fill-current" />
              </span>
              <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-2xs">
                <Lightbulb className="w-2.5 h-2.5 fill-current" />
              </span>
            </div>
            <span className="text-slate-500 font-normal">142</span>
          </div>
          <div className="flex items-center gap-3">
            <span>28 comments</span>
            <span>•</span>
            <span>7 reposts</span>
          </div>
        </div>

        {/* Action Buttons (Like, Comment, Repost, Send) */}
        <div className="px-2 py-1 grid grid-cols-4 gap-1 text-slate-600 font-medium text-xs">
          <button className="flex items-center justify-center gap-1 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Like</span>
          </button>
          <button className="flex items-center justify-center gap-1 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Comment</span>
          </button>
          <button className="flex items-center justify-center gap-1 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Repeat2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Repost</span>
          </button>
          <button className="flex items-center justify-center gap-1 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Send className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
