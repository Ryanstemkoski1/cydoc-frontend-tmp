import { CurrentNoteState } from '@redux/reducers';
import { UserSurveyState } from '@redux/reducers/userViewReducer';

export function selectPatientViewState(state: CurrentNoteState): boolean {
    return state.userView.patientView;
}

export function selectDoctorViewState(state: CurrentNoteState): boolean {
    return state.userView.doctorView;
}

export function selectInitialPatientSurvey(
    state: CurrentNoteState
): UserSurveyState {
    return state.userView.userSurvey;
}
