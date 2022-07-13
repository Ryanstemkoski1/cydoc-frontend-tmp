import { PatientPronouns } from 'constants/patientInformation';
import { PATIENT_INFORMATION_ACTION } from './actionTypes';

export interface UpdatePatientPronounsAction {
    type: PATIENT_INFORMATION_ACTION.UPDATE_PRONOUNS;
    payload: {
        pronouns: PatientPronouns;
    };
}

export interface UpdatePatientNameAction {
    type: PATIENT_INFORMATION_ACTION.UPDATE_NAME;
    payload: {
        patientName: string;
    };
}

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

export function updatePatientName(
    patientName: string
): UpdatePatientNameAction {
    return {
        type: PATIENT_INFORMATION_ACTION.UPDATE_NAME,
        payload: {
            patientName,
        },
    };
}

export function updatePatientPronouns(
    pronouns: PatientPronouns
): UpdatePatientPronounsAction {
    return {
        type: PATIENT_INFORMATION_ACTION.UPDATE_PRONOUNS,
        payload: {
            pronouns,
        },
    };
}

export type PatientInformationActionTypes =
    | UpdatePatientInformationAction
    | UpdatePatientNameAction
    | UpdatePatientPronounsAction;
