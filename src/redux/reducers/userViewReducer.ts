import { YesNoResponse } from 'constants/enums';
import { ClickBoxesInput, ResponseTypes } from 'constants/hpiEnums';
import { USER_VIEW_ACTION } from 'redux/actions/actionTypes';
import { userViewActionTypes } from 'redux/actions/userViewActions';
import { ChiefComplaintsState } from './chiefComplaintsReducer';

// Eventually replace with hpiState interface ??
export interface initialQuestionsState {
    order: {
        [order_id: string]: string;
    };
    graph: {
        [med_id: string]: string[];
    };
    nodes: {
        [med_id: string]: {
            uid: string;
            text: string;
            responseType: ResponseTypes;
            category: string;
            name: string;
        };
    };
}

export interface userSurveyState {
    order: {
        [order_id: string]: string;
    };
    graph: {
        [med_id: string]: string[];
    };
    nodes: {
        [med_id: string]: {
            uid: string;
            text: string;
            responseType: ResponseTypes;
            category: string;
            name: string;
            response:
                | YesNoResponse
                | ClickBoxesInput
                | string
                | ChiefComplaintsState;
        };
    };
}

export interface UserViewState {
    patientView: boolean;
    doctorView: boolean;
    userSurvey: userSurveyState;
}

export const initialUserViewState: UserViewState = {
    patientView: true,
    doctorView: false,
    userSurvey: { order: {}, graph: {}, nodes: {} },
};

export function isChiefComplaintsResponse(
    value: any
): value is ChiefComplaintsState {
    return (
        typeof value == 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).every((item: string) =>
            ['string', 'number', 'undefined'].includes(typeof value[item])
        )
    );
}

export function userViewReducer(
    state = initialUserViewState,
    action: userViewActionTypes
): UserViewState {
    switch (action.type) {
        case USER_VIEW_ACTION.USER_VIEW: {
            return {
                ...state,
                patientView: 'Patient View' == action.payload.userView,
                doctorView: 'Doctor View' == action.payload.userView,
            };
        }

        case USER_VIEW_ACTION.PROCESS_SURVEY_GRAPH: {
            const { graph } = action.payload,
                newState = {
                    ...state,
                    userSurvey: graph as userSurveyState,
                },
                // default initial response
                responseDict: {
                    [id: string]: YesNoResponse | ClickBoxesInput | string;
                } = {
                    [ResponseTypes.YES_NO]: YesNoResponse.None,
                    [ResponseTypes.CLICK_BOXES]: {},
                    [ResponseTypes.SHORT_TEXT]: '',
                };
            Object.entries(graph.nodes).map(([node, v]) => {
                let text = v.text,
                    response = responseDict[v.responseType];
                if (v.responseType == ResponseTypes.CLICK_BOXES) {
                    if ('response' in v) {
                        response = v['response'] as ClickBoxesInput;
                    } else {
                        const click = text.search('CLICK'),
                            select = text.search('\\['),
                            endSelect = text.search('\\]'),
                            responses = text
                                .slice(
                                    select + 1,
                                    endSelect != -1 ? endSelect : text.length
                                )
                                .split(',')
                                .map((response) => response.trim()),
                            newRes = {} as ClickBoxesInput;
                        responses.map((key) => (newRes[key] = false));
                        response = newRes;
                        text = text.slice(0, click);
                    }
                }
                newState.userSurvey.nodes[node] = {
                    ...newState.userSurvey.nodes[node],
                    text: text,
                    response: response,
                };
            });
            return newState;
        }

        case USER_VIEW_ACTION.INITIAL_SURVEY_YES_NO: {
            const { uid, response } = action.payload;
            return {
                ...state,
                userSurvey: {
                    ...state.userSurvey,
                    nodes: {
                        ...state.userSurvey.nodes,
                        [uid]: {
                            ...state.userSurvey.nodes[uid],
                            response:
                                response != state.userSurvey.nodes[uid].response
                                    ? response
                                    : YesNoResponse.None,
                        },
                    },
                },
            };
        }

        case USER_VIEW_ACTION.INITIAL_SURVEY_SEARCH: {
            const { uid, chiefComplaint } = action.payload,
                currRes = state.userSurvey.nodes[uid].response;
            if (isChiefComplaintsResponse(currRes)) {
                if (chiefComplaint in currRes) {
                    const { [chiefComplaint]: x, ...res } = currRes;
                    return {
                        ...state,
                        userSurvey: {
                            ...state.userSurvey,
                            nodes: {
                                ...state.userSurvey.nodes,
                                [uid]: {
                                    ...state.userSurvey.nodes[uid],
                                    response: res,
                                },
                            },
                        },
                    };
                } else
                    return {
                        ...state,
                        userSurvey: {
                            ...state.userSurvey,
                            nodes: {
                                ...state.userSurvey.nodes,
                                [uid]: {
                                    ...state.userSurvey.nodes[uid],
                                    response: {
                                        ...currRes,
                                        [chiefComplaint]: '',
                                    },
                                },
                            },
                        },
                    };
            } else
                return {
                    ...state,
                    userSurvey: {
                        ...state.userSurvey,
                        nodes: {
                            ...state.userSurvey.nodes,
                            [uid]: {
                                ...state.userSurvey.nodes[uid],
                                response: {
                                    [chiefComplaint]: '',
                                },
                            },
                        },
                    },
                };
        }

        default:
            return state;
    }
}
