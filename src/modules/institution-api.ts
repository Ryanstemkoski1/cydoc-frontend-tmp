import { getFromApi } from './api';
import { ApiResponse, GetMembersResponse } from 'types/api';
import invariant from 'tiny-invariant';
import { Institution } from 'types/intitutions';

export const getInstitutionMembers = (
    institutionId: number
): Promise<GetMembersResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<GetMembersResponse>(
        `/institution/${institutionId}/members`,
        'getInstitutionMembers'
    );
};

export const getInstitution = (
    institutionId: number
): Promise<Institution | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<Institution>(
        `/institution/${institutionId}`,
        'getInstitution'
    );
};
