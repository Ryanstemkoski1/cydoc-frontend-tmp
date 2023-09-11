import { currentNoteStore } from 'redux/store';
import getHPIText from './getHPIText';

function sanitizeString(str: string) {
    return str.replace(/[`'"\(\)\[\]{}]/g, '');
}

export default function getHPIFormData() {
    const rootState = currentNoteStore.getState();

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
        hpi_text: JSON.stringify(getHPIText()),
        clinician_last_name: sanitizeString(
            (rootState?.userView?.userSurvey?.nodes['9']?.response ??
                '') as string
        ),
        appointment_date:
            rootState?.userView?.userSurvey?.nodes[8]?.response ?? '',
    };
}
