import { PredictionRequest, PredictionResponse, DistributionResponse, PlannerResponse } from '../types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);
const API_KEY = import.meta.env.VITE_API_KEY || '';
const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const parseApiError = async (response: Response) => {
    try {
        const payload = await response.json();
        const errorCode = payload?.error?.code;
        if (errorCode === 'CHAT_DISABLED') {
            return 'AI 모델 키가 설정되지 않아 채팅을 사용할 수 없습니다. 관리자에게 OPENAI_API_KEY 설정을 요청하세요.';
        }
        if (errorCode === 'INVALID_API_KEY') {
            return '백엔드 인증 키가 일치하지 않습니다. 서버 설정을 확인해주세요.';
        }
        if (errorCode === 'RATE_LIMIT_EXCEEDED') {
            return '요청이 많아 잠시 제한되었습니다. 잠시 후 다시 시도해주세요.';
        }
        if (payload?.error?.message) {
            return payload.error.message;
        }
    } catch {
        // Ignore JSON parse failures.
    }
    return `요청 실패 (HTTP ${response.status})`;
};

const requestJson = async <T>(path: string, body: unknown): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (API_KEY) {
            headers['x-api-key'] = API_KEY;
        }

        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(await parseApiError(response));
        }

        return response.json() as Promise<T>;
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            throw new Error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

// Mock Data Generators (optional demo mode)
const mockPrediction = (): PredictionResponse => ({
    probability: 0.15 + Math.random() * 0.2,
    ci_low: 0.12,
    ci_high: 0.28,
    cohort_mean: 0.22,
    cohort_percentile: 65,
    top_factors: [
        { name: 'Age', direction: 'down', strength: 0.8 },
        { name: 'Ovulation stimulation', direction: 'up', strength: 0.6 },
    ],
    notes: 'Demo prediction response.',
});

const mockDistribution = (): DistributionResponse => ({
    probability: 0.25,
    distribution: Array.from({ length: 50 }, () => Math.random()),
    percentiles: {
        p10: 0.1,
        p25: 0.15,
        p50: 0.25,
        p75: 0.35,
        p90: 0.45,
    },
    notes: 'Demo distribution response.',
});

const mockPlanner = (): PlannerResponse => ({
    risk_band: Math.random() > 0.6 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW',
    recommended_plans: [
        { name: 'Basic IVF Support', monthly_range: [100000, 150000], why: 'Suitable for initial attempts.' },
        { name: 'Comprehensive Care', monthly_range: [200000, 300000], why: 'Includes multi-cycle support.' },
    ],
    exclusions: ['Experimental procedures', 'Non-medical selection'],
    notes: 'Demo planner response.',
});

export const api = {
    predict: async (data: PredictionRequest): Promise<PredictionResponse> => {
        if (IS_DEMO_MODE) {
            await new Promise((resolve) => setTimeout(resolve, 700));
            return mockPrediction();
        }
        return requestJson<PredictionResponse>('/predict', data);
    },

    getDistribution: async (data: PredictionRequest): Promise<DistributionResponse> => {
        if (IS_DEMO_MODE) {
            await new Promise((resolve) => setTimeout(resolve, 700));
            return mockDistribution();
        }
        return requestJson<DistributionResponse>('/distribution', data);
    },

    getPlannerRisk: async (data: PredictionRequest): Promise<PlannerResponse> => {
        if (IS_DEMO_MODE) {
            await new Promise((resolve) => setTimeout(resolve, 700));
            return mockPlanner();
        }
        return requestJson<PlannerResponse>('/planner', data);
    },

    chat: async (role: string, messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
        if (IS_DEMO_MODE) {
            await new Promise((resolve) => setTimeout(resolve, 900));
            return { message: '이것은 데모 응답입니다. 백엔드 연결 시 실제 AI 답변이 제공됩니다.' };
        }
        return requestJson<{ message: string; model?: string }>('/chat', { role, messages });
    }
};
