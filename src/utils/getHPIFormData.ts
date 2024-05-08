import {
    HpiResponseType,
    ResponseTypes,
    SelectManyInput,
    SelectOneInput,
} from 'constants/hpiEnums';
import { makeStore } from '@redux/store';
import getHPIText from './getHPIText';

function sanitizeString(str: string) {
    return str.replace(/[`'"\(\)\[\]{}]/g, '');
}

export default function getHPIFormData() {
    const rootState = makeStore.getState();

    const {
        legalFirstName: first_name = '',
        legalMiddleName: middle_name = '',
        legalLastName: last_name = '',
        dateOfBirth: date_of_birth = '',
        socialSecurityNumber: last_4_ssn = '',
    } = rootState?.additionalSurvey;

    return {
        first_name: sanitizeString(first_name),
        middle_name: sanitizeString(middle_name),
        last_name: sanitizeString(last_name),
        date_of_birth,
        last_4_ssn,
        hpi_text: JSON.stringify(getHPIText(true)),
        clinician_last_name: sanitizeString(
            (rootState?.userView?.userSurvey?.nodes['9']?.response ??
                '') as string
        ).trim(),
        appointment_date:
            rootState?.userView?.userSurvey?.nodes[8]?.response ?? '',
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
