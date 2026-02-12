import React, { useState } from 'react';

const LifestyleManager = () => {
    const [inputs, setInputs] = useState({
        sleep: 7,
        stress: 3, // 1-5 scale
        nutrition: 'balanced',
        exam: false,
    });

    const [showGuide, setShowGuide] = useState(false);

    const handleAnalyze = () => {
        setShowGuide(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6">
                <h2 className="text-xl font-bold text-warm-900 mb-4 flex items-center">
                    <span className="bg-sage-100 text-sage-600 p-2 rounded-lg mr-3">
                        🌿
                    </span>
                    오늘의 생활습관 기록
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sleep Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-warm-700">어제 수면 시간 (시간)</label>
                        <input
                            type="range"
                            min="4" max="10" step="0.5"
                            value={inputs.sleep}
                            onChange={(e) => setInputs({ ...inputs, sleep: parseFloat(e.target.value) })}
                            className="w-full accent-sage-500 h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-right text-sage-600 font-medium">{inputs.sleep} 시간</div>
                    </div>

                    {/* Stress Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-warm-700">오늘의 스트레스 지수</label>
                        <div className="flex justify-between text-xs text-warm-400 mb-1">
                            <span>편안함</span>
                            <span>보통</span>
                            <span>힘듦</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="5" step="1"
                            value={inputs.stress}
                            onChange={(e) => setInputs({ ...inputs, stress: parseInt(e.target.value) })}
                            className="w-full accent-sage-500 h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-right text-sage-600 font-medium">{inputs.stress} / 5</div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition-colors shadow-sm"
                    >
                        분석 및 가이드 보기
                    </button>
                </div>
            </div>

            {showGuide && (
                <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 animate-slide-up">
                    <h3 className="text-lg font-bold text-warm-800 mb-4">맞춤형 관리 가이드</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Guide Cards */}
                        <div className="bg-sage-50 p-4 rounded-xl border border-sage-100">
                            <div className="text-sage-700 font-semibold mb-2">수면 리듬</div>
                            <p className="text-sm text-sage-600 leading-relaxed">
                                7시간의 충분한 수면은 호르몬 균형에 큰 도움이 됩니다. 오늘 밤도 편안하게 주무세요. 🌙
                            </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <div className="text-orange-700 font-semibold mb-2">스트레스 관리</div>
                            <p className="text-sm text-orange-600 leading-relaxed">
                                스트레스 지수가 보통 수준입니다. 가벼운 산책이나 명상으로 하루를 마무리해보는 건 어떨까요? 🧘‍♀️
                            </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="text-blue-700 font-semibold mb-2">영양 팁</div>
                            <p className="text-sm text-blue-600 leading-relaxed">
                                엽산이 풍부한 녹색 채소를 곁들인 식단을 추천드려요. 🥗
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LifestyleManager;
