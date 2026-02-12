import React from 'react';

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* AI Context Summary Widget */}
            <div className="bg-gradient-to-r from-sage-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI 케어 리포트
                </h2>
                <p className="text-sage-50 text-lg leading-relaxed font-light">
                    "OO님, 최근 3개월간 <span className="font-bold underline decoration-white/30 underline-offset-4">스트레스 지표가 꾸준히 개선</span>되고 있어요.
                    현재 시술 단계에 맞춰 긍정적인 신호를 보이고 있습니다."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-100">
                    <h3 className="text-warm-500 text-sm font-medium mb-1">다음 병원 방문 일정</h3>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-warm-900">D-3</span>
                        <span className="text-warm-600">난포 크기 확인</span>
                    </div>
                    <div className="mt-4 text-sm text-warm-400">
                        2026년 2월 14일 (금) 10:00 예약
                    </div>
                </div>

                {/* Status Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-100">
                    <h3 className="text-warm-500 text-sm font-medium mb-1">오늘의 실천</h3>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center">💊</div>
                            <span className="text-warm-800">영양제 섭취</span>
                        </div>
                        <button className="text-sage-600 text-sm font-medium hover:text-sage-800">완료하기</button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">👟</div>
                            <span className="text-warm-800">가벼운 산책 30분</span>
                        </div>
                        <button className="text-warm-400 text-sm font-medium hover:text-warm-600">미완료</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
