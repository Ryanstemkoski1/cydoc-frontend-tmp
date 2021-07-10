import { HpiActionTypes } from 'redux/actions/hpiActions';
import { HPI_ACTION } from '../actions/actionTypes';
import { YesNoResponse } from '../../constants/enums';
import {
    BodySystemNames,
    DiseaseCategories,
    DoctorView,
    HpiResponseType,
    PatientView,
    ResponseTypes,
    TimeOption,
    ExpectedResponseDict,
    ExpectedResponseInterface,
    ClickBoxesInput,
    BodyLocationTotal,
    BodyLocationOptions,
    BodyLocationLRItemType,
    EdgeInterface,
    BodyLocationToggle,
} from '../../constants/hpiEnums';
import { v4 } from 'uuid';

export interface HpiState {
    graph: {
        [node: string]: string[];
    };
    nodes: {
        [node: string]: NodeInterface;
    };
    edges: {
        [edge: string]: EdgeInterface;
    };
}

export interface NodeInterface {
    uid: string;
    medID: string;
    category: DiseaseCategories;
    text: string;
    responseType: ResponseTypes;
    bodySystem: BodySystemNames;
    noteSection: string;
    doctorView: DoctorView;
    patientView: PatientView;
    doctorCreated: string;
    response: HpiResponseType;
    blankTemplate: string;
    blankYes: string;
    blankNo: string;
}

export const initialHpiState: HpiState = { graph: {}, nodes: {}, edges: {} };
export const medId = 'medId';

function updateResponse(
    medId: string,
    response: HpiResponseType,
    state: HpiState
): HpiState {
    return {
        ...state,
        nodes: {
            ...state.nodes,
            [medId]: {
                ...state.nodes[medId],
                response: response,
            },
        },
    };
}

export function isStringArray(value: any): value is string[] {
    return Array.isArray(value) &&
        value.every((item: any) => typeof item === 'string')
        ? true
        : false;
}

export function isListTextDictionary(
    value: any
): value is { [uuid: string]: string } {
    return typeof value === 'object' && !Array.isArray(value);
}

export function isTimeInputDictionary(
    value: any
): value is { numInput: number; timeOption: TimeOption } {
    return (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        'numInput' in value &&
        typeof value.numInput === 'number' &&
        'timeOption' in value &&
        (Object.values(TimeOption).includes(value.timeOption) ||
            value.timeOption == '')
    );
}

export function isBodyLocationLRDict(value: any): value is BodyLocationTotal {
    return (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).every((item: string) => item in BodyLocationOptions)
    );
}

export function isBodyLocationToggleDict(
    value: any
): value is { left: boolean; center: boolean; right: boolean } {
    return (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length == 3 &&
        Object.keys(value).every(
            (item: string) => typeof value[item] == 'boolean'
        )
    );
}

export function isBodyOption(value: any): value is BodyLocationOptions {
    return Object.keys(BodyLocationOptions).every(
        (item: string) => item != value
    );
}

export function isBodyLocationToggle(value: any): value is BodyLocationToggle {
    return ['left', 'center', 'right', null].includes(value);
}

