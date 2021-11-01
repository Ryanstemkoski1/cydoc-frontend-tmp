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

export type chiefComplaintsActionTypes = SelectChiefComplaintAction;
