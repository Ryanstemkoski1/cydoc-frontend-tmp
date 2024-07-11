import { CurrentNoteState } from '@redux/reducers';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';

export function selectPatientInformationState(
    state: CurrentNoteState
): PatientInformationState {
    return state.patientInformation;
}
