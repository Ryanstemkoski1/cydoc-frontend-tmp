import { UPDATE_ADDITIONAL_DETAILS } from './actionTypes';

export interface UpdateAdditionalSurveyAction {
    type: UPDATE_ADDITIONAL_DETAILS.UPDATE_ADDITIONAL_DETAILS;
    payload: {
        legalFirstName: string;
        legalLastName: string;
        socialSecurityNumber: string;
        dateOfBirth: string;
        showAdditionalSurvey: boolean;
    };
}

export interface GoBackToAdditionalSurvey {
    type: UPDATE_ADDITIONAL_DETAILS.GO_BACK;
    payload: {
        showAdditionalSurvey: boolean;
    };
}

export function updateAdditionalSurveyDetails(
    legalFirstName: string,
    legalLastName: string,
    socialSecurityNumber: string,
    dateOfBirth: string
): UpdateAdditionalSurveyAction {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.UPDATE_ADDITIONAL_DETAILS,
        payload: {
            legalFirstName,
            legalLastName,
            socialSecurityNumber,
            dateOfBirth,
            showAdditionalSurvey: false,
        },
    };
}

export function resetAdditionalSurveyPage(): GoBackToAdditionalSurvey {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.GO_BACK,
        payload: {
            showAdditionalSurvey: true,
        },
    };
}
