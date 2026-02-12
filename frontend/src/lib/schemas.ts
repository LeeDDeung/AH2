import { z } from 'zod';

// Group 1: Basic/Profile
export const basicProfileSchema = z.object({
    ageGroup: z.enum(['AGE_18_34', 'AGE_35_37', 'AGE_38_39', 'AGE_40_42', 'AGE_43_44', 'AGE_45_50', 'UNKNOWN']).optional().default('UNKNOWN'),
    yearsInfertility: z.number().min(0).optional().default(0),
    procedureYearCode: z.string().optional(),
});

// Group 2: Procedure
export const procedureInfoSchema = z.object({
    procedureType: z.enum(['DI', 'IVF']).optional().default('IVF'),
    specificProcedureType: z.string().optional(),
    isOvulationStimulated: z.boolean().optional().default(false),
    ovulationInductionType: z.enum(['NOT_RECORDED', 'GONADOTROPIN', 'CETROTIDE', 'UNKNOWN']).optional(),
    isSingleEmbryoTransfer: z.boolean().optional().default(false),
    usePGT_A: z.boolean().optional().default(false),
    usePGT_M: z.boolean().optional().default(false),
});

// Group 3: Infertility Causes
export const infertilityCausesSchema = z.object({
    maleFactorMain: z.boolean().optional().default(false),
    maleFactorSub: z.boolean().optional().default(false),
    femaleFactorMain: z.boolean().optional().default(false),
    femaleFactorSub: z.boolean().optional().default(false),
    coupleFactorMain: z.boolean().optional().default(false),
    coupleFactorSub: z.boolean().optional().default(false),
    unknownFactor: z.boolean().optional().default(false),

    tubalDisease: z.boolean().optional().default(false),
    maleFactor: z.boolean().optional().default(false),
    ovulatoryDisorder: z.boolean().optional().default(false),
    femaleFactor: z.boolean().optional().default(false),
    cervicalIssues: z.boolean().optional().default(false),
    endometriosis: z.boolean().optional().default(false),
    spermConcentration: z.boolean().optional().default(false),
    spermImmunological: z.boolean().optional().default(false),
    spermMotility: z.boolean().optional().default(false),
    spermMorphology: z.boolean().optional().default(false),
});

// Group 4: History
// Allow lenient inputs, defaulting to '0'
const countEnum = z.enum(['0', '1', '2', '3', '4', '5', '6+']).optional().default('0');
export const historyCountsSchema = z.object({
    totalProcedures: countEnum,
    totalClinicProcedures: countEnum,
    ivfProcedures: countEnum,
    diProcedures: countEnum,
    totalPregnancies: countEnum,
    ivfPregnancies: countEnum,
    diPregnancies: countEnum,
    totalBirths: countEnum,
    ivfBirths: countEnum,
    diBirths: countEnum,
});

// Group 5: Embryo/Gamete
export const embryoGameteSchema = z.object({
    embryoCreationReason: z.enum(['DONATION', 'EGG_STORAGE', 'EMBRYO_STORAGE', 'RESEARCH', 'CURRENT_PROCEDURE']).optional(),
    totalEmbryosCreated: z.number().min(0).optional().default(0),
    embryosTransferred: z.number().min(0).optional().default(0),
    embryosStored: z.number().min(0).optional().default(0),
    embryosThawed: z.number().min(0).optional().default(0),

    microInjectedEggs: z.number().min(0).optional().default(0),
    microInjectedEmbryosCreated: z.number().min(0).optional().default(0),
    microInjectedEmbryosTransferred: z.number().min(0).optional().default(0),
    microInjectedEmbryosStored: z.number().min(0).optional().default(0),

    eggSource: z.enum(['DONOR', 'PATIENT', 'UNKNOWN']).optional().default('PATIENT'),
    spermSource: z.enum(['DONOR', 'UNASSIGNED', 'PARTNER_AND_DONOR', 'PARTNER']).optional().default('PARTNER'),

    eggDonorAge: z.enum(['UNDER_20', 'AGE_21_25', 'AGE_26_30', 'AGE_31_35', 'AGE_36_40', 'AGE_41_45', 'UNKNOWN']).optional(),
    spermDonorAge: z.enum(['UNDER_20', 'AGE_21_25', 'AGE_26_30', 'AGE_31_35', 'AGE_36_40', 'AGE_41_45', 'UNKNOWN']).optional(),

    useFrozenEmbryo: z.boolean().optional().default(false),
    useFreshEmbryo: z.boolean().optional().default(false),
    useDonorEmbryo: z.boolean().optional().default(false),
    isSurrogacy: z.boolean().optional().default(false),
    usePGD: z.boolean().optional().default(false),
    usePGS: z.boolean().optional().default(false),
});

// Group 6: Timeline
export const timelineSchema = z.object({
    daysSinceEggCollection: z.number().min(0).optional(),
    daysSinceEggThawing: z.number().min(0).optional(),
    daysSinceEggMixing: z.number().min(0).optional(),
    daysSinceEmbryoTransfer: z.number().min(0).optional(),
    daysSinceEmbryoThawing: z.number().min(0).optional(),
});

// Combined Schema
export const predictionFormSchema = z.object({
    basic: basicProfileSchema,
    procedure: procedureInfoSchema,
    causes: infertilityCausesSchema,
    history: historyCountsSchema,
    embryo: embryoGameteSchema,
    timeline: timelineSchema,
});

export type PredictionFormData = z.infer<typeof predictionFormSchema>;
