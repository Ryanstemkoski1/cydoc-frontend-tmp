import { PatientPronouns } from 'constants/patientInformation';
import { PATIENT_INFORMATION_ACTION } from './actionTypes';

export interface UpdatePatientInformationAction {
    type: PATIENT_INFORMATION_ACTION.UPDATE_INFORMATION;
    payload: {
        patientName: string;
        pronouns: PatientPronouns;
    };
}

export function updatePatientInformation(
    patientName: string,
    pronouns: PatientPronouns
): UpdatePatientInformationAction {
    return {
        type: PATIENT_INFORMATION_ACTION.UPDATE_INFORMATION,
        payload: {
            patientName,
            pronouns,
        },
    };
}

export type PatientInformationActionTypes = UpdatePatientInformationAction;
