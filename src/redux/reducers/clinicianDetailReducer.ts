import { CLINICIAN_DETAILS } from 'redux/actions/actionTypes';
import { clinicianDetailAction } from 'redux/actions/clinicianDetailActions';

export interface initialClinicianDetailType {
    first_name: string;
    last_name: string;
    id: number | null;
    institution_id: number | null;
    email: string;
}

export const initialClinicianDetail: initialClinicianDetailType = {
    first_name: '',
    last_name: '',
    id: null,
    institution_id: null,
    email: '',
};

export function clinicianDetailReducer(
    state = initialClinicianDetail,
    action: clinicianDetailAction
) {
    switch (action.type) {
        case CLINICIAN_DETAILS.SET_CLINICIAN_FIRST_NAME: {
            const newState = { ...state };
            newState.first_name = action.payload.first_name as string;
            return newState;
        }
        case CLINICIAN_DETAILS.SET_CLINICIAN_LAST_NAME: {
            const newState = { ...state };
            newState.last_name = action.payload.last_name as string;
            return newState;
        }
        case CLINICIAN_DETAILS.SET_CLINICIAN_EMAIL: {
            const newState = { ...state };
            newState.email = action.payload.email as string;
            return newState;
        }
        case CLINICIAN_DETAILS.SET_CLINICIAN_ID: {
            const newState = { ...state };
            newState.id = action.payload.id as number;
            return newState;
        }
        case CLINICIAN_DETAILS.SET_CLINICIAN_INSTITUTION_ID: {
            const newState = { ...state };
            newState.institution_id = action.payload.institution_id as number;
            return newState;
        }
        case CLINICIAN_DETAILS.SET_CLINICIAN_DETAIL: {
            const newState = action.payload.obj as initialClinicianDetailType;
            return newState;
        }
        default:
            return state;
    }
}
