import { ApiResponse, GetMembersResponse, Institution } from '@cydoc-ai/types';
import invariant from 'tiny-invariant';
import { postToApi } from './api';
import { CognitoUser } from 'auth/cognito';

export const getInstitutionMembers = (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<GetMembersResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return postToApi<GetMembersResponse>(
        `/institution/${institutionId}/members`,
        'getInstitutionMembers',
        null,
        cognitoUser,
        false
    );
};

export const getInstitution = (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<Institution | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return postToApi<Institution>(
        `/institution/${institutionId}`,
        'getInstitution',
        null,
        cognitoUser,
        false
    );
};
