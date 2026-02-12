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
                    <h1 className="text-2xl font-serif font-bold text-brand-900">Patient Input (Clinical)</h1>
                    <p className="text-brand-600 mt-1">Enter full clinical dataset for precise analysis.</p>
                </div>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Group 1: Basic */}
                    <FormSection title="1. Demographics & Profile">
                        <SelectField
                            name="basic.ageGroup"
                            label="Age Group"
                            options={[
                                { label: 'Unknown', value: 'UNKNOWN' },
                                { label: '18-34', value: 'AGE_18_34' },
                                { label: '35-37', value: 'AGE_35_37' },
                                { label: '38-39', value: 'AGE_38_39' },
                                { label: '40-42', value: 'AGE_40_42' },
                                { label: '43-44', value: 'AGE_43_44' },
                                { label: '45-50', value: 'AGE_45_50' },
                            ]}
                        />
                        <NumberField name="basic.yearsInfertility" label="Years Infertility" />
                    </FormSection>

                    {/* Group 2: Procedure */}
                    <FormSection title="2. Procedure Details">
                        <SelectField
                            name="procedure.procedureType"
                            label="Procedure Type"
                            options={[
                                { label: 'IVF', value: 'IVF' },
                                { label: 'DI', value: 'DI' },
                            ]}
                        />
                        <BooleanField name="procedure.isOvulationStimulated" label="Ovulation Stimulated" />
                        <BooleanField name="procedure.isSingleEmbryoTransfer" label="Single Embryo Transfer" />
                        <BooleanField name="procedure.usePGT_A" label="PGT-A Used" />
                        <BooleanField name="procedure.usePGT_M" label="PGT-M Used" />
                    </FormSection>

                    {/* Group 3: Causes */}
                    <FormSection title="3. Etiology">
                        <BooleanField name="causes.tubalDisease" label="Tubal Disease" />
                        <BooleanField name="causes.ovulatoryDisorder" label="Ovulatory Disorder" />
                        <BooleanField name="causes.maleFactor" label="Male Factor" />
                        <BooleanField name="causes.endometriosis" label="Endometriosis" />
                        <BooleanField name="causes.unknownFactor" label="Unexplained" />
                    </FormSection>

                    {/* Group 4: History */}
                    <FormSection title="4. Obstetric History">
                        <SelectField
                            name="history.totalProcedures"
                            label="Total Previous Procedures"
                            options={['0', '1', '2', '3', '4', '5', '6+'].map(v => ({ label: v, value: v }))}
                        />
                        <SelectField
                            name="history.totalBirths"
                            label="Total Previous Births"
                            options={['0', '1', '2', '3', '4', '5', '6+'].map(v => ({ label: v, value: v }))}
                        />
                    </FormSection>

                    {/* Group 5: Embryology */}
                    <FormSection title="5. Embryology">
                        <NumberField name="embryo.totalEmbryosCreated" label="Embryos Created" />
                        <NumberField name="embryo.embryosTransferred" label="Embryos Transferred" />
                        <SelectField
                            name="embryo.eggSource"
                            label="Egg Source"
                            options={[
                                { label: 'Patient', value: 'PATIENT' },
                                { label: 'Donor', value: 'DONOR' },
                                { label: 'Unknown', value: 'UNKNOWN' },
                            ]}
                        />
                    </FormSection>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Analyze Clinical Data'}
                    </Button>

                </form>
            </FormProvider>
        </div>
    );
};

export default DoctorForm;
