import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for labels
const LABELS: Record<string, string> = {
    // Basic
    ageGroup: '시술 당시 나이',
    yearsInfertility: '난임 기간 (년)',
    // Procedure
    procedureType: '시술 유형',
    isOvulationStimulated: '배란 자극 여부',
    ovulationInductionType: '배란 유도 유형',
    isSingleEmbryoTransfer: '단일 배아 이식 여부',
    usePGT_A: '착상 전 유전 검사(PGT-A) 사용',
    // History
    totalProcedures: '총 시술 횟수',
    totalPregnancies: '총 임신 횟수',
    totalBirths: '총 출산 횟수',
    // ... more labels can be added
};

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
    <Card className="mb-6 border-brand-100 shadow-sm">
        <CardHeader className="bg-brand-50/50 pb-4 border-b border-brand-50">
            <CardTitle className="text-lg text-brand-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
            {children}
        </CardContent>
    </Card>
);

interface BooleanFieldProps {
    name: string;
    label: string;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({ name, label }) => {
    const { control } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-brand-100 bg-white hover:bg-brand-50 transition-colors cursor-pointer" onClick={() => field.onChange(!field.value)}>
                    <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm font-medium text-brand-900">{label}</span>
                </div>
            )}
        />
    );
};

interface SelectFieldProps {
    name: string;
    label: string;
    options: { label: string; value: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ name, label, options }) => {
    const { register, formState: { errors } } = useFormContext();
    // @ts-ignore
    const error = name.split('.').reduce((obj, key) => obj?.[key], errors) as any;

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-brand-700">{label}</label>
            <Select {...register(name)} options={options} className={error ? 'border-red-500' : ''} />
            {error && <span className="text-xs text-red-500">{error.message as string}</span>}
        </div>
    );
};

interface NumberFieldProps {
    name: string;
    label: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({ name, label }) => {
    const { register, formState: { errors } } = useFormContext();
    // @ts-ignore
    const error = name.split('.').reduce((obj, key) => obj?.[key], errors) as any;

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-brand-700">{label}</label>
            <Input
                type="number"
                {...register(name, { valueAsNumber: true })}
                className={error ? 'border-red-500' : ''}
            />
            {error && <span className="text-xs text-red-500">{error.message as string}</span>}
        </div>
    );
};
