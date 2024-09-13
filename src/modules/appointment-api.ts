import invariant from 'tiny-invariant';
import { getFromApi, postToApi, putToApi } from './api';
import { CognitoUser } from 'auth/cognito';
import { AppointmentUser } from '@screens/BrowseNotes/BrowseNotes';
import { Appointment, Note } from '@cydoc-ai/types';

// TODO: add christine's endpoints to shared types library
interface GetAppointmentResponse {
    data: Appointment[];
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

    return (response?.data || []) as Appointment[];
};

export const getAppointmentDetail = async (
    institutionId: string,
    appointmentId: string,
    cognitoUser: CognitoUser | null
): Promise<Appointment> => {
    invariant(institutionId, '[getInstitution] missing institutionId');
    invariant(appointmentId, '[getInstitution] missing appointmentId');

    const response = await getFromApi(
        `/institution/${institutionId}/appointments/${appointmentId}`,
        'getAppointmentDetail',
        cognitoUser
    );

    return response as Appointment;
};

export const getInstitutionClinicians = async (
    institutionId: string,
    cognitoUser: CognitoUser | null
) => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const response = await getFromApi(
        `/institution/${institutionId}/clinicians`,
        'getInstitutionClinicians',
        cognitoUser
    );

    return response || [];
};

export const updateAppointment = async (
    institutionId: string,
    appointmentId: string,
    appointmentDate: string,
    cognitoUser: CognitoUser | null
) => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const response = await putToApi(
        `/institution/${institutionId}/appointments/${appointmentId}`,
        'updateAppointment',
        {
            appointmentDate: appointmentDate,
        },
        cognitoUser
    );

    return response || [];
};

export const addAppointmentNote = async (
    institutionId: string,
    appointmentId: string,
    hpi: string,
    cognitoUser: CognitoUser | null
) => {
    invariant(institutionId, '[addAppointmentNote] missing institutionId');
    invariant(appointmentId, '[addAppointmentNote] missing appointmentId');
    invariant(hpi, '[addAppointmentNote] missing hpi');

    const response = await postToApi<Note>(
        `/institution/${institutionId}/appointments/${appointmentId}/notes`,
        'addAppointmentNote',
        {
            hpi,
        },
        cognitoUser
    );

    return response;
};
