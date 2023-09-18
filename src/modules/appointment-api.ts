import invariant from 'tiny-invariant';
import { getFromApi } from './api';
import { CognitoUser } from 'auth/cognito';
import { AppointmentUser } from 'pages/BrowseNotes/BrowseNotes';

export const getAppointment = async (
    date: string,
    institutionId: string,
    cognitoUser: CognitoUser | null
) => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const response = await getFromApi<{ data: { data: AppointmentUser[] } }>(
        `/institution/${institutionId}/appointments?appointment_date=${date}`,
        'getInstitution',
        cognitoUser
    );

    // TODO: add christine's endpoints to shared types library
    // @ts-expect-error we need to add christine's endpoint types to shared lib
    return response?.data?.data as AppointmentUser[];
};
