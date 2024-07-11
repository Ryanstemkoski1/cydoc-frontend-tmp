import { CurrentNoteState } from '@redux/reducers';
import {
    PlanDiagnosis,
    PlanPrescription,
    PlanProceduresAndServices,
    PlanReferrals,
    PlanSurvey,
    PlanState,
    initialPlanState,
} from '@redux/reducers/planReducer';
import { PlanCondition } from '../reducers/planReducer';

export type PlanDiagnosisFlat = PlanDiagnosis & { id: string };
export type PlanPrescriptionFlat = PlanPrescription & { id: string };
export type PlanProceduresAndServicesFlat = PlanProceduresAndServices & {
    id: string;
};
export type PlanReferralsFlat = PlanReferrals & { id: string };

type PlanCategory =
    | PlanDiagnosis
    | PlanPrescription
    | PlanProceduresAndServices
    | PlanReferrals;
export type PlanCategoryFlat =
    | PlanDiagnosisFlat
    | PlanPrescriptionFlat
    | PlanProceduresAndServicesFlat
    | PlanReferralsFlat;

export interface PlanConditionsFlat {
    id: string;
    name: string;
    differentialDiagnoses: PlanDiagnosisFlat[];
    prescriptions: PlanPrescriptionFlat[];
    proceduresAndServices: PlanProceduresAndServicesFlat[];
    referrals: PlanReferralsFlat[];
}

export function selectPlanState(state: CurrentNoteState): PlanState {
    return state.discussionPlan;
}

export function selectPlanSurvey(state: CurrentNoteState): PlanSurvey {
    return selectPlanState(state).survey;
}

export const flattenConditionCategory = ([id, values]: [
    string,
    PlanCategory,
]) => ({ ...values, id });

export const flattenCondition = ([id, conditionValue]: [
    string,
    PlanCondition,
]) => ({
    ...conditionValue,
    id,
    differentialDiagnoses: Object.entries(
        conditionValue.differentialDiagnoses
    ).map(flattenConditionCategory) as PlanDiagnosisFlat[],
    prescriptions: Object.entries(conditionValue.prescriptions).map(
        flattenConditionCategory
    ) as PlanPrescriptionFlat[],
    proceduresAndServices: Object.entries(
        conditionValue.proceduresAndServices
    ).map(flattenConditionCategory) as PlanProceduresAndServicesFlat[],
    referrals: Object.entries(conditionValue.referrals).map(
        flattenConditionCategory
    ) as PlanReferralsFlat[],
});

// Selects the flattend condition in Plan with given id, or the initial condition if id is invalid
export function selectPlanCondition(
    state: CurrentNoteState,
    id: string
): PlanConditionsFlat {
    const planCondition =
        selectPlanState(state).conditions[id] ||
        Object.values(initialPlanState.conditions)[0];
    return flattenCondition([id, planCondition]);
}

// Selects conditions in Plan as array and flattens nested objects into arrays
export function selectPlanConditions(
    state: CurrentNoteState
): PlanConditionsFlat[] {
    const planConditions = selectPlanState(state).conditions;
    return Object.entries(planConditions).map(flattenCondition);
}
