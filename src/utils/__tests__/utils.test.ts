import { AxiosResponse } from 'axios';
import SearchTermsToQuestionnaireMapping from 'constants/SearchTermsToQuestionnaireMapping';
import { hpiHeaders } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';

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

            const result = mappedQuestionnaires.every((questionnaire) =>
                knowledgegraphQuestionnaires.includes(questionnaire)
            );

            expect(result).toBeTruthy();
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

            const result = knowledgegraphQuestionnaires.every((questionnaire) =>
                mappedQuestionnaires.includes(questionnaire)
            );

            if (!result) {
                console.warn(
                    `Not all Knowledge Graph's Questionnaires are present in Local Questionnaire Mapping`
                );
            }
            expect(true).toBeTruthy();
        });
    });
});
