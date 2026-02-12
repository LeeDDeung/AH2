import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PredictionResponse, PlannerResponse } from '../../types/prediction';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui';
import { Shield, Copy, Check, AlertTriangle } from 'lucide-react';

const getProbabilityLabel = (prob: number) => {
    if (prob < 0.2) return "집중 관리가 필요한 단계";
    if (prob < 0.4) return "희망을 키워가는 단계";
    if (prob < 0.6) return "긍정적인 변화가 기대되는 단계";
    if (prob < 0.8) return "높은 성공이 기대되는 단계";
    return "매우 안정적인 단계";
};

const PlannerResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as PredictionResponse;
    const riskAssessment = location.state?.riskAssessment as PlannerResponse;
    const [copied, setCopied] = useState(false);

    if (!riskAssessment) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <p className="mb-4">결과 정보를 찾을 수 없습니다.</p>
                <Button onClick={() => navigate('/planner')}>다시 입력하기</Button>
            </div>
        );
    }

    const handleCopy = () => {
        const text = `[HopeOne 리스크 분석 요약]\n\n등급: ${riskAssessment.risk_band}\n임신 성공 가능성: ${getProbabilityLabel(result.probability)}\n\n추천 플랜:\n${riskAssessment.recommended_plans.map(p => `- ${p.name}: ${p.why}`).join('\n')}\n\n* 본 결과는 참고용입니다.`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRiskColor = (band: string) => {
        switch (band) {
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-serif font-bold text-brand-900">리스크 분석 및 플랜(Plan)</h1>
            </div>

            {/* Risk Band Header */}
            <Card className="border-l-4 border-l-brand-500">
                <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-brand-600 mb-1">고객 리스크 등급</h2>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getRiskColor(riskAssessment.risk_band)}`}>
                            <Shield className="w-5 h-5 mr-2" />
                            <span className="text-xl font-bold">{riskAssessment.risk_band} RISK</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-brand-500">예측 성공 가능성</p>
                        <p className="text-2xl font-bold text-brand-900">{getProbabilityLabel(result.probability)}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Recommended Coverage */}
            <h3 className="text-lg font-bold text-brand-800 mt-8">추천 보장 플랜</h3>
            <div className="grid md:grid-cols-2 gap-4">
                {riskAssessment.recommended_plans.map((plan, idx) => (
                    <Card key={idx} className="hover:border-brand-400 transition-colors">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-2xl font-bold text-brand-800">
                                    {plan.monthly_range[0].toLocaleString()}원 ~
                                </span>
                            </div>
                            <p className="text-brand-600 text-sm mb-2">{plan.why}</p>

                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Exclusions & Notes */}
            <Card className="bg-brand-50/50">
                <CardHeader>
                    <CardTitle className="text-base flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        면책 및 주의사항
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-sm text-brand-700 space-y-1">
                        {riskAssessment.exclusions.map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Copy for Customer */}
            <div className="flex justify-center mt-8">
                <Button onClick={handleCopy} size="lg" className="w-full md:w-auto" variant="secondary">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    고객 설명용 요약 복사하기
                </Button>
            </div>

            <div className="flex justify-center pt-8 pb-8">
                <Button variant="ghost" className="text-brand-400 hover:text-brand-600 hover:bg-brand-50" onClick={() => navigate('/goodbye')}>
                    세션 종료하기
                </Button>
            </div>
        </div>
    );
};

export default PlannerResult;
