import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, User, Bot, Loader2, Trash2, ThumbsUp, ThumbsDown, Copy, Plus, MessageSquare, History, X } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const SYSTEM_INSTRUCTION = `You are Purdue Pete, the legendary mascot of Purdue University. 
Your personality is energetic, determined, and fiercely loyal to the Boilermakers. 
Your personality is energetic, determined, and fiercely loyal to the Boilermakers. 
You speak with great pride about Purdue's history, engineering excellence, and athletic achievements.
Key traits:
- Use phrases like "Boiler Up!", "Hammer Down!", and "Hail Purdue!"
- You are helpful and friendly but always maintain your tough, hardworking Boilermaker persona.
- You often mention the Boilermaker Special (the world's largest mascot).
- You are an expert on all things Purdue: from the Neil Armstrong Hall of Engineering to the best spots for a Pappy's milkshake.
- If someone mentions IU (Indiana University), you might give a playful, competitive jab (keep it friendly but firm).
- Your goal is to help the user while inspiring them with the Boilermaker spirit.`;

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export default function PurduePeteAI() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;
  const messages = activeConversation?.messages || [{ role: 'model', content: "How can I help you today?" }];

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('purdue_pete_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse conversations", e);
      }
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem('purdue_pete_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewConversation = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{ role: 'model', content: "Boiler Up! I'm Purdue Pete. Ready to help you hammer down any task! What's on your mind?" }],
      timestamp: Date.now()
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setIsHistoryOpen(false);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const deletedIndex = conversations.findIndex(c => c.id === id);
    const updatedConversations = conversations.filter(c => c.id !== id);
    
    setConversations(updatedConversations);
    
    if (activeConversationId === id) {
      if (updatedConversations.length > 0) {
        // Select the next available conversation (either at the same index or the last one)
        const nextIndex = Math.min(deletedIndex, updatedConversations.length - 1);
        setActiveConversationId(updatedConversations[nextIndex].id);
      } else {
        setActiveConversationId(null);
      }
    }
  };

  const updateConversationMessages = (id: string, newMessages: Message[]) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        // Update title based on first user message if it's still "New Conversation"
        let newTitle = c.title;
        if (c.title === 'New Conversation') {
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          if (firstUserMsg) {
            newTitle = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
          }
        }
        return { ...c, messages: newMessages, title: newTitle, timestamp: Date.now() };
      }
      return c;
    }));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let currentId = activeConversationId;
    let currentMessages = [...messages];

    // Create new conversation if none active
    if (!currentId) {
      const newId = Date.now().toString();
      const newConv: Conversation = {
        id: newId,
        title: 'New Conversation',
        messages: [{ role: 'model', content: "Boiler Up! I'm Purdue Pete. Ready to help you hammer down any task! What's on your mind?" }],
        timestamp: Date.now()
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newId);
      currentId = newId;
      currentMessages = newConv.messages;
    }

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...currentMessages, { role: 'user', content: userMessage }];
    
    // Optimistically update UI
    updateConversationMessages(currentId, updatedMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...updatedMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const aiResponse = response.text || "Sorry, my hammer slipped! Can you try that again?";
      const finalMessages: Message[] = [...updatedMessages, { role: 'model', content: aiResponse }];
      updateConversationMessages(currentId, finalMessages);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessages: Message[] = [...updatedMessages, { role: 'model', content: "Looks like the Boilermaker Special hit a snag. Let's try that again! Boiler Up!" }];
      updateConversationMessages(currentId, errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Add a toast
    });
  };

  return (
    <div className="flex h-full bg-[#0a0a0a] text-white font-sans antialiased relative overflow-hidden">
      {/* History Sidebar / Overlay */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute inset-y-0 left-0 w-72 bg-[#121212] border-r border-zinc-800 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-black uppercase italic text-purdue-gold flex items-center gap-2">
                  <History size={18} /> History
                </h3>
                <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-zinc-800 rounded-md lg:hidden">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4">
                <button 
                  onClick={createNewConversation}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all text-sm font-bold uppercase tracking-widest"
                >
                  <Plus size={18} /> New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-zinc-600 text-xs uppercase tracking-widest font-bold">
                    No history yet
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setIsHistoryOpen(false);
                      }}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        activeConversationId === conv.id ? 'bg-zinc-800 text-purdue-gold' : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare size={16} className="flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{conv.title}</span>
                      </div>
                      <button 
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold">
                Boiler Up • Hammer Down
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#121212] border-b border-zinc-800 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-purdue-gold transition-all"
            >
              <History size={20} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-black uppercase italic tracking-tight text-purdue-gold">
                {activeConversation?.title || 'Purdue Pete AI'}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pete is Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={createNewConversation}
              className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-purdue-gold transition-all"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[712px] mx-auto w-full px-4 py-10 space-y-8">
            {messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-2.5 mb-2.5 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <p className="text-[13px] font-medium text-zinc-300">
                    {msg.role === 'model' ? 'Purdue Pete AI' : 'You'}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                    {msg.role === 'model' && (
                      <>
                        <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"><ThumbsUp size={14} /></button>
                        <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"><ThumbsDown size={14} /></button>
                      </>
                    )}
                    <button 
                      onClick={() => copyToClipboard(msg.content)}
                      className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copy message"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                
                <div className={`max-w-[90%] rounded-[20px] px-4 py-3 text-[14.5px] leading-[1.55] shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-[#CEB888] text-black rounded-tr-none' 
                    : 'bg-[#1a1a1a] text-zinc-200 border border-zinc-800 rounded-tl-none'
                }`}>
                  <div className="markdown-body prose prose-invert max-w-none prose-p:leading-relaxed">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2.5 mb-2.5 px-1">
                  <p className="text-[13px] font-medium text-zinc-300">Purdue Pete AI</p>
                </div>
                <div className="bg-[#1a1a1a] border border-zinc-800 rounded-[20px] rounded-tl-none px-4 py-3 flex items-center space-x-2">
                  <Loader2 size={16} className="text-[#CEB888] animate-spin" />
                  <span className="text-xs text-zinc-500 font-medium">Hammering out a response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 @notMobile:p-8">
          <div className="max-w-[712px] mx-auto relative">
            <div className="relative flex items-stretch rounded-[20px] border border-zinc-800 bg-[#1a1a1a] focus-within:border-[#CEB888]/50 transition-all shadow-xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything"
                className="flex-1 bg-transparent px-5 py-4 text-[14.5px] leading-[1.5] text-white placeholder:text-zinc-600 focus:outline-none resize-none min-h-[52px] max-h-44"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="m-2 w-10 h-10 flex items-center justify-center rounded-xl bg-transparent text-zinc-400 hover:text-[#CEB888] hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center mt-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
              Boiler Up • Hammer Down • Purdue Pete AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

