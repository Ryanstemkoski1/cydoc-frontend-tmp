import { combineReducers } from 'redux';
import { AllActionTypes } from '../actions';
import { CURRENT_NOTE_ACTION } from '../actions/actionTypes';
import { CurrentNoteActionTypes } from '../actions/currentNoteActions';
import { medicalHistoryReducer, initialMedicalHistoryState } from './medicalHistoryReducer';
import {
    reviewOfSystemsReducer,
    initialReviewOfSystemsState,
} from './reviewOfSystemsReducer';
import { surgicalHistoryReducer, initialSurgicalHistoryState } from './surgicalHistoryReducer';
import { medicationsReducer, initialMedicationsState } from './medicationsReducer';
import { allergiesReducer, initialAllergiesState } from './allergiesReducer';
import {
    initialSocialHistoryState,
    socialHistoryReducer,
} from './socialHistoryReducer';
import { familyHistoryReducer, initialFamilyHistoryState } from './familyHistoryReducer';
import { initialPlanState, planReducer } from './planReducer';
import {
    initialPhysicalExamState,
    physicalExamReducer,
} from './physicalExamReducer';
import { hpiReducer, initialHpiState } from './hpiReducer';
import {
    initialNoteTitle,
    initialNoteId,
    noteTitleReducer,
    noteIdReducer,
} from './currentNoteReducer';
import { chiefComplaintsReducer } from './chiefComplaintsReducer';

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
});
export type CurrentNoteState = ReturnType<typeof currentNoteReducer>;

const initialState: CurrentNoteState = {
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
    chiefComplaints: [],
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
