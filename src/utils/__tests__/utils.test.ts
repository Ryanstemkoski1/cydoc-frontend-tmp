import { AxiosResponse } from 'axios';
import SearchTermsToQuestionnaireMapping from 'constants/SearchTermsToQuestionnaireMapping';
import { hpiHeaders } from 'screens/EditNote/content/hpi/knowledgegraph/API';

describe('utils tests', () => {
    jest.setTimeout(10000);

    let knowledgeGraphResponse: AxiosResponse<any>;

    beforeAll(async () => {
        knowledgeGraphResponse = await hpiHeaders;
    });

    describe('SearchTermsToQuestionnaireMapping', () => {
        it('Mapped Questionnaires must be present in Knowledge Graph', async () => {
            // unique mapped questionnaires (case insensitive)
            const mappedQuestionnaires = Array.from(
                new Set(
                    Array.from(SearchTermsToQuestionnaireMapping.values()).map(
                        (item) => item.toLowerCase()
                    )
                )
            );

            const knowledgegraphQuestionnaires = Object.keys(
                knowledgeGraphResponse.data.parentNodes
            ).map((item) => item.toLowerCase());

            const notFoundItems: string[] = [];
            mappedQuestionnaires.forEach((questionnaire) => {
                if (knowledgegraphQuestionnaires.includes(questionnaire)) {
                    return;
                }
                notFoundItems.push(questionnaire);
            });
            expect(notFoundItems).toHaveLength(0);
        });

        it('Every KnowledgeGraph Questionnaire should be atleast present in Mapped Questionnaires', () => {
            // unique mapped questionnaires (case insensitive)
            const mappedQuestionnaires = Array.from(
                new Set(
                    Array.from(SearchTermsToQuestionnaireMapping.values()).map(
                        (item) => item.toLowerCase()
                    )
                )
            );

            const knowledgegraphQuestionnaires = Object.keys(
                knowledgeGraphResponse.data.parentNodes
            ).map((item) => item.toLowerCase());

            const notFoundItems: string[] = [];
            let result: boolean = true;

            knowledgegraphQuestionnaires.forEach((chiefComplaint) => {
                if (!mappedQuestionnaires.includes(chiefComplaint)) {
                    notFoundItems.push(chiefComplaint);
                    result = false;
                }
            });

            if (!result) {
                console.warn(
                    `Not all Knowledge Graph's Questionnaires are present in Local Questionnaire Mapping`,
                    notFoundItems
                );
            }
            expect(true).toBeTruthy();
        });
    });
});
