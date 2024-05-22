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
// import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { saveHpiHeader } from '../../../../../../redux/actions/hpiHeadersActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from '../../../../../../redux/actions/userViewActions';
import { makeStore } from '../../../../../../redux/store';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

const isPinnedChiefComplaintsSyncWithKnowledgeGraph = (
    pinnedChiefComplaints: string[],
    knowledgeGraphChiefComplaints: string[]
) => {
    return pinnedChiefComplaints.every((chiefComplaint) =>
        knowledgeGraphChiefComplaints.includes(chiefComplaint)
    );
};

// const mockStore = configureStore([]);

const renderChiefComplaintSelectionPage = (state: any) => {
    return render(
        <CCSelection
            continue={() => {}}
            onPreviousClick={() => {}}
            notification={{
                setNotificationMessage: () => {},
                setNotificationType: () => {},
            }}
            defaultInstitutionChiefComplaints={[]}
        />
    );
};

// describe('CCSelection Page', () => {
//     describe('Pinned Chief Complaints should be in sync with Knowledge Graph', () => {
//         let knowledgeGraphResponse: AxiosResponse<any>;
//         let newStore: any;
//         let initialQuestions: any;

//         // vi.setTimeout(20000);

//         beforeAll(async () => {
//             knowledgeGraphResponse = await hpiHeaders;
//         });

//         beforeEach(() => {
//             newStore = makeStore();
//             initialQuestions = JSON.parse(
//                 JSON.stringify(initialQuestionsOriginal)
//             );
//         });

//         it('Ob-gyn Institution', async () => {
//             const { getState, dispatch } = newStore;

//             initialQuestions.nodes['2'].category = 'ANNUAL_GYN_EXAM';
//             initialQuestions.nodes['2'].doctorView =
//                 ChiefComplaintsEnum.ANNUAL_GYN_EXAM_WELL_WOMAN_VISIT;

//             dispatch(processSurveyGraph(initialQuestions));
//             dispatch(saveHpiHeader(knowledgeGraphResponse.data));

//             const favComplaints =
//                 favComplaintsBasedOnInstituteType[InstitutionType.GYN];
//             const favChiefComplaintsObj: { [key: string]: boolean } = {};
//             favComplaints.forEach(
//                 (item) => (favChiefComplaintsObj[item] = false)
//             );
//             dispatch(initialSurveyAddText('6', favChiefComplaintsObj));

//             const document = renderChiefComplaintSelectionPage(getState());

//             const conditionButtons = await document.findAllByTestId(
//                 (testId) => testId.startsWith('toggle-button-'),
//                 {
//                     exact: false,
//                 }
//             );
//             const pinnedChiefComplaints = conditionButtons.map(
//                 ({ attributes }) => attributes.getNamedItem('condition')?.value
//             ) as string[];

//             const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
//                 pinnedChiefComplaints,
//                 Object.keys(knowledgeGraphResponse.data.parentNodes)
//             );

//             expect(result).toBe(true);
//         });

//         it('Endocrinology Institution', async () => {
//             const { getState, dispatch } = newStore;

//             dispatch(processSurveyGraph(initialQuestions));
//             dispatch(saveHpiHeader(knowledgeGraphResponse.data));

//             const favComplaints =
//                 favComplaintsBasedOnInstituteType[InstitutionType.ENDO];
//             const favChiefComplaintsObj: { [key: string]: boolean } = {};
//             favComplaints.forEach(
//                 (item) => (favChiefComplaintsObj[item] = false)
//             );
//             dispatch(initialSurveyAddText('6', favChiefComplaintsObj));

//             const document = renderChiefComplaintSelectionPage(getState());

//             const conditionButtons = await document.findAllByTestId(
//                 (testId) => testId.startsWith('toggle-button-'),
//                 {
//                     exact: false,
//                 }
//             );
//             const pinnedChiefComplaints = conditionButtons.map(
//                 ({ attributes }) => attributes.getNamedItem('condition')?.value
//             ) as string[];

//             const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
//                 pinnedChiefComplaints,
//                 Object.keys(knowledgeGraphResponse.data.parentNodes)
//             );

//             expect(result).toBe(true);
//         });

//         it('Family medicine Institution (Default)', async () => {
//             const { getState, dispatch } = newStore;

//             dispatch(processSurveyGraph(initialQuestions));
//             dispatch(saveHpiHeader(knowledgeGraphResponse.data));

//             const document = renderChiefComplaintSelectionPage(getState());

//             const conditionButtons = await document.findAllByTestId(
//                 (testId) => testId.startsWith('toggle-button-'),
//                 {
//                     exact: false,
//                 }
//             );
//             const pinnedChiefComplaints = conditionButtons.map(
//                 ({ attributes }) => attributes.getNamedItem('condition')?.value
//             ) as string[];

//             const result = isPinnedChiefComplaintsSyncWithKnowledgeGraph(
//                 pinnedChiefComplaints,
//                 Object.keys(knowledgeGraphResponse.data.parentNodes)
//             );

//             expect(result).toBe(true);
//         });
//     });
// });
