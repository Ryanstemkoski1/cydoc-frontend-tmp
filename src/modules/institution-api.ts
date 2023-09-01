import { getFromApi } from './api';
import { ApiResponse, GetMembersResponse, Institution } from '@cydoc-ai/types';
import invariant from 'tiny-invariant';

export const getInstitutionMembers = (
    institutionId: string
): Promise<GetMembersResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<GetMembersResponse>(
        `/institution/${institutionId}/members`,
        'getInstitutionMembers'
    );
};

export const getInstitution = (
    institutionId: string
): Promise<Institution | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<Institution>(
        `/institution/${institutionId}`,
        'getInstitution'
    );
};
