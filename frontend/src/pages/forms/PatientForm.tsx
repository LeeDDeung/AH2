import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { predictionFormSchema, PredictionFormData } from '../../lib/schemas';
import { api } from '../../api/client';
import { Button } from '../../components/ui';
import { FormSection, SelectField, BooleanField, NumberField } from './DynamicForm';
import { Loader2 } from 'lucide-react';

const PatientForm: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const methods = useForm<PredictionFormData>({
        resolver: zodResolver(predictionFormSchema),
        defaultValues: {
            basic: { ageGroup: 'UNKNOWN', yearsInfertility: 0 },
            procedure: {
                procedureType: 'IVF',
                isOvulationStimulated: false,
                isSingleEmbryoTransfer: false,
                usePGT_A: false,
                usePGT_M: false
            },
            causes: {
                maleFactorMain: false, maleFactorSub: false, femaleFactorMain: false, femaleFactorSub: false, coupleFactorMain: false, coupleFactorSub: false, unknownFactor: false,
                tubalDisease: false, maleFactor: false, ovulatoryDisorder: false, femaleFactor: false, cervicalIssues: false, endometriosis: false, spermConcentration: false, spermImmunological: false, spermMotility: false, spermMorphology: false
            },
            history: {
                totalProcedures: '0', totalClinicProcedures: '0', ivfProcedures: '0', diProcedures: '0',
                totalPregnancies: '0', ivfPregnancies: '0', diPregnancies: '0',
                totalBirths: '0', ivfBirths: '0', diBirths: '0'
            },
            embryo: {
                embryoCreationReason: 'CURRENT_PROCEDURE',
                eggSource: 'PATIENT', spermSource: 'PARTNER',
                useFrozenEmbryo: false, useFreshEmbryo: false, useDonorEmbryo: false, isSurrogacy: false, usePGD: false, usePGS: false
            },
            timeline: {}
        }
    });

    const onSubmit = async (data: PredictionFormData) => {
        setIsSubmitting(true);
        try {
            const result = await api.predict(data);
            // Store result in state/context or pass via navigation state
            navigate('/patient/result', { state: { result, formData: data } });
        } catch (error) {
            console.error(error);
            alert('예측 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-bold text-brand-900">나의 여정 기록하기</h1>
                <p className="text-brand-600 mt-2">
                    현재 상황을 편하게 입력해주세요.<br />
                    <span className="text-sm text-brand-400">
                        * 입력하지 않은 항목은 일반적인 데이터를 기반으로 유추하여 분석합니다.<br />
                        * 상세하게 입력하실수록 나에게 꼭 맞는 결과를 확인하실 수 있습니다.
                    </span>
                </p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                    <FormSection title="기본 정보 (Basic Info)">
                        <SelectField
                            name="basic.ageGroup"
                            label="연령대 (만 나이)"
                            options={[
                                { label: '선택 안 함 (자동 유추)', value: 'UNKNOWN' },
                                { label: '18-34세', value: 'AGE_18_34' },
                                { label: '35-37세', value: 'AGE_35_37' },
                                { label: '38-39세', value: 'AGE_38_39' },
                                { label: '40-42세', value: 'AGE_40_42' },
                                { label: '43-44세', value: 'AGE_43_44' },
                                { label: '45-50세', value: 'AGE_45_50' },
                            ]}
                        />
                        <NumberField name="basic.yearsInfertility" label="난임 기간 (년)" />
                    </FormSection>

                    {/* ... other sections ... */}
                    <FormSection title="시술 정보 (Procedure)">
                        <SelectField
                            name="procedure.procedureType"
                            label="시술 유형"
                            options={[
                                { label: '체외수정 (IVF)', value: 'IVF' },
                                { label: '인공수정 (DI)', value: 'DI' },
                            ]}
                        />
                        <BooleanField name="procedure.isOvulationStimulated" label="배란 유도제 사용 여부" />
                        <BooleanField name="procedure.isSingleEmbryoTransfer" label="단일 배아 이식 여부" />
                    </FormSection>

                    <FormSection title="원인 및 이력 (History)">
                        <BooleanField name="causes.unknownFactor" label="원인 불명" />
                        <BooleanField name="causes.femaleFactor" label="여성 요인 (난관, 배란 등)" />
                        <BooleanField name="causes.maleFactor" label="남성 요인 (정자 등)" />

                        <SelectField
                            name="history.totalProcedures"
                            label="이전 총 시술 횟수"
                            options={['0', '1', '2', '3', '4', '5', '6+'].map(v => ({ label: v + '회', value: v }))}
                        />
                    </FormSection>


                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-brand-100 lg:static lg:bg-transparent lg:border-none lg:p-0">
                        <div className="max-w-3xl mx-auto">
                            <Button type="submit" size="lg" className="w-full text-lg shadow-lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        분석 중...
                                    </>
                                ) : (
                                    '나의 가능성 확인하기'
                                )}
                            </Button>
                        </div>
                    </div>

                </form>
            </FormProvider>
        </div>
    );
};

export default PatientForm;
