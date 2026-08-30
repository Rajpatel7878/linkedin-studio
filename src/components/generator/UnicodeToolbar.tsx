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
}

export function UnicodeToolbar({
  textareaRef,
  content,
  onChange,
  className = '',
}: UnicodeToolbarProps) {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showBullets, setShowBullets] = useState(false);

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

  const emojis = ['🔥', '💡', '🚀', '📈', '🧠', '🎯', '👇', '✨', '⚡', '📌', '🤝', '💎'];
  const bullets = [
    { label: 'Arrow →', symbol: '→ ' },
    { label: 'Sparkle ✦', symbol: '✦ ' },
    { label: 'Checkmark ✓', symbol: '✓ ' },
    { label: 'Bullet •', symbol: '• ' },
    { label: 'Lightning ⚡', symbol: '⚡ ' },
    { label: 'Pin 📌', symbol: '📌 ' },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner ${className}`}>
      {/* Text Style Controls */}
      <div className="flex items-center gap-1">
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
      </div>

      {/* Bullets & Emojis Controls */}
      <div className="flex items-center gap-1 relative">
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
            <div className="absolute right-0 top-full mt-1.5 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 grid grid-cols-2 gap-1 w-44 animate-fade-in">
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
            <span>Emojis</span>
          </button>

          {showEmojis && (
            <div className="absolute right-0 top-full mt-1.5 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-wrap gap-1.5 w-48 animate-fade-in">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    insertTextAtCursor(` ${emoji} `);
                    setShowEmojis(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center text-sm hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
