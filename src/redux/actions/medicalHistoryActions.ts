import { MEDICAL_HISTORY_ACTION } from './actionTypes';
import { YesNoResponse } from '../../constants/enums';

interface ToggleOptionAction {
    type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION;
    payload: {
        index: string;
        optionSelected: YesNoResponse;
    };
}

export function toggleOption(index: string, optionSelected: YesNoResponse) {
    return {
        type: MEDICAL_HISTORY_ACTION.TOGGLE_OPTION,
        payload: {
            index,
            optionSelected,
        },
    };
}

interface UpdateConditionNameAction {
    type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_NAME;
    payload: {
        index: string;
        newName: string;
    };
}

export function updateConditionName(index: string, newName: string) {
    return {
        type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_NAME,
        payload: {
            index,
            newName,
        },
    };
}

interface UpdateStartYearAction {
    type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR;
    payload: {
        index: string;
        newStartYear: number;
    };
}

export function updateStartYear(index: string, newStartYear: number) {
    return {
        type: MEDICAL_HISTORY_ACTION.UPDATE_START_YEAR,
        payload: {
            index,
            newStartYear,
        },
    };
}

interface UpdateConditionResolvedAction {
    type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED;
    payload: {
        index: string;
        optionSelected: YesNoResponse;
    };
}

export function updateConditionResolved(
    index: string,
    optionSelected: YesNoResponse
) {
    return {
        type: MEDICAL_HISTORY_ACTION.UPDATE_CONDITION_RESOLVED,
        payload: {
            index,
            optionSelected,
        },
    };
}

interface UpdateEndYearAction {
    type: MEDICAL_HISTORY_ACTION.UPDATE_END_YEAR;
    payload: {
        index: string;
        newEndYear: number;
    };
}

export function updateEndYear(index: string, newEndYear: number) {
    return {
        type: MEDICAL_HISTORY_ACTION.UPDATE_END_YEAR,
        payload: {
            index,
            newEndYear,
        },
    };
}

interface UpdateCommentsAction {
    type: MEDICAL_HISTORY_ACTION.UPDATE_COMMENTS;
    payload: {
        index: string;
        newComments: string;
    };
}

export function updateComments(index: string, newComments: string) {
    return {
        type: MEDICAL_HISTORY_ACTION.UPDATE_COMMENTS,
        payload: {
            index,
            newComments,
        },
    };
}

interface AddDefaultConditonAction {
    type: MEDICAL_HISTORY_ACTION.ADD_CONDITION;
}

export function addDefaultCondition() {
    return {
        type: MEDICAL_HISTORY_ACTION.ADD_CONDITION,
    };
}

export interface AddPmhPopOptionsAction {
    type: MEDICAL_HISTORY_ACTION.ADD_PMH_POP_OPTIONS;
    payload: {
        conditionIndex: string;
        conditionName: string;
    };
}

export function addPmhPopOptions(
    conditionIndex: string,
    conditionName: string
): AddPmhPopOptionsAction {
    return {
        type: MEDICAL_HISTORY_ACTION.ADD_PMH_POP_OPTIONS,
        payload: {
            conditionIndex,
            conditionName,
        },
    };
}

export type MedicalHistoryActionTypes =
    | ToggleOptionAction
    | UpdateConditionNameAction
    | UpdateStartYearAction
    | UpdateConditionResolvedAction
    | UpdateEndYearAction
    | UpdateCommentsAction
    | AddDefaultConditonAction
    | AddPmhPopOptionsAction;
