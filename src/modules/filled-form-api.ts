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
    appointmentTemplateStepId: string;
    formCategory: string;
    formContent: object;
    status: string;
}

export const getFilledForm = async (
    appointment_id: string,
    appointment_template_step_id: string,
    form_category: string
): Promise<GetFilledFormResponse | null> => {
    invariant(appointment_id, '[getFilledForm] missing appointment_id');
    invariant(
        appointment_template_step_id,
        '[getFilledForm] missing appointment_template_step_id'
    );
    invariant(form_category, '[getFilledForm] missing form_category');

    const response = await getFromApi<GetFilledFormResponse>(
        `/filled-form/${appointment_id}/${appointment_template_step_id}/${form_category}`,
        'getFilledForm',
        null
    );

    if (!response || !(response as GetFilledFormResponse).data) return null;

    return response as GetFilledFormResponse;
};

export const postFilledForm = async ({
    appointmentId,
    appointmentTemplateStepId,
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
        appointment_template_step_id: appointmentTemplateStepId,
        form_category: formCategory,
        form_content: JSON.stringify(formContent),
        status: status,
    });

    return (response || {}) as GetFilledFormResponse;
};
