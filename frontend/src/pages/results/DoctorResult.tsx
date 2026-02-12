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
                <p className="mb-4">No result data found.</p>
                <Button onClick={() => navigate('/doctor')}>Back to Input</Button>
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
                <h1 className="text-2xl font-serif font-bold text-brand-900">Clinical Prediction Report</h1>
                <Button variant="outline" onClick={() => window.print()}>Print Report</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Main Prediction */}
                <Card>
                    <CardHeader>
                        <CardTitle>Success Probability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-center py-6">
                            <span className="text-5xl font-bold text-brand-800">
                                {Math.round(result.probability * 1000) / 10}%
                            </span>
                            <span className="text-brand-500 mb-2 ml-2">estimated</span>
                        </div>
                        <div className="flex justify-center space-x-8 text-sm text-brand-600">
                            <div>
                                <span className="block font-semibold">95% CI</span>
                                [{result.ci_low}, {result.ci_high}]
                            </div>
                            <div>
                                <span className="block font-semibold">Cohort Mean</span>
                                {result.cohort_mean ? Math.round(result.cohort_mean * 100) + '%' : '-'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Factors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Influencing Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {result.top_factors?.map((factor, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-brand-50 rounded">
                                    <span className="font-medium text-brand-900">{factor.name}</span>
                                    <div className="flex items-center">
                                        <span className={`text-sm mr-2 ${factor.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {factor.direction === 'up' ? 'Increase' : 'Decrease'}
                                        </span>
                                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-brand-200">
                                            {factor.strength}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!result.top_factors && <p className="text-brand-400 text-sm">No factor analysis available.</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Cohort Probability Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis hide />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="probability" fill="#b09170" name="Probability Density" />
                            <ReferenceLine x={Math.floor(result.probability * 50)} stroke="red" label="Patient" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-xs text-brand-400 mt-2">
                        Distribution of success probabilities among similar patient cohorts. Red line indicates current patient.
                    </p>
                </CardContent>
            </Card>

            {/* Clinical Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Clinical Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-brand-800 leading-relaxed">
                        Based on the input parameters, the patient shows a probability of {(result.probability * 100).toFixed(1)}%, which is
                        {' '}{result.cohort_mean && result.probability > result.cohort_mean ? 'higher' : 'lower'} than the cohort mean.
                        Consider discussing the identified risk factors and potential interventions to optimize outcomes.
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
