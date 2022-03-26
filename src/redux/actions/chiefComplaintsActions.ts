import { CHIEF_COMPLAINTS } from './actionTypes';

export interface SelectChiefComplaintAction {
    type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS;
    payload: {
        disease: string;
    };
}

export function selectChiefComplaint(
    disease: string
): SelectChiefComplaintAction {
    return {
        type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
        payload: {
            disease,
        },
    };
}

export interface SetNotesChiefComplaintAction {
    type: CHIEF_COMPLAINTS.SET_NOTES_CHIEF_COMPLAINTS;
    payload: {
        disease: string;
        notes: number | string | undefined;
    };
}

export function setNotesChiefComplaint(
    disease: string,
    notes: number | string | undefined
): SetNotesChiefComplaintAction {
    return {
        type: CHIEF_COMPLAINTS.SET_NOTES_CHIEF_COMPLAINTS,
        payload: {
            disease,
            notes,
        },
    };
}

export type chiefComplaintsActionTypes =
    | SelectChiefComplaintAction
    | SetNotesChiefComplaintAction;
