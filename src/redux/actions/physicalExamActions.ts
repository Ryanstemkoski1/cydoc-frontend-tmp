import { LRButtonState } from 'constants/enums';
import { VitalsFields } from 'redux/reducers/physicalExamReducer';
import { PHYSICAL_EXAM_ACTION } from './actionTypes';

export interface UpdateVitalsAction {
    type: PHYSICAL_EXAM_ACTION.UPDATE_VITALS;
    payload: {
        vitalsField: VitalsFields;
        newValue: number;
    };
}

export const updateVitals = (
    vitalsField: VitalsFields,
    newValue: number
): UpdateVitalsAction => ({
    type: PHYSICAL_EXAM_ACTION.UPDATE_VITALS,
    payload: {
        vitalsField,
        newValue,
    },
});

export interface ToggleFindingAction {
    type: PHYSICAL_EXAM_ACTION.TOGGLE_FINDING;
    payload: {
        section: string;
        finding: string;
    };
}

export const toggleFinding = (
    section: string,
    finding: string
): ToggleFindingAction => ({
    type: PHYSICAL_EXAM_ACTION.TOGGLE_FINDING,
    payload: {
        section,
        finding,
    },
});

export interface RemoveFindingAction {
    type: PHYSICAL_EXAM_ACTION.REMOVE_FINDING;
    payload: {
        section: string;
        finding: string;
    };
}

export const removeFinding = (
    section: string,
    finding: string
): RemoveFindingAction => ({
    type: PHYSICAL_EXAM_ACTION.REMOVE_FINDING,
    payload: {
        section,
        finding,
    },
});

export interface ToggleLeftRightFindingAction {
    type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING;
    payload: {
        section: string;
        finding: string;
        buttonClicked: keyof LRButtonState;
    };
}

export const toggleLeftRightFinding = (
    section: string,
    finding: string,
    buttonClicked: keyof LRButtonState
): ToggleLeftRightFindingAction => ({
    type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING,
    payload: {
        section,
        finding,
        buttonClicked,
    },
});

export interface ToggleChooseBooleanValueAction {
    type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE;
    payload: {
        section: string;
        finding: string;
        response: boolean;
    };
}

export const toggleChooseBooleanValue = (
    section: string,
    finding: string,
    response: boolean
): ToggleChooseBooleanValueAction => ({
    type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    payload: {
        section,
        finding,
        response,
    },
});

export interface UpdateCommentsAction {
    type: PHYSICAL_EXAM_ACTION.UPDATE_COMMENTS;
    payload: {
        section: string;
        newComments: string;
    };
}

export const updateComments = (
    section: string,
    newComments: string
): UpdateCommentsAction => ({
    type: PHYSICAL_EXAM_ACTION.UPDATE_COMMENTS,
    payload: {
        section,
        newComments,
    },
});

export type PhysicalExamActionTypes =
    | UpdateVitalsAction
    | ToggleFindingAction
    | ToggleLeftRightFindingAction
    | ToggleChooseBooleanValueAction
    | RemoveFindingAction
    | UpdateCommentsAction;
