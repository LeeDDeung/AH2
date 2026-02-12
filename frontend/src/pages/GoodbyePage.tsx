import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

const GOODBYE_MESSAGES = [
    "오늘도 당신의 용기를 응원합니다.",
    "당신의 몸과 마음이 안전하길 바랍니다.",
    "당신에게 가장 좋은 결과가 찾아오길 기원합니다.",
    "혼자가 아닙니다. 필요한 도움을 함께 찾겠습니다."
];

const GoodbyePage: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Get last index from localStorage
        const storedIndex = localStorage.getItem('lastGoodbyeIndex');
        let nextIndex = 0;

        if (storedIndex !== null) {
            nextIndex = (parseInt(storedIndex) + 1) % GOODBYE_MESSAGES.length;
        }

        setMessage(GOODBYE_MESSAGES[nextIndex]);
        localStorage.setItem('lastGoodbyeIndex', nextIndex.toString());
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50 p-4 text-center">
            <div className="mb-12 max-w-lg">
                <h1 className="text-2xl font-serif font-bold text-brand-800 animate-slide-up">
                    {message}
                </h1>
            </div>

            <div className="space-x-4">
                <Button onClick={() => navigate('/')} variant="outline">
                    처음으로 돌아가기
                </Button>
            </div>
        </div>
    );
};

export default GoodbyePage;
