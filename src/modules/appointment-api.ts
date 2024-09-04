import invariant from 'tiny-invariant';
import { getFromApi } from './api';
import { CognitoUser } from 'auth/cognito';
import { AppointmentUser } from '@screens/BrowseNotes/BrowseNotes';

// TODO: add christine's endpoints to shared types library
interface GetAppointmentResponse {
    data: AppointmentUser[];
}

export const getAppointment = async (
    date: string,
    institutionId: string,
    cognitoUser: CognitoUser | null
) => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const response = (await getFromApi<GetAppointmentResponse>(
        `/institution/${institutionId}/appointments?appointmentDate=${date}`,
        'getInstitution',
        cognitoUser
    )) as GetAppointmentResponse;

    return (response?.data || []) as AppointmentUser[];
};

export const getAppointmentDetail = async (
    institutionId: string,
    appointmentId: string,
    cognitoUser: CognitoUser | null
) => {
    invariant(institutionId, '[getInstitution] missing institutionId');
    invariant(appointmentId, '[getInstitution] missing appointmentId');

    const response = (await getFromApi<GetAppointmentResponse>(
        `/institution/${institutionId}/appointments/${appointmentId}`,
        'getAppointmentDetail',
        cognitoUser
    )) as GetAppointmentResponse;

    return (response?.data || []) as AppointmentUser[];
};
