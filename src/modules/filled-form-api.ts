import invariant from 'tiny-invariant';
import { getFromApi } from './api';
import { apiClient } from '@constants/api';
import { GraphData } from '@constants/hpiEnums';

interface GetFilledFormResponse {
    data: {
        filled_form: {
            appointmentId: string;
            formContent: GraphData;
            status: string;
            formCategory: string;
        };
    };
}

interface FilledFormParams {
    appointmentId: string;
    formCategory: string;
    formContent: object;
    status: string;
}

export const getFilledForm = async (
    appointment_id: string,
    form_category: string
) => {
    invariant(appointment_id, '[getFilledForm] missing appointment_id');

    const response = (await getFromApi<GetFilledFormResponse>(
        `/filled-form/${appointment_id}/${form_category}`,
        'getFilledForm',
        null
    )) as GetFilledFormResponse;

    return (response || {}) as GetFilledFormResponse;
};

export const postFilledForm = async ({
    appointmentId,
    formCategory,
    formContent,
    status,
}: FilledFormParams) => {
    invariant(appointmentId, '[postFilledForm] missing appointmentId');

    // TODO: Need to add new body type of cydoc/types repo for below commented code to work
    // const response = (await postToApi<GetFilledFormResponse>(
    //     `/filled-form/`,
    //     'postFilledForm',
    //     {
    //         appointment_id: appointmentId,
    //         form_category: formCategory,
    //         form_content: JSON.stringify(formContent),
    //         status: status,
    //     },
    //     null
    // )) as GetFilledFormResponse;

    const response = await apiClient.post('/filled-form/', {
        appointment_id: appointmentId,
        form_category: formCategory,
        form_content: JSON.stringify(formContent),
        status: status,
    });

    return (response || {}) as GetFilledFormResponse;
};
