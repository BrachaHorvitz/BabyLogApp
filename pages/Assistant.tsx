
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { Button, Input, BackButton } from '../components/UI';
import { getLogs } from '../services/storage';
import { getGeminiResponse } from '../services/geminiService';
import { t } from '../services/localization';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const Assistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: t('ai_intro') }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const recentLogs = getLogs();
    const responseText = await getGeminiResponse(userMsg.text, recentLogs);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
       <div className="p-4 flex items-center gap-2 border-b border-slate-800/50">
            <BackButton />
            <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    {t('ai_title')} <Sparkles className="w-3 h-3 text-indigo-400" />
                </h2>
                <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {t('online')}
                </div>
            </div>
       </div>

       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center me-2 mt-auto mb-1">
                            <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                    )}
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-be-sm' 
                        : 'bg-slate-800 text-slate-200 rounded-bs-sm'
                    }`}>
                        {m.text}
                    </div>
                </div>
            ))}
            {loading && (
                 <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center me-2 mt-auto mb-1">
                            <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm">
                        <span className="animate-pulse">{t('thinking')}</span>
                    </div>
                </div>
            )}
       </div>

       <div className="p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="flex gap-3 items-center bg-slate-900 p-2 rounded-3xl ring-1 ring-white/5">
                <Input 
                    placeholder={t('ask_placeholder')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="!bg-transparent !h-10 !text-sm border-none focus:ring-0 !px-2"
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()} size="md" className="aspect-square !px-0 w-10 !h-10 !rounded-full shrink-0">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
       </div>
    </div>
  );
};

export default Assistant;
