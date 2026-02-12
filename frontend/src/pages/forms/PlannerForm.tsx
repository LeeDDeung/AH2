import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { predictionFormSchema, PredictionFormData } from '../../lib/schemas';
import { api } from '../../api/client';
import { Button } from '../../components/ui';
import { FormSection, SelectField, NumberField, BooleanField } from './DynamicForm';
import { Loader2 } from 'lucide-react';

const PlannerForm: React.FC = () => {
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
            // Planner needs both prediction (for internal check) and risk assessment
            const result = await api.predict(data);
            const riskAssessment = await api.getPlannerRisk(data);
            navigate('/planner/result', { state: { result, riskAssessment, formData: data } });
        } catch (error) {
            console.error(error);
            alert('Risk assessment failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-bold text-brand-900">고객 리스크 평가 (Planner)</h1>
                <p className="text-brand-600 mt-2">입력된 정보를 바탕으로 보장 내역과 리스크 등급을 산출합니다.</p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">

                    <FormSection title="기본 고객 정보">
                        <SelectField
                            name="basic.ageGroup"
                            label="연령대"
                            options={[
                                { label: '미상', value: 'UNKNOWN' },
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

                    <FormSection title="주요 리스크 요인">
                        <BooleanField name="causes.unknownFactor" label="원인 불명 여부" />
                        <BooleanField name="causes.maleFactor" label="남성 요인" />
                        <BooleanField name="causes.femaleFactor" label="여성 요인" />

                        <SelectField
                            name="history.totalProcedures"
                            label="총 시술 이력"
                            options={['0', '1', '2', '3', '4', '5', '6+'].map(v => ({ label: v + '회', value: v }))}
                        />
                    </FormSection>

                    <Button type="submit" size="lg" className="w-full bg-slate-800 hover:bg-slate-900 text-white" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : '리스크 분석 및 플랜 추천'}
                    </Button>

                </form>
            </FormProvider>
        </div>
    );
};

export default PlannerForm;
