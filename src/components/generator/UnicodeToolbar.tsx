'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Code,
  Underline,
  RotateCcw,
  Sparkles,
  Smile,
  List,
  Flame,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import {
  toBoldUnicode,
  toItalicUnicode,
  toMonoUnicode,
  toUnderlineUnicode,
  stripUnicodeFormatting,
} from '@/lib/unicodeFormat';

interface UnicodeToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  onChange: (newContent: string) => void;
  className?: string;
  onClear?: () => void;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Top Creator',
    icon: '🔥',
    emojis: ['🔥', '💡', '🚀', '📈', '🧠', '🎯', '👇', '✨', '⚡', '📌', '🤝', '💎', '🚨', '🏆', '💥', '⏳', '📣', '🔑', '🌱', '🌐'],
  },
  {
    name: 'Business & Tech',
    icon: '💼',
    emojis: ['📊', '💼', '📈', '💰', '💵', '🏢', '💻', '📱', '✍️', '📚', '🛠️', '🔍', '📉', '🤖', '⚙️', '✉️', '🔒', '🛡️', '📦', '🎯'],
  },
  {
    name: 'Faces & Gestures',
    icon: '😀',
    emojis: ['🤯', '🤩', '😎', '🤔', '🧐', '👏', '🙌', '🙏', '👍', '👌', '❤️', '💯', '🥳', '😂', '🤫', '👀', '💪', '🤝', '👋', '🎉'],
  },
  {
    name: 'Pointers & Numbers',
    icon: '👉',
    emojis: ['👇', '👆', '👉', '👈', '➡️', '⬇️', '⬆️', '🔄', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '✅', '❌'],
  },
  {
    name: 'Shapes & Badges',
    icon: '⭐️',
    emojis: ['⭐', '🌟', '✦', '✧', '🔷', '🔶', '🔘', '🟢', '🔴', '🟡', '🟣', '⬛', '⬜', '🛡️', '⚡', '💡', '🔥', '💎', '🏷️', '🔖'],
  },
];

export function UnicodeToolbar({
  textareaRef,
  content,
  onChange,
  className = '',
  onClear,
}: UnicodeToolbarProps) {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showBullets, setShowBullets] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);

  const applyFormatting = (formatter: (text: string) => string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(formatter(content));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      // If no text selected, apply to whole content or leave as is
      return;
    }

    const selectedText = content.substring(start, end);
    const formatted = formatter(selectedText);
    const updated = content.substring(0, start) + formatted + content.substring(end);

    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formatted.length);
    }, 10);
  };

  const insertTextAtCursor = (insertText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(content + insertText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = content.substring(0, start) + insertText + content.substring(end);

    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 10);
  };

  const bullets = [
    { label: 'Arrow →', symbol: '→ ' },
    { label: 'Sparkle ✦', symbol: '✦ ' },
    { label: 'Checkmark ✓', symbol: '✓ ' },
    { label: 'Bullet •', symbol: '• ' },
    { label: 'Lightning ⚡', symbol: '⚡ ' },
    { label: 'Pin 📌', symbol: '📌 ' },
    { label: 'Diamond 💎', symbol: '💎 ' },
    { label: 'Key 🔑', symbol: '🔑 ' },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner ${className}`}>
      {/* Text Style Controls */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => applyFormatting(toBoldUnicode)}
          title="Bold (Highlight text to bold)"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 font-bold transition-all flex items-center gap-1"
        >
          <Bold className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-sans font-bold">𝗕𝗼𝗹𝗱</span>
        </button>

        <button
          type="button"
          onClick={() => applyFormatting(toItalicUnicode)}
          title="Italic (Highlight text to italicize)"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1"
        >
          <Italic className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] italic font-serif">𝘐𝘵𝘢𝘭𝘪𝘤</span>
        </button>

        <button
          type="button"
          onClick={() => applyFormatting(toMonoUnicode)}
          title="Monospace (Code style)"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1"
        >
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono">𝙼𝚘𝚗𝚘</span>
        </button>

        <button
          type="button"
          onClick={() => applyFormatting(toUnderlineUnicode)}
          title="Underline text"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1"
        >
          <Underline className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        <button
          type="button"
          onClick={() => applyFormatting(stripUnicodeFormatting)}
          title="Clear / Reset formatting"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            title="Clear all editor text"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Clear</span>
          </button>
        )}
      </div>

      {/* Bullets & Full Emoji Palette */}
      <div className="flex items-center gap-1 relative">
        {/* Bullets Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowBullets(!showBullets);
              setShowEmojis(false);
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
              showBullets
                ? 'bg-blue-600/30 text-cyan-300 border-blue-500/50'
                : 'text-slate-300 hover:text-white bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <List className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bullets</span>
          </button>

          {showBullets && (
            <div className="absolute right-0 top-full mt-1.5 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 grid grid-cols-2 gap-1 w-48 animate-fade-in">
              {bullets.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => {
                    insertTextAtCursor(`\n${b.symbol}`);
                    setShowBullets(false);
                  }}
                  className="px-2 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span className="font-mono text-cyan-400 font-bold">{b.symbol}</span>
                  <span>{b.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Full Emoji Suite */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowEmojis(!showEmojis);
              setShowBullets(false);
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
              showEmojis
                ? 'bg-blue-600/30 text-cyan-300 border-blue-500/50'
                : 'text-slate-300 hover:text-white bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-yellow-400" />
            <span>All Emojis ({EMOJI_CATEGORIES.reduce((acc, cat) => acc + cat.emojis.length, 0)})</span>
          </button>

          {showEmojis && (
            <div className="absolute right-0 top-full mt-1.5 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 w-72 sm:w-80 space-y-2.5 animate-fade-in">
              {/* Category tabs */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar">
                {EMOJI_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveEmojiCategory(idx)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                      activeEmojiCategory === idx
                        ? 'bg-[#0a66c2] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Emoji grid */}
              <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      insertTextAtCursor(` ${emoji} `);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-base hover:bg-slate-800 rounded-xl transition-transform active:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span>Click any emoji to insert at cursor</span>
                <button
                  type="button"
                  onClick={() => setShowEmojis(false)}
                  className="text-cyan-400 hover:underline"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
