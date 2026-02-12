// Dataset Groups

// Group 1: Basic/Profile
export interface BasicProfile {
    ageGroup: 'AGE_18_34' | 'AGE_35_37' | 'AGE_38_39' | 'AGE_40_42' | 'AGE_43_44' | 'AGE_45_50' | 'UNKNOWN';
    yearsInfertility: number; // 임신 시도 또는 마지막 임신 경과 연수
    procedureYearCode?: string; // Optional, doctor/planner only
}

// Group 2: Procedure
export interface ProcedureInfo {
    procedureType: 'DI' | 'IVF';
    specificProcedureType?: string;
    isOvulationStimulated: boolean;
    ovulationInductionType?: 'NOT_RECORDED' | 'GONADOTROPIN' | 'CETROTIDE' | 'UNKNOWN';
    isSingleEmbryoTransfer: boolean;
    usePGT_A: boolean; // 착상 전 유전 검사 (A)
    usePGT_M: boolean; // 착상 전 유전 진단 (M)
}

// Group 3: Infertility Causes
export interface InfertilityCauses {
    maleFactorMain: boolean;
    maleFactorSub: boolean;
    femaleFactorMain: boolean;
    femaleFactorSub: boolean;
    coupleFactorMain: boolean;
    coupleFactorSub: boolean;
    unknownFactor: boolean;

    // Specific causes
    tubalDisease: boolean;
    maleFactor: boolean;
    ovulatoryDisorder: boolean;
    femaleFactor: boolean;
    cervicalIssues: boolean;
    endometriosis: boolean;
    spermConcentration: boolean;
    spermImmunological: boolean;
    spermMotility: boolean;
    spermMorphology: boolean;
}

// Group 4: History
export interface HistoryCounts {
    totalProcedures: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    totalClinicProcedures: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    ivfProcedures: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    diProcedures: '0' | '1' | '2' | '3' | '4' | '5' | '6+';

    totalPregnancies: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    ivfPregnancies: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    diPregnancies: '0' | '1' | '2' | '3' | '4' | '5' | '6+';

    totalBirths: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    ivfBirths: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
    diBirths: '0' | '1' | '2' | '3' | '4' | '5' | '6+';
}

// Group 5: Embryo/Gamete
export interface EmbryoGameteInfo {
    embryoCreationReason: 'DONATION' | 'EGG_STORAGE' | 'EMBRYO_STORAGE' | 'RESEARCH' | 'CURRENT_PROCEDURE';
    totalEmbryosCreated: number;
    embryosTransferred: number;
    embryosStored: number;
    embryosThawed: number;

    // Micro-injection stats
    microInjectedEggs: number;
    microInjectedEmbryosCreated: number;
    microInjectedEmbryosTransferred: number;
    microInjectedEmbryosStored: number;

    eggSource: 'DONOR' | 'PATIENT' | 'UNKNOWN';
    spermSource: 'DONOR' | 'UNASSIGNED' | 'PARTNER_AND_DONOR' | 'PARTNER';

    eggDonorAge: 'UNDER_20' | 'AGE_21_25' | 'AGE_26_30' | 'AGE_31_35' | 'AGE_36_40' | 'AGE_41_45' | 'UNKNOWN';
    spermDonorAge: 'UNDER_20' | 'AGE_21_25' | 'AGE_26_30' | 'AGE_31_35' | 'AGE_36_40' | 'AGE_41_45' | 'UNKNOWN';

    useFrozenEmbryo: boolean;
    useFreshEmbryo: boolean;
    useDonorEmbryo: boolean;
    isSurrogacy: boolean;
    usePGD: boolean;
    usePGS: boolean;
}

// Group 6: Timeline
export interface TimelineInfo {
    daysSinceEggCollection: number; // Difficulty: might be null if not applicable
    daysSinceEggThawing: number;
    daysSinceEggMixing: number;
    daysSinceEmbryoTransfer: number;
    daysSinceEmbryoThawing: number;
}

// Unified Prediction Request
export interface PredictionRequest {
    basic: BasicProfile;
    procedure: ProcedureInfo;
    causes: InfertilityCauses;
    history: HistoryCounts;
    embryo: EmbryoGameteInfo;
    timeline: TimelineInfo;
}

// Prediction Response
export interface PredictionResponse {
    probability: number; // 0..1
    ci_low: number | null;
    ci_high: number | null;
    cohort_mean: number | null;
    cohort_percentile: number | null; // 0..100
    top_factors: Array<{ name: string; direction: 'up' | 'down'; strength: number }> | null;
    notes: string | null;
}

export interface DistributionResponse {
    probability: number;
    distribution: number[]; // array of probabilities 0..1
    percentiles: {
        p10: number;
        p25: number;
        p50: number;
        p75: number;
        p90: number;
    };
    notes: string | null;
}

export interface PlannerResponse {
    risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
    recommended_plans: Array<{
        name: string;
        monthly_range: [number, number];
        why: string;
    }>;
    exclusions: string[];
    notes: string | null;
}
