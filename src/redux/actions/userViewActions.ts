import { YesNoResponse } from 'constants/enums';
import { SelectOneInput } from 'constants/hpiEnums';
import { initialQuestionsState } from 'redux/reducers/userViewReducer';
import { USER_VIEW_ACTION } from './actionTypes';

export interface UserViewAction {
    type: USER_VIEW_ACTION.USER_VIEW;
    payload: {
        userView: string;
    };
}
export function changeUserView(userView: string): UserViewAction {
    return {
        type: USER_VIEW_ACTION.USER_VIEW,
        payload: {
            userView,
        },
    };
}

export interface ProcessSurveyGraphAction {
    type: USER_VIEW_ACTION.PROCESS_SURVEY_GRAPH;
    payload: {
        graph: initialQuestionsState;
    };
}

export function processSurveyGraph(
    graph: initialQuestionsState
): ProcessSurveyGraphAction {
    return {
        type: USER_VIEW_ACTION.PROCESS_SURVEY_GRAPH,
        payload: {
            graph,
        },
    };
}

export interface InitialSurveyYesNoAction {
    type: USER_VIEW_ACTION.INITIAL_SURVEY_YES_NO;
    payload: {
        uid: string;
        response: YesNoResponse;
    };
}

export function initialSurveyYesNo(
    uid: string,
    response: YesNoResponse
): InitialSurveyYesNoAction {
    return {
        type: USER_VIEW_ACTION.INITIAL_SURVEY_YES_NO,
        payload: {
            uid,
            response,
        },
    };
}

export interface InitialSurveySearchAction {
    type: USER_VIEW_ACTION.INITIAL_SURVEY_SEARCH;
    payload: {
        uid: string;
        chiefComplaint: string;
    };
}

export function initialSurveySearch(
    uid: string,
    chiefComplaint: string
): InitialSurveySearchAction {
    return {
        type: USER_VIEW_ACTION.INITIAL_SURVEY_SEARCH,
        payload: {
            uid,
            chiefComplaint,
        },
    };
}

export interface InitialSurveyAddDateOrPlaceActions {
    type: USER_VIEW_ACTION.INITIAL_SURVEY_ADD_DATE_OR_PLACE;
    payload: {
        uid: string;
        response: string;
    };
}

export function initialSurveyAddDateOrPlace(
    uid: string,
    input: string
): InitialSurveyAddDateOrPlaceActions {
    return {
        type: USER_VIEW_ACTION.INITIAL_SURVEY_ADD_DATE_OR_PLACE,
        payload: {
            uid,
            response: input,
        },
    };
}

export interface InitialSurveyAddTextActions {
    type: USER_VIEW_ACTION.INITIAL_SURVEY_ADD_TEXT;
    payload: {
        uid: string;
        response: string | SelectOneInput;
    };
}

export function initialSurveyAddText(
    uid: string,
    input: string | SelectOneInput
): InitialSurveyAddTextActions {
    return {
        type: USER_VIEW_ACTION.INITIAL_SURVEY_ADD_TEXT,
        payload: {
            uid,
            response: input,
        },
    };
}

export type userViewActionTypes =
    | UserViewAction
    | ProcessSurveyGraphAction
    | InitialSurveyYesNoAction
    | InitialSurveySearchAction
    | InitialSurveyAddDateOrPlaceActions
    | InitialSurveyAddTextActions;
