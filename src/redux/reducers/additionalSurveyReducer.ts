import { UPDATE_ADDITIONAL_DETAILS } from 'redux/actions/actionTypes';
import {
    GoBackToAdditionalSurvey,
    UpdateAdditionalSurveyAction,
} from 'redux/actions/additionalSurveyActions';

export interface additionalSurvey {
    legalFirstName: string;
    legalLastName: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    showAdditionalSurvey: boolean;
}

export const initialAdditionalSurveyData: additionalSurvey = {
    legalFirstName: '',
    legalLastName: '',
    dateOfBirth: '',
    socialSecurityNumber: '',
    showAdditionalSurvey: true,
};

export function additionalSurveyReducer(
    state = initialAdditionalSurveyData,
    action: UpdateAdditionalSurveyAction | GoBackToAdditionalSurvey
) {
    switch (action.type) {
        case UPDATE_ADDITIONAL_DETAILS.UPDATE_ADDITIONAL_DETAILS:
            state.legalFirstName = action.payload.legalFirstName;
            state.legalLastName = action.payload.legalLastName;
            state.socialSecurityNumber = action.payload.socialSecurityNumber;
            state.dateOfBirth = action.payload.dateOfBirth;
            state.showAdditionalSurvey = action.payload.showAdditionalSurvey;
            return state;
        case UPDATE_ADDITIONAL_DETAILS.GO_BACK:
            state.showAdditionalSurvey = action.payload.showAdditionalSurvey;
            return state;
        default:
            return state;
    }
}
