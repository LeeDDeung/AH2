import React from 'react';

const PremiumCare = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold text-warm-900">전문가 리포트 & 케어</h2>
                <p className="text-warm-600 max-w-2xl mx-auto">
                    난임 전문 의료진의 심층 분석과 심리 상담 전문가의 케어로 당신의 여정을 더 든든하게 지원합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Premium Report Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-warm-100 overflow-hidden relative group hover:border-sage-300 transition-colors">
                    <div className="absolute top-0 right-0 bg-sage-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                        인기
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                            📊
                        </div>
                        <h3 className="text-2xl font-bold text-warm-900">월간 심층 리포트</h3>
                        <p className="text-warm-500 leading-relaxed h-20">
                            나의 생활습관과 시술 기록을 종합 분석하여, 임신 성공률을 높이기 위한 구체적인 전략과 영양 가이드를 매월 제공합니다.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center text-warm-700">
                                <svg className="w-5 h-5 text-sage-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                데이터 기반 맞춤 솔루션
                            </div>
                            <div className="flex items-center text-warm-700">
                                <svg className="w-5 h-5 text-sage-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                난임 전문 영양사 식단 가이드
                            </div>
                            <div className="flex items-center text-warm-700">
                                <svg className="w-5 h-5 text-sage-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                주간 건강 변화 트래킹
                            </div>
                        </div>
                        <div className="pt-6 border-t border-warm-100">
                            <div className="text-3xl font-bold text-sage-700 mb-4">
                                ₩9,900 <span className="text-sm font-normal text-warm-400">/ 월</span>
                            </div>
                            <button className="w-full bg-sage-600 text-white py-3 rounded-xl font-bold hover:bg-sage-700 transition-transform active:scale-95">
                                구독 시작하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expert Counseling Card */}
                <div className="bg-gradient-to-br from-warm-800 to-warm-900 rounded-3xl shadow-lg border border-warm-700 overflow-hidden text-white">
                    <div className="p-8 space-y-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-4 text-white">
                            🩺
                        </div>
                        <h3 className="text-2xl font-bold">1:1 전문가 상담 연결</h3>
                        <p className="text-warm-200 leading-relaxed h-20">
                            혼자 고민하지 마세요. 난임 전문 심리 상담사 및 전문의와 비대면으로 안전하고 편안하게 상담할 수 있습니다.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center text-warm-100">
                                <svg className="w-5 h-5 text-sage-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                검증된 난임 전문 상담사
                            </div>
                            <div className="flex items-center text-warm-100">
                                <svg className="w-5 h-5 text-sage-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                철저한 익명성 보장
                            </div>
                            <div className="flex items-center text-warm-100">
                                <svg className="w-5 h-5 text-sage-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                원하는 시간대 예약 가능
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/20">
                            <div className="text-3xl font-bold text-sage-300 mb-4">
                                ₩45,000~ <span className="text-sm font-normal text-warm-400">/ 회</span>
                            </div>
                            <button className="w-full bg-white text-warm-900 py-3 rounded-xl font-bold hover:bg-warm-100 transition-transform active:scale-95">
                                상담 예약하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100 mt-8 text-center">
                <p className="text-sage-800 font-medium">
                    💡 첫 달 구독 시 전문가 상담 1회 50% 할인 쿠폰을 드립니다.
                </p>
            </div>
        </div>
    );
};

export default PremiumCare;
