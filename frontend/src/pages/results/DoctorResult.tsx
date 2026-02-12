import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PredictionResponse, DistributionResponse } from '../../types/prediction';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const DoctorResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as PredictionResponse;
    const distribution = location.state?.distribution as DistributionResponse;

    if (!result || !distribution) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <p className="mb-4">결과 데이터를 찾을 수 없습니다.</p>
                <Button onClick={() => navigate('/doctor')}>입력 화면으로 돌아가기</Button>
            </div>
        );
    }

    // Transform distribution data for Recharts
    // Assuming distribution.distribution is an array of probabilities, we need to bin them or if it is already binned (density), verify.
    // For this mock/demo, let's assume it's an array of values to histogram-ize, or pre-calculated density.
    // Let's create a histogram view from the array.
    const distData = distribution.distribution.map((val, idx) => ({
        bin: idx,
        probability: val,
    }));


    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-serif font-bold text-brand-900">임상 예측 리포트 (Clinical Prediction Report)</h1>
                <Button variant="outline" onClick={() => window.print()}>리포트 인쇄</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Main Prediction */}
                <Card>
                    <CardHeader>
                        <CardTitle>성공 예측 확률 (Success Probability)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-center py-6">
                            <span className="text-5xl font-bold text-brand-800">
                                {Math.round(result.probability * 1000) / 10}%
                            </span>
                            <span className="text-brand-500 mb-2 ml-2">추정됨 (estimated)</span>
                        </div>
                        <div className="flex justify-center space-x-8 text-sm text-brand-600">
                            <div>
                                <span className="block font-semibold">95% 신뢰구간 (CI)</span>
                                [{result.ci_low}, {result.ci_high}]
                            </div>
                            <div>
                                <span className="block font-semibold">코호트 평균 (Mean)</span>
                                {result.cohort_mean ? Math.round(result.cohort_mean * 100) + '%' : '-'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Factors */}
                <Card>
                    <CardHeader>
                        <CardTitle>주요 영향 요인 (Top Factors)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {result.top_factors?.map((factor, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-brand-50 rounded">
                                    <span className="font-medium text-brand-900">{factor.name}</span>
                                    <div className="flex items-center">
                                        <span className={`text-sm mr-2 ${factor.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {factor.direction === 'up' ? '증가 (Increase)' : '감소 (Decrease)'}
                                        </span>
                                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-brand-200">
                                            {factor.strength}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!result.top_factors && <p className="text-brand-400 text-sm">분석된 영향 요인이 없습니다.</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>코호트 성공 확률 분포 (Cohort Distribution)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis hide />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="probability" fill="#b09170" name="확률 밀도" />
                            <ReferenceLine x={Math.floor(result.probability * 50)} stroke="red" label="환자(Patient)" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-xs text-brand-400 mt-2">
                        유사 환자 군의 성공 확률 분포입니다. 빨간 선은 현재 환자의 위치를 나타냅니다.
                    </p>
                </CardContent>
            </Card>

            {/* Clinical Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>임상 요약 (Clinical Summary)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-brand-800 leading-relaxed">
                        입력 변수 기반 분석 결과, 해당 환자의 임신 성공 확률은 {(result.probability * 100).toFixed(1)}%로 예측됩니다.
                        이는 동일 코호트 평균 대비
                        {' '}{result.cohort_mean && result.probability > result.cohort_mean ? '높은(higher)' : '낮은(lower)'} 수준입니다.
                        식별된 위험 요인과 긍정적 요인을 고려하여 최적의 시술 계획을 수립하시기 바랍니다.
                    </p>
                </CardContent>
            </Card>

            <div className="flex justify-center pt-8 pb-8 print:hidden">
                <Button variant="ghost" className="text-brand-400 hover:text-brand-600 hover:bg-brand-50" onClick={() => navigate('/goodbye')}>
                    세션 종료하기
                </Button>
            </div>
        </div>
    );
};

export default DoctorResult;
