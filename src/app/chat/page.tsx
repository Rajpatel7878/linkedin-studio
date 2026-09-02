'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Mic,
  Copy,
  Check,
  Edit3,
  Bookmark,
  Share2,
  Image as ImageIcon,
  Flame,
  Plus,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { PostEditorModal } from '@/components/generator/PostEditorModal';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  extractedPost?: string | null;
  hookScore?: number;
  ragDocsUsed?: number;
}

interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  tags?: string | null;
}

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 **Welcome to your LinkedIn AI Copilot!**

I am equipped with your **RAG Knowledge Base** and **Voice DNA**. Tell me what you'd like to create:

• *"Turn our company whitepaper into a viral 4-point breakdown post"*
• *"Draft a contrarian thought-leadership post about AI in my authentic tone"*
• *"Brainstorm 5 scroll-stopping hooks for my next post"*
• *"Rewrite this case study into a high-converting story post"*

Every post I generate can be **posted directly to LinkedIn in 1 click**! 🚀`,
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceProfiles, setVoiceProfiles] = useState<any[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  
  // Knowledge Base State
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [showKnowledgeDrawer, setShowKnowledgeDrawer] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('company_info');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // Studio Editor Modal State
  const [activeEditPost, setActiveEditPost] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Voice Profiles
    fetch('/api/voice')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.voiceProfiles) {
          setVoiceProfiles(d.voiceProfiles);
          const defaultVoice = d.voiceProfiles.find((v: any) => v.isDefault);
          if (defaultVoice) setSelectedVoiceId(defaultVoice.id);
        }
      })
      .catch(console.error);

    // Load Knowledge Docs
    loadKnowledgeDocs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadKnowledgeDocs = () => {
    fetch('/api/knowledge')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.documents) {
          setKnowledgeDocs(d.documents);
        }
      })
      .catch(console.error);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          voiceProfileId: selectedVoiceId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          extractedPost: data.extractedPost,
          hookScore: data.hookScore || 95,
          ragDocsUsed: data.ragDocsUsed || knowledgeDocs.length,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ Error: ${data.error || 'Failed to generate response.'}`,
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Connection error: ${e.message}`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPost = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDirectLinkedInPost = (content: string) => {
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveDraft = async (content: string) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: content.slice(0, 60) + '...',
          content,
          status: 'DRAFT',
          tone: 'professional',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusNotification('✓ Saved post to your drafts library!');
        setTimeout(() => setStatusNotification(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddKnowledgeDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    setIsAddingDoc(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDocTitle.trim(),
          content: newDocContent.trim(),
          category: newDocCategory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewDocTitle('');
        setNewDocContent('');
        loadKnowledgeDocs();
        setStatusNotification('✓ Document added to RAG Knowledge Base!');
        setTimeout(() => setStatusNotification(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingDoc(false);
    }
  };

  const handleDeleteKnowledgeDoc = async (id: string) => {
    try {
      await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' });
      setKnowledgeDocs(knowledgeDocs.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const quickPrompts = [
    '🎯 Draft a viral contrarian post about my industry in my authentic voice',
    '📊 Turn our Knowledge Base case study into a 4-point breakdown post',
    '🎣 Generate 5 scroll-stopping hooks with high viral scores',
    '💡 Create a 3-part LinkedIn post series from our product notes',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d121f]/90 border border-slate-800/80 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0a66c2] via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white">
                LinkedIn AI Copilot & RAG Chat
              </h1>
              <span className="text-[10px] font-mono font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                RAG LLM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct-to-LinkedIn conversational writer with custom knowledge retrieval
            </p>
          </div>
        </div>

        {/* Controls: Voice Profile + Knowledge Base Button */}
        <div className="flex items-center gap-2.5">
          {voiceProfiles.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="bg-transparent text-cyan-300 font-semibold focus:outline-hidden cursor-pointer max-w-[120px] truncate"
              >
                {voiceProfiles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowKnowledgeDrawer(!showKnowledgeDrawer)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
              showKnowledgeDrawer
                ? 'bg-blue-600/30 text-cyan-300 border-blue-500/60'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Knowledge Base ({knowledgeDocs.length})</span>
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {statusNotification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Chat & Knowledge Base Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chat Messages Container */}
        <div className={`${showKnowledgeDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col h-full glass-panel-3d rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl`}>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-full ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`space-y-3 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed max-w-[90%] sm:max-w-[82%] shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans select-text">
                    {msg.content}
                  </div>

                  {/* 1-Click Action Bar for AI Responses */}
                  {msg.role === 'assistant' && msg.id !== 'welcome-msg' && (
                    <div className="pt-3 mt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1-Click Direct Post to LinkedIn */}
                        <button
                          type="button"
                          onClick={() => handleDirectLinkedInPost(msg.extractedPost || msg.content)}
                          className="btn-3d-primary flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow-md active:scale-95"
                          title="Open directly in LinkedIn Composer"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                          <span>Direct Post</span>
                        </button>

                        {/* Edit in Studio */}
                        <button
                          type="button"
                          onClick={() => setActiveEditPost(msg.extractedPost || msg.content)}
                          className="flex items-center gap-1 text-xs font-semibold text-cyan-300 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/40 px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Edit in Studio</span>
                        </button>

                        {/* Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopyPost(msg.extractedPost || msg.content, msg.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* Save Draft */}
                        <button
                          type="button"
                          onClick={() => handleSaveDraft(msg.extractedPost || msg.content)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Save</span>
                        </button>
                      </div>

                      {/* Hook score badge */}
                      {msg.hookScore && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <Flame className="w-3 h-3 text-yellow-400" />
                          <span>Viral Score: {msg.hookScore}/100</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 text-right pt-0.5">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-cyan-300 bg-slate-900/80 border border-cyan-500/30 p-3.5 rounded-2xl w-fit animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Retrieving knowledge context & drafting LinkedIn post...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Inspo Chips */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap">
              Quick Inspo:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1 rounded-xl whitespace-nowrap transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Chat Box */}
          <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Copilot: e.g. Write a LinkedIn post from my knowledge base about..."
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400 shadow-inner"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="btn-3d-primary p-3 sm:px-5 sm:py-3 rounded-2xl text-white font-bold text-xs shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-cyan-200" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Knowledge Base Side Drawer (RAG Context Manager) */}
        {showKnowledgeDrawer && (
          <div className="lg:col-span-4 flex flex-col h-full glass-panel-3d rounded-3xl border border-slate-800 p-4 space-y-4 overflow-y-auto animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">RAG Knowledge Base</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKnowledgeDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add New Knowledge Doc Form */}
            <form onSubmit={handleAddKnowledgeDoc} className="space-y-2.5 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-cyan-300 block">
                + Ingest New Knowledge Document
              </span>
              <input
                type="text"
                required
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                placeholder="Doc Title (e.g. Q3 Company Case Study)"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400"
              />
              <textarea
                rows={3}
                required
                value={newDocContent}
                onChange={(e) => setNewDocContent(e.target.value)}
                placeholder="Paste insights, metrics, product features, or case study notes..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-cyan-400 resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="px-2 py-1 text-[11px] rounded-lg border border-slate-700 bg-slate-900 text-slate-300"
                >
                  <option value="company_info">Company Info</option>
                  <option value="case_study">Case Study</option>
                  <option value="product">Product Notes</option>
                  <option value="swipe_file">Swipe File</option>
                </select>

                <button
                  type="submit"
                  disabled={isAddingDoc}
                  className="btn-3d-primary px-3 py-1.5 text-white font-bold text-xs rounded-xl shadow-md active:scale-95"
                >
                  {isAddingDoc ? 'Ingesting...' : 'Add to RAG'}
                </button>
              </div>
            </form>

            {/* Existing Documents List */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              <span className="text-[11px] font-bold text-slate-400 block">
                Active Knowledge Documents ({knowledgeDocs.length}):
              </span>
              {knowledgeDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-1 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">
                      {doc.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteKnowledgeDoc(doc.id)}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] uppercase font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded inline-block">
                    {doc.category}
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {doc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Studio Post Editor Modal */}
      {activeEditPost && (
        <PostEditorModal
          isOpen={true}
          onClose={() => setActiveEditPost(null)}
          initialTopic="LinkedIn Post from AI Copilot"
          initialContent={activeEditPost}
          onSaved={() => {
            setActiveEditPost(null);
            setStatusNotification('✓ Post saved to drafts library!');
            setTimeout(() => setStatusNotification(null), 3000);
          }}
          onOpenStudio={(text) => router.push(`/card-studio?text=${encodeURIComponent(text)}`)}
        />
      )}
    </div>
  );
}
