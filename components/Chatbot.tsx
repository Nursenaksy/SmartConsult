import React, { useState, useEffect, useRef, FormEvent } from 'react';
import type { AnalysisResponse, Message } from '../types';
import { createChatSession } from '../services/geminiService';
import type { Chat, GenerateContentResponse } from '@google/genai';
import LoadingSpinner from './LoadingSpinner';

interface ChatbotProps {
  initialAnalysis: AnalysisResponse;
  onBookAppointment: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ initialAnalysis, onBookAppointment }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            chatRef.current = createChatSession(initialAnalysis.summary);
            const initialMessage = `Merhaba! Ben SmartConsult. Ön analiz sonuçlarınla ilgili aklına takılan her şeyi sorabilirsin. Örneğin, 'iyileşme süreci nasıl işliyor?' veya 'operasyon günü beni neler bekliyor?' gibi sorular sorabilirsin.`;
            setMessages([{ role: 'model', text: initialMessage }]);
            setIsLoading(false);
        };
        initializeChat();
    }, [initialAnalysis.summary]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatRef.current || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const chat = chatRef.current;
        const modelMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const result = await chat.sendMessageStream({ message: input });
            let text = '';
            for await (const chunk of result) {
                // Fix: Access text directly from chunk
                text += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[modelMessageIndex] = { role: 'model', text };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[modelMessageIndex] = { role: 'model', text: "Üzgünüm, bir sorunla karşılaştım. Lütfen daha sonra tekrar dene." };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-slate-50">
            <header className="p-4 bg-white shadow-md z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img src="https://smilehairclinic.com/wp-content/uploads/2024/02/smile-hair-clinic-logo.svg" alt="Logo" className="h-8"/>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">SmartConsult</h1>
                            <p className="text-xs text-green-600 font-semibold flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>Online</p>
                        </div>
                    </div>
                     <button 
                        onClick={onBookAppointment}
                        className="bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                    >
                        Danışman Görüşmesi
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">🤖</div>}
                            <div className={`max-w-md md:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-yellow-400 text-slate-900 rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}{msg.role === 'model' && isLoading && index === messages.length - 1 && <span className="inline-block w-1 h-4 bg-slate-600 animate-ping ml-1"></span>}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-4 bg-white border-t">
                 <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Merak ettiklerini sor..."
                        className="flex-1 w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-yellow-400 text-slate-900 rounded-full hover:bg-yellow-500 disabled:bg-slate-300 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default Chatbot;
