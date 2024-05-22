import { initialReviewOfSystemsState } from '@constants/reviewOfSystemsInitial';
import { combineReducers } from 'redux';
import { AllActionTypes } from '../actions';
import { CURRENT_NOTE_ACTION } from '../actions/actionTypes';
import { CurrentNoteActionTypes } from '../actions/currentNoteActions';
import { activeItemReducer, initialActiveItemState } from './activeItemReducer';
import {
    additionalSurveyReducer,
    initialAdditionalSurveyData,
} from './additionalSurveyReducer';
import { allergiesReducer, initialAllergiesState } from './allergiesReducer';
import {
    chiefComplaintsReducer,
    initialChiefComplaintsState,
} from './chiefComplaintsReducer';
import {
    initialNoteId,
    initialNoteTitle,
    noteIdReducer,
    noteTitleReducer,
} from './currentNoteReducer';
import {
    familyHistoryReducer,
    initialFamilyHistoryState,
} from './familyHistoryReducer';
import { hpiHeadersReducer, initialHpiHeadersState } from './hpiHeadersReducer';
import { hpiReducer, initialHpiState } from './hpiReducer';
import {
    initialLoadingStatus,
    loadingStatusReducer,
} from './loadingStatusReducer';
import {
    initialMedicalHistoryState,
    medicalHistoryReducer,
} from './medicalHistoryReducer';
import {
    initialMedicationsState,
    medicationsReducer,
} from './medicationsReducer';
import {
    initialPatientInformationState,
    patientInformationReducer,
} from './patientInformationReducer';
import {
    initialPhysicalExamState,
    physicalExamReducer,
} from './physicalExamReducer';
import { initialPlanState, planReducer } from './planReducer';
import { reviewOfSystemsReducer } from './reviewOfSystemsReducer';
import {
    initialSocialHistoryState,
    socialHistoryReducer,
} from './socialHistoryReducer';
import {
    initialSurgicalHistoryState,
    surgicalHistoryReducer,
} from './surgicalHistoryReducer';
import { initialUserViewState, userViewReducer } from './userViewReducer';

const currentNoteReducer = combineReducers({
    reviewOfSystems: reviewOfSystemsReducer,
    physicalExam: physicalExamReducer,
    medicalHistory: medicalHistoryReducer,
    surgicalHistory: surgicalHistoryReducer,
    medications: medicationsReducer,
    allergies: allergiesReducer,
    socialHistory: socialHistoryReducer,
    familyHistory: familyHistoryReducer,
    discussionPlan: planReducer,
    hpi: hpiReducer,
    _id: noteIdReducer,
    title: noteTitleReducer,
    chiefComplaints: chiefComplaintsReducer,
    patientInformation: patientInformationReducer,
    hpiHeaders: hpiHeadersReducer,
    userView: userViewReducer,
    activeItem: activeItemReducer,
    additionalSurvey: additionalSurveyReducer,
    loadingStatus: loadingStatusReducer,
});

export type CurrentNoteState = ReturnType<typeof currentNoteReducer>;

export const initialState: CurrentNoteState = {
    reviewOfSystems: initialReviewOfSystemsState,
    physicalExam: initialPhysicalExamState,
    medicalHistory: initialMedicalHistoryState,
    surgicalHistory: initialSurgicalHistoryState,
    medications: initialMedicationsState,
    allergies: initialAllergiesState,
    socialHistory: initialSocialHistoryState,
    familyHistory: initialFamilyHistoryState,
    discussionPlan: initialPlanState,
    hpi: initialHpiState,
    _id: initialNoteId,
    title: initialNoteTitle,
    chiefComplaints: initialChiefComplaintsState,
    patientInformation: initialPatientInformationState,
    hpiHeaders: initialHpiHeadersState,
    userView: initialUserViewState,
    activeItem: initialActiveItemState,
    additionalSurvey: initialAdditionalSurveyData,
    loadingStatus: initialLoadingStatus,
};

export function rootReducer(
    state = initialState,
    action: CurrentNoteActionTypes | AllActionTypes
): CurrentNoteState {
    switch (action.type) {
        case CURRENT_NOTE_ACTION.LOAD_NOTE:
            return action.payload;
        case CURRENT_NOTE_ACTION.DELETE_NOTE:
            return initialState;
        default:
            return currentNoteReducer(state, action as AllActionTypes);
    }
}
