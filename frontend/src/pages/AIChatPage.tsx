import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Send, Bot, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIChatPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '안녕하세요. 무엇을 도와드릴까요?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.chat(user?.role || 'PATIENT', [...messages, userMsg]);

            const assistantMsg = {
                role: 'assistant' as const,
                content: response.message || "죄송합니다. 응답을 생성할 수 없습니다."
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'assistant', content: error?.message || '오류가 발생했습니다. 다시 시도해주세요.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col max-w-4xl mx-auto">
            <Card className="flex-1 flex flex-col overflow-hidden border-brand-200 shadow-md">
                <CardHeader className="bg-brand-50 border-b border-brand-100 py-4">
                    <CardTitle className="flex items-center text-lg">
                        <Bot className="w-6 h-6 mr-2 text-brand-600" />
                        AI {user?.role === 'PATIENT' ? '상담소' : user?.role === 'DOCTOR' ? 'Clinical Assistant' : '설계 지원'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-brand-600 text-white rounded-br-none'
                                        : 'bg-brand-50 text-brand-900 rounded-bl-none border border-brand-100'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-brand-50 rounded-2xl px-4 py-3 rounded-bl-none border border-brand-100 flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                            </div>
                        </div>
                    )}
                </CardContent>

                <div className="p-4 bg-white border-t border-brand-100">
                    <div className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="text-center mt-2 text-xs text-brand-400">
                AI의 답변은 부정확할 수 있으며 의학적 진단을 대체하지 않습니다.
            </div>
        </div>
    );
};

export default AIChatPage;
