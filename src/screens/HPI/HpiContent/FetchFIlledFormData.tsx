import { apiClient } from '@constants/api';

export const FetchFilledFormData = async (
    appointment_id: string,
    form_category: string
) => {
    try {
        const url = `/filled-form/${appointment_id}/${form_category}`;

        // the GET request
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching filled form data:', error);
    }
};
