import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { predictionFormSchema, PredictionFormData } from '../../lib/schemas';
import { api } from '../../api/client';
import { Button } from '../../components/ui';
import { FormSection, SelectField, BooleanField, NumberField } from './DynamicForm';
import { Loader2 } from 'lucide-react';

const DoctorForm: React.FC = () => {
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
            const distribution = await api.getDistribution(data);
            navigate('/doctor/result', { state: { result, distribution, formData: data } });
        } catch (error) {
            console.error(error);
            alert('Error fetching prediction.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-brand-900">환자 데이터 입력 (Clinical)</h1>
                    <p className="text-brand-600 mt-1">정밀 분석을 위한 전체 임상 데이터를 입력해주세요.</p>
                </div>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Group 1: Basic */}
                    <FormSection title="1. 인구통계 및 프로필">
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

                    {/* Group 2: Procedure */}
                    <FormSection title="2. 시술 정보">
                        <SelectField
                            name="procedure.procedureType"
                            label="시술 유형"
                            options={[
                                { label: 'IVF (체외수정)', value: 'IVF' },
                                { label: 'DI (인공수정)', value: 'DI' },
                            ]}
                        />
                        <BooleanField name="procedure.isOvulationStimulated" label="배란 유도 여부" />
                        <BooleanField name="procedure.isSingleEmbryoTransfer" label="단일 배아 이식" />
                        <BooleanField name="procedure.usePGT_A" label="PGT-A 사용" />
                        <BooleanField name="procedure.usePGT_M" label="PGT-M 사용" />
                    </FormSection>

                    {/* Group 3: Causes */}
                    <FormSection title="3. 난임 원인">
                        <BooleanField name="causes.tubalDisease" label="난관 요인" />
                        <BooleanField name="causes.ovulatoryDisorder" label="배란 장애" />
                        <BooleanField name="causes.maleFactor" label="남성 요인" />
                        <BooleanField name="causes.endometriosis" label="자궁내막증" />
                        <BooleanField name="causes.unknownFactor" label="원인 불명" />
                    </FormSection>

                    {/* Group 4: History */}
                    <FormSection title="4. 산과력">
                        <SelectField
                            name="history.totalProcedures"
                            label="총 이전 시술 횟수"
                            options={['0', '1', '2', '3', '4', '5', '6+'].map(v => ({ label: v, value: v }))}
                        />
                        <SelectField
                            name="history.totalBirths"
                            label="총 출산 횟수"
                            options={['0', '1', '2', '3', '4', '5', '6+'].map(v => ({ label: v, value: v }))}
                        />
                    </FormSection>

                    {/* Group 5: Embryology */}
                    <FormSection title="5. 배아 정보">
                        <NumberField name="embryo.totalEmbryosCreated" label="생성된 배아 수" />
                        <NumberField name="embryo.embryosTransferred" label="이식된 배아 수" />
                        <SelectField
                            name="embryo.eggSource"
                            label="난자 출처"
                            options={[
                                { label: '자가 (Patient)', value: 'PATIENT' },
                                { label: '공여 (Donor)', value: 'DONOR' },
                                { label: '미상 (Unknown)', value: 'UNKNOWN' },
                            ]}
                        />
                    </FormSection>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : '임상 데이터 분석 실행'}
                    </Button>

                </form>
            </FormProvider>
        </div>
    );
};

export default DoctorForm;
