import { apiClient } from '@constants/api';

export interface FilledFormParams {
    appointmentId: string;
    formCategory: string;
    formContent: object;
    status: string;
}

export const saveFilledFormToDb = async ({
    appointmentId,
    formCategory,
    formContent,
    status,
}: FilledFormParams) => {
    // Validate input data
    if (!appointmentId || !formCategory || !formContent || !status) {
        console.error('Validation Error: Missing required fields');
        return;
    }

    try {
        //save filled_form data to db
        const response = await apiClient.post('/filled-form/', {
            appointment_id: appointmentId,
            form_category: formCategory,
            form_content: JSON.stringify(formContent),
            status: status,
        });
        return response.data;
    } catch (error) {
        console.error(
            'Error saving data:',
            error.response ? error.response.data : error.message
        );
    }
};
