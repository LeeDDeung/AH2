import React, { useState, useRef, useEffect } from 'react';

const CHAT_API_PATH = '/api/v1/chat';
const REQUEST_TIMEOUT_MS = 15000;

const buildHistoryPayload = (messages) =>
    messages
        .slice(-12)
        .map((msg) => ({
            sender: msg.sender === 'ai' ? 'ai' : 'user',
            text: msg.text,
        }));

const parseChatError = async (response) => {
    let errorCode = '';
    let errorMessage = '';

    try {
        const data = await response.json();
        errorCode = data?.error?.code || '';
        errorMessage = data?.error?.message || '';
    } catch {
        // Ignore parsing failures and use fallback message.
    }

    if (errorCode === 'CHAT_DISABLED') {
        return 'AI 모델 키가 아직 설정되지 않았습니다. 관리자에게 OPENAI_API_KEY 설정을 요청해주세요.';
    }
    if (errorCode === 'INVALID_API_KEY') {
        return '백엔드 인증 설정이 맞지 않습니다. 서버 설정을 확인해주세요.';
    }
    if (errorCode === 'RATE_LIMIT_EXCEEDED') {
        return '요청이 많아 잠시 제한되었습니다. 잠시 후 다시 시도해주세요.';
    }
    if (errorMessage) {
        return errorMessage;
    }

    return '현재 상담 서버 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.';
};

const requestChatReply = async ({ message, history }) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(CHAT_API_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const messageText = await parseChatError(response);
            throw new Error(messageText);
        }

        const data = await response.json();
        if (!data?.message) {
            throw new Error('서버 응답이 비어 있습니다.');
        }

        return data.message;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('응답 시간이 길어져 요청이 중단되었습니다. 다시 시도해주세요.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

const AIChatbot = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: '안녕하세요! 난임 케어 AI 상담소입니다. 무엇이든 편하게 말씀해주세요. 제가 곁에서 들어드릴게요.' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        const userText = inputText.trim();
        if (!userText || isTyping) return;

        const newUserMessage = { id: Date.now(), sender: 'user', text: userText };
        const history = buildHistoryPayload(messages);
        setMessages((prev) => [...prev, newUserMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            const aiReply = await requestChatReply({
                message: userText,
                history,
            });
            const newAiMessage = { id: Date.now() + 1, sender: 'ai', text: aiReply };
            setMessages((prev) => [...prev, newAiMessage]);
        } catch (error) {
            const newAiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: error.message || '상담 응답 중 오류가 발생했습니다.',
            };
            setMessages((prev) => [...prev, newAiMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden animate-fade-in">
            <div className="p-4 bg-sage-50 border-b border-sage-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-sage-800 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center mr-2 text-sage-700">🤖</span>
                    AI 상담소
                </h2>
                <span className="text-xs text-warm-500 bg-white px-2 py-1 rounded-full border border-warm-200">
                    Beta Version
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-50/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-sage-600 text-white rounded-tr-none'
                                    : 'bg-white text-warm-800 border border-warm-100 rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-warm-100 rounded-2xl rounded-tl-none px-4 py-3 flex space-x-1 items-center">
                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-warm-100">
                <div className="relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="고민을 이야기해주세요..."
                        className="w-full rounded-full border-warm-200 bg-warm-50 pl-5 pr-12 py-3 focus:border-sage-500 focus:ring focus:ring-sage-200 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-sage-500 text-white rounded-full flex items-center justify-center hover:bg-sage-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <p className="text-center text-xs text-warm-400 mt-2">
                    ⚠️ AI의 답변은 위로와 정보 제공 목적이며, 의학적 진단은 반드시 전문의와 상담하세요.
                </p>
            </div>
        </div>
    );
};

export default AIChatbot;
