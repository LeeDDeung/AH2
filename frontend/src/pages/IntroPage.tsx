import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

const SUPPORT_MESSAGES = [
    "당신의 소중한 여정에 함께합니다.",
    "작은 희망이 모여 기적을 만듭니다.",
    "혼자가 아닙니다, 우리가 곁에 있습니다."
];

const IntroPage: React.FC = () => {
    const navigate = useNavigate();
    const [messageIndex, setMessageIndex] = useState(0);
    const [showCTA, setShowCTA] = useState(false);

    useEffect(() => {
        // Message rotation logic
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % SUPPORT_MESSAGES.length);
        }, 2500); // Rotate every 2.5 seconds

        // Show CTA after some time
        const timer = setTimeout(() => {
            setShowCTA(true);
        }, 6000); // Show CTA after 6 seconds

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    const handleStart = () => {
        navigate('/role-selection');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EB] p-4 text-center">
            <div className="mb-12 max-w-lg">
                <h1
                    key={messageIndex}
                    className="text-3xl font-serif font-bold text-[#554236] animate-fade-in transition-all duration-500 min-h-[4rem]"
                >
                    {SUPPORT_MESSAGES[messageIndex]}
                </h1>
            </div>

            <div className={`transition-opacity duration-1000 ${showCTA ? 'opacity-100' : 'opacity-0'}`}>
                <Button
                    size="lg"
                    onClick={handleStart}
                    className="px-12 py-6 text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-[#554236] text-[#FAF9F6] hover:bg-[#4A392F]"
                >
                    시작하기
                </Button>
            </div>

            {!showCTA && (
                <button
                    onClick={handleStart}
                    className="mt-8 text-[#7D6049] text-sm hover:text-[#554236] underline underline-offset-4"
                >
                    건너뛰기
                </button>
            )}
        </div>
    );
};

export default IntroPage;
