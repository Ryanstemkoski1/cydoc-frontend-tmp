import { PatientPronouns } from 'constants/patientInformation';
import { PATIENT_INFORMATION_ACTION } from 'redux/actions/actionTypes';
import { PatientInformationActionTypes } from 'redux/actions/patientInformationActions';

export interface PatientInformationState {
    patientName: string;
    pronouns: PatientPronouns;
}

export const initialPatientInformationState: PatientInformationState = {
    patientName: '',
    pronouns: PatientPronouns.They,
};

export function patientInformationReducer(
    state = initialPatientInformationState,
    action: PatientInformationActionTypes
): PatientInformationState {
    switch (action.type) {
        case PATIENT_INFORMATION_ACTION.UPDATE_INFORMATION: {
            return {
                ...state,
                patientName: action.payload.patientName,
                pronouns: action.payload.pronouns,
            };
        }
        default:
            return state;
    }
}
