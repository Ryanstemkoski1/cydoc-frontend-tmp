import { ADD_PATIENT } from '../actions/actionTypes';

export interface PatientState {
    patients: any[];
}

export const initialPatientsState = {
    patients: [],
};

export const patientReducer = (state = initialPatientsState, action: any) => {
    switch (action.type) {
        case ADD_PATIENT:
            return {
                ...state,
                // patients: [...state.patients, action.payload],
                patients: action.payload,
            };
        default:
            return state;
    }
};
