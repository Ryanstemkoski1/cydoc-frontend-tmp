import { ADD_PATIENT } from './actionTypes';

export const addPatient = (patientData: any) => ({
    type: ADD_PATIENT,
    payload: patientData,
});
