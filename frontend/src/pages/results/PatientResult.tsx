import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PredictionResponse } from '../../types/prediction';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui';
import { ArrowRight, Heart, Users, Calendar } from 'lucide-react';

const getProbabilityLabel = (prob: number) => {
    if (prob < 0.2) return "집중 관리가 필요한 단계";
    if (prob < 0.4) return "희망을 키워가는 단계";
    if (prob < 0.6) return "긍정적인 변화가 기대되는 단계";
    if (prob < 0.8) return "높은 성공이 기대되는 단계";
    return "매우 안정적인 단계";
};

const PatientResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as PredictionResponse;

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <p className="mb-4 text-brand-600">결과 정보를 찾을 수 없습니다.</p>
                <Button onClick={() => navigate('/patient')}>다시 입력하기</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif font-bold text-brand-900">당신을 위한 희망 리포트</h1>
                <p className="text-brand-600">함께 걸어갈 여정의 길잡이가 되어드릴게요.</p>
            </div>

            {/* Hero Card with Hopeful Framing */}
            <Card className="bg-gradient-to-br from-white to-brand-50 border-brand-200 shadow-md overflow-hidden">
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
                        <Heart className="h-8 w-8 text-red-400 fill-current" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-800 mb-2">긍정적인 가능성을 확인했어요</h2>
                    <p className="text-brand-600 mb-6 max-w-lg mx-auto leading-relaxed">
                        현재 데이터를 바탕으로 분석했을 때,<br />
                        <span className="text-2xl font-bold text-brand-700">
                            {getProbabilityLabel(result.probability)}
                        </span>로 예측됩니다.
                        <br /><br />
                        <span className="text-sm">
                            수치는 단순한 통계일 뿐입니다.<br />
                            긍정적인 마음과 꾸준한 관리가 더 큰 기적을 만들 수 있습니다.
                        </span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-brand-100">
                        <div className="text-center p-4">
                            <p className="text-sm text-brand-500 mb-1">비슷한 사례의 평균</p>
                            <p className="text-lg font-semibold text-brand-800">
                                {result.cohort_mean ? getProbabilityLabel(result.cohort_mean) : '-'}
                            </p>
                        </div>
                        <div className="text-center p-4 border-l border-r border-brand-100">
                            <p className="text-sm text-brand-500 mb-1">나의 위치 (상위)</p>
                            <p className="text-lg font-semibold text-brand-800">
                                {result.cohort_percentile ? `${100 - result.cohort_percentile}%` : '-'}
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <p className="text-sm text-brand-500 mb-1">긍정적 요인</p>
                            <p className="text-lg font-semibold text-brand-800">
                                {result.top_factors?.filter(f => f.direction === 'up').length || 0}개
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-brand-100/50 p-4 text-center">
                    <p className="text-xs text-brand-500">
                        * 이 결과는 통계적 추정치이며 의학적 진단이 아닙니다. 정확한 진단은 전문의와 상담하세요.
                    </p>
                </div>
            </Card>

            {/* Actionable Support Content */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-accent-600" />
                            전문가 상담
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-brand-600 mb-4 text-sm">
                            나와 비슷한 케이스를 경험한 난임 전문의와 상담해보세요.
                        </p>
                        <Button variant="outline" className="w-full text-brand-700" onClick={() => navigate('/patient/chat')}>
                            AI 상담 시작하기
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-brand-600" />
                            건강 관리 플랜
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-brand-600 mb-4 text-sm">
                            임신 성공률을 높이기 위한 생활 습관과 영양 관리 가이드를 확인하세요.
                        </p>
                        <Button variant="outline" className="w-full text-brand-700">
                            가이드 보기
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center pt-8 pb-8">
                <Button variant="ghost" className="text-brand-400 hover:text-brand-600 hover:bg-brand-50" onClick={() => navigate('/goodbye')}>
                    세션 종료하기
                </Button>
            </div>
        </div>
    );
};

export default PatientResult;
