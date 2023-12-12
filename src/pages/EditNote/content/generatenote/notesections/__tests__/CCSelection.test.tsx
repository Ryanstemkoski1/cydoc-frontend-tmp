/* eslint-disable */
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { AxiosResponse } from 'axios';
import {
    InstitutionType,
    favComplaintsBasedOnInstituteType,
} from 'classes/institution.class';
import Enzyme, { mount } from 'enzyme';
import { hpiHeaders } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import initialQuestionsOriginal from 'pages/EditNote/content/patientview/constants/initialQuestions';
import CCSelection from 'pages/HPI/ChiefComplaintSelection/CCSelection';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { saveHpiHeader } from 'redux/actions/hpiHeadersActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new Adapter() });

const isPinnedChiefComplaintsSyncWithKnowledgeGraph = (
    pinnedChiefComplaints: string[],
    knowledgeGraphChiefComplaints: string[]
) => {
    return pinnedChiefComplaints.every((chiefComplaint) =>
        knowledgeGraphChiefComplaints.includes(chiefComplaint)
    );
};

const mockStore = configureStore([]);

const renderChiefComplaintSelectionPage = (state: any) => {
    return mount(
        <Provider store={mockStore(state)}>
            <Router>
                <CCSelection
                    continue={() => {}}
                    onPreviousClick={() => {}}
                    notification={{
                        setNotificationMessage: () => {},
                        setNotificationType: () => {},
                    }}
                    defaultInstitutionChiefComplaints={[]}
                />
            </Router>
        </Provider>
    );
};

const createNewStore = () => createCurrentNoteStore();

describe('CCSelection Page', () => {
    describe('Pinned Chief Complaints should be in sync with Knowledge Graph', () => {
        let knowledgeGraphResponse: AxiosResponse<any>;
        let newStore: any;
        let initialQuestions: any;

        jest.setTimeout(20000);

        beforeAll(async () => {
            knowledgeGraphResponse = await hpiHeaders;
        });

        beforeEach(() => {
            newStore = createNewStore();
            initialQuestions = JSON.parse(
                JSON.stringify(initialQuestionsOriginal)
            );
        });

        it('Ob-gyn Institution', () => {
            const { getState, dispatch } = newStore;

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

            const document = renderChiefComplaintSelectionPage(getState());

            const pinnedChiefComplaints = document
                .find('#pinnedChiefComplaints button')
                .map((button) =>
                    button.getDOMNode().getAttribute('condition')
                ) as string[];

            const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
                pinnedChiefComplaints,
                Object.keys(knowledgeGraphResponse.data.parentNodes)
            );

            expect(result).toBe(true);
        });

        it('Endocrinology Institution', () => {
            const { getState, dispatch } = newStore;

            dispatch(processSurveyGraph(initialQuestions));
            dispatch(saveHpiHeader(knowledgeGraphResponse.data));

            const favComplaints =
                favComplaintsBasedOnInstituteType[InstitutionType.ENDO];
            const favChiefComplaintsObj: { [key: string]: boolean } = {};
            favComplaints.forEach(
                (item) => (favChiefComplaintsObj[item] = false)
            );
            dispatch(initialSurveyAddText('6', favChiefComplaintsObj));

            const document = renderChiefComplaintSelectionPage(getState());

            const pinnedChiefComplaints = document
                .find('#pinnedChiefComplaints button')
                .map((button) =>
                    button.getDOMNode().getAttribute('condition')
                ) as string[];

            const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
                pinnedChiefComplaints,
                Object.keys(knowledgeGraphResponse.data.parentNodes)
            );

            expect(result).toBe(true);
        });

        it('Family medicine Institution (Default)', () => {
            const { getState, dispatch } = newStore;

            dispatch(processSurveyGraph(initialQuestions));
            dispatch(saveHpiHeader(knowledgeGraphResponse.data));

            const document = renderChiefComplaintSelectionPage(getState());

            const pinnedChiefComplaints = document
                .find('#pinnedChiefComplaints button')
                .map((button) =>
                    button.getDOMNode().getAttribute('condition')
                ) as string[];

            const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
                pinnedChiefComplaints,
                Object.keys(knowledgeGraphResponse.data.parentNodes)
            );

            expect(result).toBe(true);
        });
    });
});
