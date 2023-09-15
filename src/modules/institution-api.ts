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
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<Institution | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<Institution>(
        `/institution/${institutionId}`,
        'getInstitution',
        cognitoUser
    );
};
