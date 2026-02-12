import React, { useState } from 'react';

const InputForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        age: '',
        procedureType: '',
        infertilityReason: [],
        historyAttempts: '',
        embryoCount: '',
        stimulationUsed: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'stimulationUsed') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleReasonChange = (reason) => {
        setFormData(prev => {
            const reasons = prev.infertilityReason.includes(reason)
                ? prev.infertilityReason.filter(r => r !== reason)
                : [...prev.infertilityReason, reason];
            return { ...prev, infertilityReason: reasons };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">환자 정보 입력</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Age Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">나이 (만)</label>
                    <select
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="" disabled>선택해주세요</option>
                        <option value="25">18-29세</option>
                        <option value="32">30-34세</option>
                        <option value="37">35-39세</option>
                        <option value="42">40-44세</option>
                        <option value="47">45세 이상</option>
                    </select>
                </div>

                {/* Procedure Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">시술 유형</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['IVF', 'IUI', 'ICSI', 'Unknown'].map((type) => (
                            <button
                                type="button"
                                key={type}
                                onClick={() => setFormData(prev => ({ ...prev, procedureType: type }))}
                                className={`py-3 px-4 rounded-lg font-medium transition-all ${formData.procedureType === type
                                        ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                                        : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clinical History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">이전 시도 횟수</label>
                        <input
                            type="number"
                            name="historyAttempts"
                            value={formData.historyAttempts}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">총 생성 배아 수</label>
                        <input
                            type="number"
                            name="embryoCount"
                            value={formData.embryoCount}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {/* Infertility Reasons (Checkboxes) */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">불임 원인 (중복 선택 가능)</label>
                    <div className="space-y-2">
                        {[
                            { id: 'maleFactor', label: '남성 요인' },
                            { id: 'tubalDisease', label: '난관 질환' },
                            { id: 'ovulatoryDisorder', label: '배란 장애' },
                            { id: 'endometriosis', label: '자궁내막증' },
                            { id: 'unexplained', label: '원인 불명' }
                        ].map((reason) => (
                            <label key={reason.id} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.infertilityReason.includes(reason.id)}
                                    onChange={() => handleReasonChange(reason.id)}
                                    className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-slate-800/50"
                                />
                                <span className="text-gray-300 group-hover:text-white transition-colors">{reason.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Additional Options */}
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        name="stimulationUsed"
                        checked={formData.stimulationUsed}
                        onChange={handleChange}
                        id="stimulation"
                        className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-slate-800/50"
                    />
                    <label htmlFor="stimulation" className="text-gray-300 cursor-pointer">배란 자극 여부</label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl text-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${isLoading
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-500/50'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            분석 중...
                        </span>
                    ) : (
                        '임신 확률 예측하기'
                    )}
                </button>
            </form>
        </div>
    );
};

export default InputForm;
