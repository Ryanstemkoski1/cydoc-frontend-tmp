import { YesNoResponse } from 'constants/enums';
import { SURGICAL_HISTORY_ACTION } from './actionTypes';

interface HasSurgicalHistoryAction {
    type: SURGICAL_HISTORY_ACTION.HAS_SURGICAL_HISTORY;
    payload: {
        hasSurgicalHistory: boolean;
    };
}

export function toggleHasSurgicalHistory(
    state: boolean
): HasSurgicalHistoryAction {
    return {
        type: SURGICAL_HISTORY_ACTION.HAS_SURGICAL_HISTORY,
        payload: {
            hasSurgicalHistory: state,
        },
    };
}

interface UpdateProcedureAction {
    type: SURGICAL_HISTORY_ACTION.UPDATE_PROCEDURE;
    payload: {
        index: string;
        newProcedure: string;
    };
}

export function updateProcedure(index: string, newProcedure: string) {
    return {
        type: SURGICAL_HISTORY_ACTION.UPDATE_PROCEDURE,
        payload: {
            index,
            newProcedure,
        },
    };
}

interface ToggleOptionAction {
    type: SURGICAL_HISTORY_ACTION.TOGGLE_OPTION;
    payload: {
        index: string;
        optionSelected: YesNoResponse;
    };
}

export function toggleOption(index: string, optionSelected: YesNoResponse) {
    return {
        type: SURGICAL_HISTORY_ACTION.TOGGLE_OPTION,
        payload: {
            index,
            optionSelected,
        },
    };
}

interface UpdateYearAction {
    type: SURGICAL_HISTORY_ACTION.UPDATE_YEAR;
    payload: {
        index: string;
        newYear: number;
    };
}

export function updateYear(index: string, newYear: number) {
    return {
        type: SURGICAL_HISTORY_ACTION.UPDATE_YEAR,
        payload: {
            index,
            newYear,
        },
    };
}

interface UpdateCommentsAction {
    type: SURGICAL_HISTORY_ACTION.UPDATE_COMMENTS;
    payload: {
        index: string;
        newComments: string;
    };
}

export function updateComments(index: string, newComments: string) {
    return {
        type: SURGICAL_HISTORY_ACTION.UPDATE_COMMENTS,
        payload: {
            index,
            newComments,
        },
    };
}

interface DeleteProcedureAction {
    type: SURGICAL_HISTORY_ACTION.DELETE_PROCEDURE;
    payload: {
        index: string;
    };
}

export function deleteProcedure(index: string) {
    return {
        type: SURGICAL_HISTORY_ACTION.DELETE_PROCEDURE,
        payload: {
            index,
        },
    };
}

export interface AddPshPopOptionsAction {
    type: SURGICAL_HISTORY_ACTION.ADD_PSH_POP_OPTIONS;
    payload: {
        conditionIndex: string;
        conditionName: string;
    };
}

export function addPshPopOptions(
    conditionIndex: string,
    conditionName: string
): AddPshPopOptionsAction {
    return {
        type: SURGICAL_HISTORY_ACTION.ADD_PSH_POP_OPTIONS,
        payload: {
            conditionIndex,
            conditionName,
        },
    };
}

export type SurgicalHistoryActionTypes =
    | HasSurgicalHistoryAction
    | UpdateProcedureAction
    | ToggleOptionAction
    | UpdateYearAction
    | UpdateCommentsAction
    | DeleteProcedureAction
    | AddPshPopOptionsAction;
