import { UserInfo } from 'redux/reducers/additionalSurveyReducer';
import { UPDATE_ADDITIONAL_DETAILS } from './actionTypes';

export interface UpdateAdditionalSurveyAction {
    type: UPDATE_ADDITIONAL_DETAILS.UPDATE_ADDITIONAL_DETAILS;
    payload: {
        legalFirstName: string;
        legalLastName: string;
        socialSecurityNumber: string;
        dateOfBirth: string;
        initialSurveyState: number;
    };
}

export interface UpdateChiefComplaintsDescription {
    type: UPDATE_ADDITIONAL_DETAILS.UPDATE_CC_DESCRIPTION;
    payload: {
        complaintsDescription: string;
    };
}

export interface GoBackToAdditionalSurvey {
    type: UPDATE_ADDITIONAL_DETAILS.GO_BACK;
}

export interface UpdateUserInfo {
    type: UPDATE_ADDITIONAL_DETAILS.UPDATE_USER_INFO;
    payload: UserInfo;
}

export interface ValidateUserInfo {
    type: UPDATE_ADDITIONAL_DETAILS.VALIDATE_USER_INFO;
    payload: boolean;
}
export function updateAdditionalSurveyDetails(
    legalFirstName: string,
    legalLastName: string,
    socialSecurityNumber: string,
    dateOfBirth: string,
    initialSurveyState: number
): UpdateAdditionalSurveyAction {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.UPDATE_ADDITIONAL_DETAILS,
        payload: {
            legalFirstName,
            legalLastName,
            socialSecurityNumber,
            dateOfBirth,
            initialSurveyState,
        },
    };
}

export function updateChiefComplaintsDescription(
    complaintsDescription: string
): UpdateChiefComplaintsDescription {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.UPDATE_CC_DESCRIPTION,
        payload: { complaintsDescription },
    };
}

export function resetAdditionalSurveyPage(): GoBackToAdditionalSurvey {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.GO_BACK,
    };
}

export function updateUserInfo(payload: UserInfo): UpdateUserInfo {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.UPDATE_USER_INFO,
        payload: payload,
    };
}

export function validateUserInfo(payload: boolean): ValidateUserInfo {
    return {
        type: UPDATE_ADDITIONAL_DETAILS.VALIDATE_USER_INFO,
        payload: payload,
    };
}
