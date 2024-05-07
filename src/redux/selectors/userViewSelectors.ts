import { CurrentNoteState } from '@redux/reducers';
import { userSurveyState } from '@redux/reducers/userViewReducer';

export function selectPatientViewState(state: CurrentNoteState): boolean {
    return state.userView.patientView;
}

export function selectDoctorViewState(state: CurrentNoteState): boolean {
    return state.userView.doctorView;
}

export function selectInitialPatientSurvey(
    state: CurrentNoteState
): userSurveyState {
    return state.userView.userSurvey;
}
