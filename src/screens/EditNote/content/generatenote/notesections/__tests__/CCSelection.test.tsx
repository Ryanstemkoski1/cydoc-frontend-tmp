import { ChiefComplaintsEnum } from '../../../../../../constants/enums/chiefComplaints.enums';
import type { AxiosResponse } from 'axios';
import {
    InstitutionType,
    favComplaintsBasedOnInstituteType,
} from '../../../../../../classes/institution.class';
import { hpiHeaders } from '../../../hpi/knowledgegraph/API.js';
import initialQuestionsOriginal from '../../../patientview/constants/initialQuestions';
import CCSelection from '../../../../../HPI/ChiefComplaintSelection/CCSelection';
import React from 'react';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { saveHpiHeader } from '../../../../../../redux/actions/hpiHeadersActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from '../../../../../../redux/actions/userViewActions';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { initialSurgicalHistoryState } from '../../../../../../redux/reducers/surgicalHistoryReducer.js';
import { initialUserViewState } from '../../../../../../redux/reducers/userViewReducer.js';
import { initialChiefComplaintsState } from '../../../../../../redux/reducers/chiefComplaintsReducer.js';
import { initialAdditionalSurveyData } from '../../../../../../redux/reducers/additionalSurveyReducer.js';
import { initialHpiHeadersState } from '../../../../../../redux/reducers/hpiHeadersReducer.js';

const isPinnedChiefComplaintsSyncWithKnowledgeGraph = (
    pinnedChiefComplaints: string[],
    knowledgeGraphChiefComplaints: string[]
) => {
    return pinnedChiefComplaints.every((chiefComplaint) =>
        knowledgeGraphChiefComplaints.includes(chiefComplaint)
    );
};

const mockStore = configureStore([]);

const renderChiefComplaintSelectionPage = (state?: any) => {
    const store = mockStore({
        additionalSurvey: initialAdditionalSurveyData,
        chiefComplaints: initialChiefComplaintsState,
        hpiHeaders: initialHpiHeadersState,
        initialQuestions: initialQuestionsOriginal,
        surgicalHistory: initialSurgicalHistoryState,
        userView: initialUserViewState,
    });

    return {
        store,
        wrapper: render(
            <Provider store={store}>
                <CCSelection
                    continue={() => {}}
                    onPreviousClick={() => {}}
                    notification={{
                        setNotificationMessage: () => {},
                        setNotificationType: () => {},
                    }}
                    defaultInstitutionChiefComplaints={[]}
                />
            </Provider>
        ),
    };
};

describe.todo('CCSelection Page', () => {
    describe('Pinned Chief Complaints should be in sync with Knowledge Graph', () => {
        let knowledgeGraphResponse: AxiosResponse<any>;
        // let newStore: any;
        let initialQuestions: any;

        beforeAll(async () => {
            knowledgeGraphResponse = await hpiHeaders;
        });

        vi.waitFor(
            () => {
                console.log(
                    `Waiting for hpiHeaders ${knowledgeGraphResponse.status}`
                );
                if (knowledgeGraphResponse.status !== 200)
                    throw new Error('hpiHeaders not ready yet');
                else {
                    console.log('hpiHeaders ready');
                }
            },
            { timeout: 10000 }
        );

        beforeEach(() => {
            initialQuestions = JSON.parse(
                JSON.stringify(initialQuestionsOriginal)
            );
        });

        it('Ob-gyn Institution', async () => {
            const { store, wrapper } = renderChiefComplaintSelectionPage();
            const { dispatch } = store;

            initialQuestions.nodes['2'].category = 'ANNUAL_GYN_EXAM';
            initialQuestions.nodes['2'].doctorView =
                ChiefComplaintsEnum.ANNUAL_GYN_EXAM_WELL_WOMAN_VISIT;

            dispatch(processSurveyGraph(initialQuestions));
            dispatch(saveHpiHeader(knowledgeGraphResponse.data));

            const favComplaints =
                favComplaintsBasedOnInstituteType[InstitutionType.GYN];
            const favChiefComplaintsObj: { [key: string]: boolean } = {};
            favComplaints.forEach(
                (item) => (favChiefComplaintsObj[item] = false)
            );
            dispatch(initialSurveyAddText('6', favChiefComplaintsObj));

            const conditionButtons = await wrapper.findAllByTestId(
                (testId) => testId.startsWith('toggle-button-'),
                {
                    exact: false,
                }
            );
            const pinnedChiefComplaints = conditionButtons.map(
                ({ attributes }) => attributes.getNamedItem('condition')?.value
            ) as string[];

            const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
                pinnedChiefComplaints,
                Object.keys(knowledgeGraphResponse.data.parentNodes)
            );

            expect(result).toBe(true);
        });

        it('Endocrinology Institution', async () => {
            const { store, wrapper } = renderChiefComplaintSelectionPage();
            const { dispatch } = store;

            dispatch(processSurveyGraph(initialQuestions));
            dispatch(saveHpiHeader(knowledgeGraphResponse.data));

            const favComplaints =
                favComplaintsBasedOnInstituteType[InstitutionType.ENDO];
            const favChiefComplaintsObj: { [key: string]: boolean } = {};
            favComplaints.forEach(
                (item) => (favChiefComplaintsObj[item] = false)
            );
            dispatch(initialSurveyAddText('6', favChiefComplaintsObj));

            const conditionButtons = await wrapper.findAllByTestId(
                (testId) => testId.startsWith('toggle-button-'),
                {
                    exact: false,
                }
            );
            const pinnedChiefComplaints = conditionButtons.map(
                ({ attributes }) => attributes.getNamedItem('condition')?.value
            ) as string[];

            const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
                pinnedChiefComplaints,
                Object.keys(knowledgeGraphResponse.data.parentNodes)
            );

            expect(result).toBe(true);
        });

        it('Family medicine Institution (Default)', async () => {
            const { store, wrapper } = renderChiefComplaintSelectionPage();
            const { dispatch } = store;

            dispatch(processSurveyGraph(initialQuestions));
            dispatch(saveHpiHeader(knowledgeGraphResponse.data));

            const conditionButtons = await wrapper.findAllByTestId(
                (testId) => testId.startsWith('toggle-button-'),
                {
                    exact: false,
                }
            );
            const pinnedChiefComplaints = conditionButtons.map(
                ({ attributes }) => attributes.getNamedItem('condition')?.value
            ) as string[];

            const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
                pinnedChiefComplaints,
                Object.keys(knowledgeGraphResponse.data.parentNodes)
            );

            expect(result).toBe(true);
        });
    });
});
