import { CurrentNoteState } from '@redux/reducers';
import { PatientState } from '@redux/reducers/patientReducer';

export function selectPatientState(state: CurrentNoteState): PatientState {
    return state.patientsDetails;
}
