import { initialClinicianDetailType } from 'redux/reducers/clinicianDetailReducer';
import { CLINICIAN_DETAILS } from './actionTypes';

export interface clinicianDetailAction {
    type: CLINICIAN_DETAILS;
    payload: {
        [key: string]: string | number | initialClinicianDetailType;
    };
}

export function setClinicianLastName(last_name: string) {
    return {
        type: CLINICIAN_DETAILS.SET_CLINICIAN_LAST_NAME,
        payload: {
            last_name,
        },
    };
}

export function setClinicianFirstName(first_name: string) {
    return {
        type: CLINICIAN_DETAILS.SET_CLINICIAN_FIRST_NAME,
        payload: {
            first_name,
        },
    };
}

export function setClinicianEmail(email: string) {
    return {
        type: CLINICIAN_DETAILS.SET_CLINICIAN_EMAIL,
        payload: {
            email,
        },
    };
}

export function setClinicianId(id: number) {
    return {
        type: CLINICIAN_DETAILS.SET_CLINICIAN_ID,
        payload: {
            id,
        },
    };
}

export function setClinicianInstitutionId(institution_id: number) {
    return {
        type: CLINICIAN_DETAILS.SET_CLINICIAN_ID,
        payload: {
            institution_id,
        },
    };
}
export function setClinicianDetail(obj: initialClinicianDetailType) {
    return {
        type: CLINICIAN_DETAILS.SET_CLINICIAN_DETAIL,
        payload: {
            obj,
        },
    };
}
