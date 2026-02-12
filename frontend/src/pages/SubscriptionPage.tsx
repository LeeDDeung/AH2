import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { Check, Star, Zap } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-serif font-bold text-brand-900">플랜 선택</h1>
                <p className="text-brand-600 max-w-2xl mx-auto">
                    임신 성공 여정을 위한 맞춤형 플랜을 선택하세요.<br />
                    모든 플랜은 7일 무료 체험이 가능합니다.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <Card className="border-brand-200">
                    <CardHeader>
                        <CardTitle className="text-xl">Free</CardTitle>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-brand-900">0원</span>
                            <span className="text-brand-500"> / 월</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> 기본 성공 확률 예측
                            </li>
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> 일 3회 AI 상담
                            </li>
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> 기본 커뮤니티 접근
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full">현재 사용 중</Button>
                    </CardContent>
                </Card>

                {/* Plus Plan */}
                <Card className="border-brand-500 shadow-lg relative bg-brand-50/30">
                    <div className="absolute top-0 right-0 -mt-3 -mr-3">
                        <Badge className="bg-brand-600 text-white">Best Choice</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            Plus <Star className="w-4 h-4 ml-2 fill-yellow-400 text-yellow-400" />
                        </CardTitle>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-brand-900">9,900원</span>
                            <span className="text-brand-500"> / 월</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-brand-900 font-medium">
                                <Check className="w-4 h-4 mr-2 text-brand-600" /> 상세 분석 리포트
                            </li>
                            <li className="flex items-center text-sm text-brand-900 font-medium">
                                <Check className="w-4 h-4 mr-2 text-brand-600" /> 무제한 AI 상담
                            </li>
                            <li className="flex items-center text-sm text-brand-900 font-medium">
                                <Check className="w-4 h-4 mr-2 text-brand-600" /> 전문가 연계 10% 할인
                            </li>
                            <li className="flex items-center text-sm text-brand-900 font-medium">
                                <Check className="w-4 h-4 mr-2 text-brand-600" /> 배우자 계정 연동
                            </li>
                        </ul>
                        <Button className="w-full">7일 무료 체험 시작</Button>
                    </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card className="border-brand-200">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            Pro <Zap className="w-4 h-4 ml-2 fill-brand-400 text-brand-400" />
                        </CardTitle>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-brand-900">29,900원</span>
                            <span className="text-brand-500"> / 월</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> Plus 플랜 모든 혜택
                            </li>
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> 우선 상담 배정
                            </li>
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> 1:1 전담 코치 배정
                            </li>
                            <li className="flex items-center text-sm text-brand-700">
                                <Check className="w-4 h-4 mr-2 text-green-500" /> 설계사 자료 템플릿
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full">문의하기</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionPage;
