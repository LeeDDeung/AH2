import React, { useEffect, useState } from 'react';

const PredictionResult = ({ result, onRetry }) => {
    const [displayedScore, setDisplayedScore] = useState(0);
    const percentage = result.probability;

    useEffect(() => {
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // East out cubic function
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setDisplayedScore(Math.floor(percentage * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [percentage]);

    // Color determination based on score
    const getColor = (score) => {
        if (score >= 60) return '#10B981'; // Green
        if (score >= 30) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    const strokeColor = getColor(percentage);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (displayedScore / 100) * circumference;

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-white mb-8">예측 결과</h2>

            {/* Semi-Circle Gauge or Circle implementation */}
            <div className="relative w-64 h-64 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-slate-700"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-100 ease-out"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-5xl font-bold text-white transition-all duration-300">
                        {displayedScore}%
                    </span>
                    <span className="text-sm text-gray-300 mt-1">성공 확률</span>
                </div>
            </div>

            <div className="max-w-md mx-auto">
                <p className="text-xl font-medium text-white mb-2">
                    {result.message}
                </p>
                <p className="text-gray-300 text-sm mb-8">
                    * 이 결과는 AI 모델에 의한 예측값이며, 실제 의료 진단과는 다를 수 있습니다. 정확한 진단은 전문의와 상담하십시오.
                </p>
            </div>

            <button
                onClick={onRetry}
                className="py-3 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all backdrop-blur-sm border border-white/30"
            >
                다시 검사하기
            </button>
        </div>
    );
};

export default PredictionResult;
