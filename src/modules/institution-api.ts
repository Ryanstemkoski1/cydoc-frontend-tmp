import { ApiResponse, GetMembersResponse, Institution } from '@cydoc-ai/types';
import invariant from 'tiny-invariant';
import { getFromApi } from './api';
import { CognitoUser } from 'auth/cognito';

export const getInstitutionMembers = (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<GetMembersResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<GetMembersResponse>(
        `/institution/${institutionId}/members`,
        'getInstitutionMembers',
        cognitoUser
    );
};

export const getInstitution = (
    institutionId: string
): Promise<Institution | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<Institution>(
        `/institution/${institutionId}`,
        'getInstitution',
        null // no authentication on get institution
    );
};

export const getHpiQrCode = async (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<string> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const response = await getFromApi<{ data: { link: string | null } }>(
        `/institution/${institutionId}/hpi-qr`,
        'getInstitution',
        cognitoUser
    );

    // TODO: add christine's endpoints to shared types library
    // @ts-expect-error we need to add christine's endpoint types to shared lib
    return response?.data?.link;
};
