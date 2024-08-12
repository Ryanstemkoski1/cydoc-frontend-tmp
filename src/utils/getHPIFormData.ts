import {
    HpiResponseType,
    ResponseTypes,
    SelectManyInput,
    SelectOneInput,
} from '@constants/hpiEnums';
import getHPIText, { HPIReduxValues } from './getHPIText';
import { UserSurveyState } from '@redux/reducers/userViewReducer';
import { AdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';

function sanitizeString(str: string) {
    return str.replace(/[`'"\(\)\[\]{}]/g, '');
}

export default function getHPIFormData(
    additionalSurvey: AdditionalSurvey,
    userSurvey: UserSurveyState,
    state: HPIReduxValues,
    isAdvancedReport: boolean
) {
    const {
        legalFirstName: first_name = '',
        legalMiddleName: middle_name = '',
        legalLastName: last_name = '',
        dateOfBirth: date_of_birth = '',
        socialSecurityNumber: last_4_ssn = '',
    } = additionalSurvey;

    // Set patientName to the value from additionalSurvey.legalLastName.
    const updatedState = {
        ...state,
        patientInformation: {
            ...state.patientInformation,
            patientName: additionalSurvey.legalLastName
                ? additionalSurvey.legalLastName
                : '',
        },
    };

    return {
        first_name: sanitizeString(first_name),
        middle_name: sanitizeString(middle_name),
        last_name: sanitizeString(last_name),
        date_of_birth,
        last_4_ssn,
        hpi_text: JSON.stringify(getHPIText(updatedState, isAdvancedReport)),
        clinician_last_name: sanitizeString(
            (userSurvey?.nodes['9']?.response ?? '') as string
        ).trim(),
        appointment_date: userSurvey?.nodes[8]?.response ?? '',
    };
}

/**
 * Check if Form has any value
 * @param {string | ChiefComplaintsState | SelectOneInput | ListTextInput} response={}
 * @returns boolean
 */
export function isResponseValid(response = {}): boolean {
    const responseValues = Object.values(response) as string[];
    return (
        responseValues.length !== 0 &&
        responseValues.some((listItem) => listItem.trim())
    );
}

export function isHPIResponseValid(
    response: HpiResponseType,
    responseType: ResponseTypes
): boolean {
    switch (responseType) {
        case ResponseTypes.SELECTMANYDENSE:
        case ResponseTypes.SELECTMANY:
        case ResponseTypes.SELECTONE: {
            const newResponse = response as SelectManyInput | SelectOneInput;
            return Object.keys(newResponse).some((key) => newResponse[key]);
        }
        default: {
            return false;
        }
    }
}
