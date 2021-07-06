import { CHIEF_COMPLAINTS } from './actionTypes';
import { DoctorView } from 'constants/hpiEnums';

export interface SelectChiefComplaintAction {
    type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS;
    payload: {
        disease: DoctorView;
    };
}

export function selectChiefComplaint(
    disease: DoctorView
): SelectChiefComplaintAction {
    return {
        type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
        payload: {
            disease,
        },
    };
}

export type chiefComplaintsActionTypes = SelectChiefComplaintAction;
