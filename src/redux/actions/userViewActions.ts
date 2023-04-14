import { YesNoResponse } from 'constants/enums';
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

export type userViewActionTypes =
    | UserViewAction
    | ProcessSurveyGraphAction
    | InitialSurveyYesNoAction
    | InitialSurveySearchAction;
