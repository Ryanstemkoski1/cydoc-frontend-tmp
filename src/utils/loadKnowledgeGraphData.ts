import axios from 'axios';
import { graphClientURL } from 'constants/api';

// TODO - use this function on files where we fetch data from knowledge graph api for particular questionnaire
/**
 * Load data for passed questionnaire name from knowledge graph api
 * @param questionnaire as string
 * @returns response payload
 */
export const getQuestionnaireData = async (questionnaire: string) => {
    const response = await axios.get(
        graphClientURL + '/graph/category/' + questionnaire + '/4'
    );
    return response.data;
};

/**
 * Load all questionnaires data from Knowledge Graph api
 * @param questionnaires
 * @returns responses payload for all questionnaires
 */
export async function loadQuestionnairesData(questionnaires: string[]) {
    const dataLoadingPromises: Promise<any>[] = [];

    questionnaires.forEach((questionnaire) =>
        dataLoadingPromises.push(getQuestionnaireData(questionnaire))
    );

    const values = await Promise.all([...dataLoadingPromises]);
    return values;
}
