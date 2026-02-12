import React, { useState } from 'react';

const TreatmentJourney = () => {
    const [records, setRecords] = useState([
        {
            id: 1,
            date: '2026-01-15',
            hospital: '희망산부인과',
            stage: '검사 단계',
            note: '기초 호르몬 검사 및 초음파 진행. 결과 양호함.',
            type: 'checkup'
        },
        {
            id: 2,
            date: '2026-02-01',
            hospital: '희망산부인과',
            stage: '배란 유도',
            note: '클로미펜 처방 시작. 5일간 복용 예정.',
            type: 'medication'
        }
    ]);

    const [newRecord, setNewRecord] = useState({
        date: new Date().toISOString().split('T')[0],
        hospital: '',
        stage: '진료',
        note: ''
    });

    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const record = {
            id: records.length + 1,
            ...newRecord,
            type: 'general'
        };
        setRecords([record, ...records]);
        setShowForm(false);
        setNewRecord({
            date: new Date().toISOString().split('T')[0],
            hospital: '',
            stage: '진료',
            note: ''
        });
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-warm-900 flex items-center">
                    <span className="bg-sage-100 text-sage-600 p-2 rounded-lg mr-3">🗓️</span>
                    나의 치료 여정
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors shadow-sm text-sm font-medium"
                >
                    {showForm ? '기록 취소' : '+ 새 기록 추가'}
                </button>
            </div>

            {/* Record Input Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 animate-slide-up mb-8">
                    <h3 className="text-lg font-bold text-warm-800 mb-4">새 진료 기록</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1">날짜</label>
                            <input
                                type="date"
                                required
                                value={newRecord.date}
                                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                                className="w-full rounded-lg border-warm-200 focus:border-sage-500 focus:ring focus:ring-sage-200 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1">병원</label>
                            <input
                                type="text"
                                placeholder="병원명 입력"
                                value={newRecord.hospital}
                                onChange={(e) => setNewRecord({ ...newRecord, hospital: e.target.value })}
                                className="w-full rounded-lg border-warm-200 focus:border-sage-500 focus:ring focus:ring-sage-200 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1">단계/구분</label>
                            <select
                                value={newRecord.stage}
                                onChange={(e) => setNewRecord({ ...newRecord, stage: e.target.value })}
                                className="w-full rounded-lg border-warm-200 focus:border-sage-500 focus:ring focus:ring-sage-200 transition-colors"
                            >
                                <option>진료</option>
                                <option>검사</option>
                                <option>배란 유도</option>
                                <option>인공수정</option>
                                <option>시험관 아기</option>
                                <option>이식</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-warm-700 mb-1">메모 / 의사 선생님 말씀</label>
                        <textarea
                            rows="3"
                            value={newRecord.note}
                            onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
                            className="w-full rounded-lg border-warm-200 focus:border-sage-500 focus:ring focus:ring-sage-200 transition-colors"
                            placeholder="특이사항이나 기억해야 할 점을 적어주세요."
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 font-medium">저장하기</button>
                    </div>
                </form>
            )}

            {/* Timeline View */}
            <div className="relative border-l-2 border-warm-200 ml-4 md:ml-6 space-y-8 pb-8">
                {records.map((record, index) => (
                    <div key={record.id} className="relative pl-8 md:pl-10">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 border-white ${index === 0 ? 'bg-sage-500' : 'bg-warm-400'
                            }`}></div>

                        {/* Content Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                <div>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${record.stage.includes('검사') ? 'bg-blue-100 text-blue-700' :
                                            record.stage.includes('배란') ? 'bg-purple-100 text-purple-700' :
                                                'bg-sage-100 text-sage-700'
                                        }`}>
                                        {record.stage}
                                    </span>
                                    <h3 className="text-lg font-bold text-warm-800">{record.hospital}</h3>
                                </div>
                                <div className="text-sm text-warm-500 font-medium mt-1 md:mt-0">
                                    {record.date}
                                </div>
                            </div>
                            <p className="text-warm-600 leading-relaxed text-sm">
                                {record.note}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {records.length === 0 && (
                <div className="text-center py-12 text-warm-400">
                    아직 기록된 여정이 없습니다. 첫 기록을 남겨보세요.
                </div>
            )}
        </div>
    );
};

export default TreatmentJourney;