export function hpiReducer(
    state = initialHpiState,
    action: HpiActionTypes
): HpiState {
    switch (action.type) {
        case HPI_ACTION.ADD_NODE: {
            const { medId, node } = action.payload;
            const response = Object.keys(ResponseTypes)[
                Object.values(ResponseTypes).indexOf(node.responseType)
            ] as keyof ExpectedResponseInterface;
            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [medId]: {
                        ...state.nodes[medId],
                        response: ExpectedResponseDict[response],
                        responseType: node.responseType,
                        text: node.text,
                        blankYes: node.blankYes,
                        blankNo: node.blankNo,
                        blankTemplate: node.blankTemplate,
                    },
                },
            };
        }

        case HPI_ACTION.ADD_EDGE: {
            const { medId, edge } = action.payload;
            const newKey = v4();
            let newGraphResponse;
            if (medId in state.graph)
                newGraphResponse = [...state.graph[medId], newKey];
            else newGraphResponse = [newKey];
            return {
                ...state,
                graph: {
                    ...state.graph,
                    [medId]: newGraphResponse,
                },
                edges: {
                    ...state.edges,
                    [newKey]: edge,
                },
            };
        }

        case HPI_ACTION.BODY_LOCATION_RESPONSE: {
            const { medId, bodyOptions } = action.payload;
            const currResponse = state.nodes[medId].response;
            let newResponse: BodyLocationTotal = {};
            let bodyLocationOptions: BodyLocationLRItemType[] = [];
            for (const i in bodyOptions)
                bodyLocationOptions = bodyLocationOptions.concat(
                    bodyOptions[i]
                );
            if (
                state.nodes[medId].responseType == ResponseTypes.BODYLOCATION &&
                isBodyLocationLRDict(currResponse) &&
                !Object.keys(currResponse).length
            ) {
                for (const i in bodyLocationOptions) {
                    const bodyOptionItem = bodyLocationOptions[i];
                    newResponse = {
                        ...newResponse,
                        [bodyOptionItem.name]: bodyOptionItem.needsRightLeft
                            ? { left: false, center: false, right: false }
                            : false,
                    };
                }
                return updateResponse(medId, newResponse, state);
            } else return state;
        }

        case HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE: {
            const { medId, bodyOption, toggle } = action.payload;
            const response = state.nodes[medId].response as BodyLocationTotal;
            if (
                state.nodes[medId].responseType ===
                    ResponseTypes.BODYLOCATION &&
                isBodyOption(bodyOption)
            ) {
                const bodyOptionItem = response[bodyOption];
                if (
                    isBodyLocationToggleDict(bodyOptionItem) &&
                    isBodyLocationToggle(toggle) &&
                    toggle
                ) {
                    return updateResponse(
                        medId,
                        {
                            ...response,
                            [bodyOption]: {
                                ...bodyOptionItem,
                                [toggle]: !bodyOptionItem[toggle],
                            },
                        },
                        state
                    );
                } else
                    return updateResponse(
                        medId,
                        {
                            ...response,
                            [bodyOption]: !response[bodyOption],
                        },
                        state
                    );
            } else throw new Error('Not a body location response');
        }

        case HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK: {
            const { medId, name } = action.payload;
            const response = state.nodes[medId].response;
            let responseArr: ClickBoxesInput = [];
            if (
                [ResponseTypes.CLICK_BOXES, ResponseTypes.MEDS_POP].includes(
                    state.nodes[medId].responseType
                ) &&
                isStringArray(response)
            ) {
                if (!response.includes(name)) responseArr = [...response, name];
                else {
                    const [name, ...res] = response;
                    responseArr = res;
                }
                return updateResponse(medId, responseArr, state);
            } else throw new Error('Not a string array');
        }

        case HPI_ACTION.HANDLE_INPUT_CHANGE: {
            const { medId, textInput } = action.payload;
            if (state.nodes[medId].responseType === ResponseTypes.SHORT_TEXT)
                return updateResponse(medId, textInput, state);
            else throw new Error('Not a short text response');
        }

        case HPI_ACTION.HANDLE_NUMERIC_INPUT_CHANGE: {
            const { medId, input } = action.payload;
            if (state.nodes[medId].responseType === ResponseTypes.NUMBER)
                return updateResponse(medId, input, state);
            else throw new Error('Not a number input response');
        }

        case HPI_ACTION.LIST_TEXT_HANDLE_CHANGE: {
            const { uuid, medId, textInput } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.LIST_TEXT &&
                isListTextDictionary(response)
            ) {
                const newResponse = {
                    ...response,
                    [uuid]: textInput,
                };
                return updateResponse(medId, newResponse, state);
            } else throw new Error('Not a list text response');
        }
        case HPI_ACTION.REMOVE_LIST_INPUT: {
            const { uuid, medId } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.LIST_TEXT &&
                isListTextDictionary(response)
            ) {
                const { [uuid]: string, ...res } = response;
                return updateResponse(medId, res, state);
            } else throw new Error('Not a list text response');
        }
        case HPI_ACTION.ADD_LIST_INPUT: {
            const { medId } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.LIST_TEXT &&
                isListTextDictionary(response)
            ) {
                const newResponse = {
                    ...response,
                    [v4()]: '',
                };
                return updateResponse(medId, newResponse, state);
            } else throw new Error('Not a list text response');
        }
        case HPI_ACTION.HANDLE_TIME_INPUT_CHANGE: {
            const { medId, numInput } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.TIME3DAYS &&
                isTimeInputDictionary(response)
            ) {
                const newResponse = {
                    ...response,
                    numInput: numInput,
                };
                return updateResponse(medId, newResponse, state);
            } else throw new Error('Not a time input response');
        }
        case HPI_ACTION.HANDLE_TIME_OPTION_CHANGE: {
            const { medId, timeOption } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.TIME3DAYS &&
                isTimeInputDictionary(response)
            ) {
                const newResponse = {
                    ...response,
                    timeOption: timeOption,
                };
                return updateResponse(medId, newResponse, state);
            } else throw new Error('Not a time input response');
        }

        case HPI_ACTION.YES_NO_TOGGLE_OPTION: {
            const { medId, optionSelected } = action.payload;
            if (
                state.nodes[medId].responseType ===
                (ResponseTypes.YES_NO || ResponseTypes.NO_YES)
            ) {
                const response =
                    state.nodes[medId].response === optionSelected
                        ? YesNoResponse.None
                        : optionSelected;
                return updateResponse(medId, response, state);
            } else throw new Error('Not a yes/no response');
        }

        case HPI_ACTION.SCALE_HANDLE_VALUE: {
            const { medId, value } = action.payload;
            return updateResponse(medId, value, state);
        }

        case HPI_ACTION.SCALE_HANDLE_CLEAR: {
            const { medId } = action.payload;
            return updateResponse(medId, undefined, state);
        }

        case HPI_ACTION.HANDLE_BLANK_QUESTION_CHANGE: {
            const { medId, conditionId } = action.payload;
            const response = state.nodes[medId].response;
            if (
                [
                    ResponseTypes.FH_BLANK,
                    ResponseTypes.PMH_BLANK,
                    ResponseTypes.MEDS_BLANK,
                    ResponseTypes.PSH_BLANK,
                ].includes(state.nodes[medId].responseType) &&
                isStringArray(response)
            ) {
                if (response.includes(conditionId)) {
                    const [conditionId, ...res] = response;
                    const responseArr = res;
                    return updateResponse(medId, responseArr, state);
                } else
                    return updateResponse(
                        medId,
                        [...response, conditionId],
                        state
                    );
            } else throw new Error('Not a blank response');
        }

        case HPI_ACTION.POP_RESPONSE: {
            const { medId, conditionIds } = action.payload;
            const response = state.nodes[medId].response;
            if (
                [
                    ResponseTypes.FH_POP,
                    ResponseTypes.PMH_POP,
                    ResponseTypes.MEDS_POP,
                    ResponseTypes.PSH_POP,
                ].includes(state.nodes[medId].responseType) &&
                isStringArray(response) &&
                !response.length
            )
                return updateResponse(medId, conditionIds, state);
            else return state;
        }

        default:
            return state;
    }
}
