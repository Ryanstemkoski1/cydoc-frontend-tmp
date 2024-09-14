import { UPDATE_ADDITIONAL_DETAILS } from '@redux/actions/actionTypes';
import {
    GoBackToAdditionalSurvey,
    UpdateAdditionalSurveyAction,
    UpdateChiefComplaintsDescription,
    UpdateUserInfo,
    ValidateUserInfo,
} from '@redux/actions/additionalSurveyActions';
import { RootState } from '@redux/store';

export interface AdditionalSurvey {
    legalFirstName: string;
    legalLastName: string;
    legalMiddleName: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    initialSurveyState: number;
    userInfo: UserInfo;
    isUserInfoValid: boolean;
    complaintsDescription: string;
}

export interface UserInfo {
    cellPhoneNumber: string;
    email: string;
    address: {
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        zipCode: string;
    };
    isInsured: boolean;
    insuranceInfo: {
        insuranceCompanyName: string;
        insuranceCompanyPhoneNumber: string;
        policyHolderName: string;
        policyHolderRelationship: string;
        policyHolderDOB: string;
        policyHolderEmployed: boolean;
        policyHolderEmployer: string;
        policyHolderSSN: string;
        policyHolderID: string;
        group: string;
    };
    race: string[];
    ethnicity: string;
    genderIdentity: string[];
    sex: string;
    preferredPronouns: string;
    title: string;
}

export const initialAdditionalSurveyData: AdditionalSurvey = {
    legalFirstName: '',
    legalLastName: '',
    legalMiddleName: '',
    dateOfBirth: '',
    socialSecurityNumber: '',
    initialSurveyState: 0,
    userInfo: {
        cellPhoneNumber: '',
        email: '',
        address: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
        },
        isInsured: false,
        insuranceInfo: {
            insuranceCompanyName: '',
            insuranceCompanyPhoneNumber: '',
            policyHolderName: '',
            policyHolderRelationship: '',
            policyHolderDOB: '',
            policyHolderEmployed: false,
            policyHolderEmployer: '',
            policyHolderSSN: '',
            policyHolderID: '',
            group: '',
        },
        race: [],
        ethnicity: '',
        genderIdentity: [],
        sex: '',
        preferredPronouns: '',
        title: '',
    },
    isUserInfoValid: true,
    complaintsDescription: '',
};

export function additionalSurveyReducer(
    state = initialAdditionalSurveyData,
    action:
        | UpdateAdditionalSurveyAction
        | UpdateChiefComplaintsDescription
        | GoBackToAdditionalSurvey
        | UpdateUserInfo
        | ValidateUserInfo
) {
    switch (action.type) {
        case UPDATE_ADDITIONAL_DETAILS.UPDATE_ADDITIONAL_DETAILS:
            state.legalFirstName = action.payload?.legalFirstName;
            state.legalLastName = action.payload?.legalLastName;
            state.legalMiddleName = action.payload?.legalMiddleName;
            state.socialSecurityNumber = action?.payload.socialSecurityNumber;
            state.dateOfBirth = action.payload?.dateOfBirth;
            state.initialSurveyState = action?.payload?.initialSurveyState;
            return { ...state };
        case UPDATE_ADDITIONAL_DETAILS.UPDATE_CC_DESCRIPTION:
            state.complaintsDescription = action.payload?.complaintsDescription;
            return state;
        case UPDATE_ADDITIONAL_DETAILS.GO_BACK:
            state.initialSurveyState = state.initialSurveyState - 1;
            return state;
        case UPDATE_ADDITIONAL_DETAILS.UPDATE_USER_INFO:
            state.userInfo = action.payload;
            return state;
        case UPDATE_ADDITIONAL_DETAILS.VALIDATE_USER_INFO:
            state.isUserInfoValid = action.payload;
            return state;
        default:
            return state;
    }
}

export const selectAdditionalSurvey = (state: RootState) =>
    state.additionalSurvey;
