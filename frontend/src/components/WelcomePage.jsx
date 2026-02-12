import React from 'react';

const WelcomePage = ({ onStart }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-warm-50 p-6 text-center animate-fade-in">
            <div className="max-w-2xl w-full space-y-12">
                {/* Logo or Icon Area */}
                <div className="mx-auto w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>

                {/* Main Message */}
                <div className="space-y-6 animate-slide-up">
                    <h1 className="text-3xl md:text-4xl font-bold text-warm-900 tracking-tight leading-tight">
                        난임, 혼자가 아닙니다. <br />
                        <span className="text-sage-600">함께 기록하고 기억하겠습니다.</span>
                    </h1>
                    <p className="text-lg text-warm-600 leading-relaxed max-w-lg mx-auto">
                        매일의 작은 기록이 모여 희망이 됩니다.<br />
                        치료 과정과 생활 습관을 따뜻하게 관리해 드릴게요.
                    </p>
                </div>

                {/* Start Button */}
                <div className="pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={onStart}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-sage-600 rounded-full hover:bg-sage-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                    >
                        <span>시작하기</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Footer / Decorative Text */}
            <div className="absolute bottom-8 text-warm-400 text-sm">
                당신의 여정을 응원합니다.
            </div>
        </div>
    );
};

export default WelcomePage;
