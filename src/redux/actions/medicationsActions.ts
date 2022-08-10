import { YesNoResponse } from 'constants/enums';
import { MEDICATIONS_ACTION } from './actionTypes';

interface UpdateDrugNameAction {
    type: MEDICATIONS_ACTION.UPDATE_DRUG_NAME;
    payload: {
        index: string;
        newDrugName: string;
    };
}

export function updateDrugName(index: string, newDrugName: string) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_DRUG_NAME,
        payload: {
            index,
            newDrugName,
        },
    };
}

interface UpdateStartYearAction {
    type: MEDICATIONS_ACTION.UPDATE_START_YEAR;
    payload: {
        index: string;
        newStartYear: number;
    };
}

export function updateStartYear(index: string, newStartYear: number) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_START_YEAR,
        payload: {
            index,
            newStartYear,
        },
    };
}

interface UpdateCurrentlyTakingAction {
    type: MEDICATIONS_ACTION.UPDATE_CURRENTLY_TAKING;
    payload: {
        index: string;
        optionSelected: YesNoResponse;
    };
}

export function updateCurrentlyTaking(
    index: string,
    optionSelected: YesNoResponse
) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_CURRENTLY_TAKING,
        payload: {
            index,
            optionSelected,
        },
    };
}

interface UpdateEndYearAction {
    type: MEDICATIONS_ACTION.UPDATE_END_YEAR;
    payload: {
        index: string;
        newEndYear: number;
    };
}

export function updateEndYear(index: string, newEndYear: number) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_END_YEAR,
        payload: {
            index,
            newEndYear,
        },
    };
}

interface UpdateScheduleAction {
    type: MEDICATIONS_ACTION.UPDATE_SCHEDULE;
    payload: {
        index: string;
        newSchedule: string;
    };
}

export function updateSchedule(index: string, newSchedule: string) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_SCHEDULE,
        payload: {
            index,
            newSchedule,
        },
    };
}

interface UpdateDoseAction {
    type: MEDICATIONS_ACTION.UPDATE_DOSE;
    payload: {
        index: string;
        newDose: string;
    };
}

export function updateDose(index: string, newDose: string) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_DOSE,
        payload: {
            index,
            newDose,
        },
    };
}

interface UpdateReasonForTakingAction {
    type: MEDICATIONS_ACTION.UPDATE_REASON_FOR_TAKING;
    payload: {
        index: string;
        newReasonForTaking: string;
    };
}

export function updateReasonForTaking(
    index: string,
    newReasonForTaking: string
) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_REASON_FOR_TAKING,
        payload: {
            index,
            newReasonForTaking,
        },
    };
}

interface UpdateSideEffectsAction {
    type: MEDICATIONS_ACTION.UPDATE_SIDE_EFFECTS;
    payload: {
        index: string;
        newSideEffects: string[];
    };
}

export function updateSideEffects(index: string, newSideEffects: string[]) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_SIDE_EFFECTS,
        payload: {
            index,
            newSideEffects,
        },
    };
}

interface UpdateCommentsAction {
    type: MEDICATIONS_ACTION.UPDATE_COMMENTS;
    payload: {
        index: string;
        newComments: string;
    };
}

export function updateComments(index: string, newComments: string) {
    return {
        type: MEDICATIONS_ACTION.UPDATE_COMMENTS,
        payload: {
            index,
            newComments,
        },
    };
}

interface DeleteMedicationAction {
    type: MEDICATIONS_ACTION.DELETE_MEDICATION;
    payload: {
        index: string;
    };
}

export function deleteMedication(index: string) {
    return {
        type: MEDICATIONS_ACTION.DELETE_MEDICATION,
        payload: {
            index,
        },
    };
}

export interface AddMedsPopOptionAction {
    type: MEDICATIONS_ACTION.ADD_MEDS_POP_OPTION;
    payload: {
        medIndex: string;
        medName: string;
    };
}

export function addMedsPopOption(medIndex: string, medName: string) {
    return {
        type: MEDICATIONS_ACTION.ADD_MEDS_POP_OPTION,
        payload: {
            medIndex,
            medName,
        },
    };
}

export type MedicationsActionTypes =
    | UpdateDrugNameAction
    | UpdateStartYearAction
    | UpdateCurrentlyTakingAction
    | UpdateEndYearAction
    | UpdateScheduleAction
    | UpdateDoseAction
    | UpdateReasonForTakingAction
    | UpdateSideEffectsAction
    | UpdateCommentsAction
    | DeleteMedicationAction
    | AddMedsPopOptionAction;
