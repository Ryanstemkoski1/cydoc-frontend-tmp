import { ApiResponse, GetMembersResponse, Institution } from '@cydoc-ai/types';
import { CognitoUser } from 'auth/cognito';
import { hpiHeaders as knowledgeGraphAPI } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import invariant from 'tiny-invariant';
import { getFromApi, postToApi } from './api';

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

export interface InstitutionConfig {
    id: number;
    institutionId: string;
    showChiefComplaints: boolean;
    showDefaultForm: boolean;
    diseaseForm: DiseaseForm[];
}

export interface DiseaseForm {
    id: string;
    diseaseKey: string;
    diseaseName: string;
    isDeleted: boolean;
}

export async function validateDiseaseForm(
    config: InstitutionConfig
): Promise<boolean> {
    const responseData = (await knowledgeGraphAPI).data;
    const knowledgegraphDiseaseForm = Object.entries(
        responseData.parentNodes
    ).map(
        ([key, value]) =>
            ({
                diseaseKey: Object.keys(value as object)?.[0],
                diseaseName: key,
            } as DiseaseForm)
    );

    const { diseaseForm } = config;

    const result = diseaseForm.every((item) =>
        knowledgegraphDiseaseForm.find(
            (kgItem) =>
                kgItem.diseaseKey === item.diseaseKey &&
                kgItem.diseaseName === item.diseaseName
        )
    );

    return result;
}

export interface InstitutionConfigResponse {
    config: InstitutionConfig;
}

export const getInstitutionConfig = async (
    institutionId: string
): Promise<InstitutionConfigResponse | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<InstitutionConfigResponse>(
        `/institution-config/${institutionId}`,
        'getInstitutionConfig',
        null // no authentication on get institution
    );
};

export const updateInstitutionConfig = async (
    updatedInstitutionConfig: InstitutionConfig,
    cognitoUser: CognitoUser | null
): Promise<InstitutionConfigResponse | ApiResponse> => {
    const { showChiefComplaints, showDefaultForm, diseaseForm, institutionId } =
        updatedInstitutionConfig;

    return postToApi<InstitutionConfigResponse>(
        `/institution-config/${institutionId}`,
        'updateInstitutionConfig',
        {
            showChiefComplaints,
            showDefaultForm,
            diseaseForm,
        },
        cognitoUser
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
