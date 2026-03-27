import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, X, MessageSquare, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import GeminiService from '../services/GeminiService';
import { translations } from '../utils/translations';

const AdvisorChat = ({ context, language = 'en' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const t = translations[language];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim() || isLoading) return;

        const userMessage = { role: 'user', text: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const gemini = new GeminiService();
            const response = await gemini.talkToAdvisor(text, context, language);
            setMessages(prev => [...prev, { role: 'bot', text: response.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I am having trouble connecting. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [t.q1, t.q2, t.q3];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen ? (
                <div className="w-80 md:w-96 h-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-medical-400" />
                            <h3 className="font-bold text-sm tracking-tight">{t.advisor_title}</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <Bot className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium px-4">
                                    {language === 'en'
                                        ? "Hello! I am your clinical advisor. Ask me anything about the ulcer classification."
                                        : "Habari! Mimi ni mshauri wako wa kliniki. Niulize chochote kuhusu uainishaji wa kidonda hiki."}
                                </p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={cn(
                                "flex gap-2 max-w-[85%]",
                                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}>
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    m.role === 'user' ? "bg-medical-600 text-white" : "bg-white border border-slate-200 text-slate-700"
                                )}>
                                    <p className="text-xs font-medium leading-relaxed">{m.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-2 mr-auto">
                                <div className="bg-white border border-slate-200 p-2 rounded-lg animate-pulse">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 0 && (
                        <div className="p-2 border-t border-slate-100 bg-white">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-2 px-2">{t.common_questions}</p>
                            <div className="flex flex-wrap gap-1">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="text-[10px] bg-slate-100 hover:bg-medical-50 hover:text-medical-600 border border-slate-200 rounded-md px-2 py-1 font-bold text-slate-600 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-3 bg-white border-t border-slate-100 flex gap-2"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t.advisor_placeholder}
                            className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-medical-500 outline-none font-medium"
                        />
                        <button
                            disabled={!input.trim() || isLoading}
                            className="p-2 bg-medical-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2 group"
                >
                    <div className="relative">
                        <MessageSquare className="w-6 h-6" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-medical-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <span className="font-bold text-sm pr-2">{t.advisor_title}</span>
                </button>
            )}
        </div>
    );
};

export default AdvisorChat;
