import { HpiActionTypes } from 'redux/actions/hpiActions';
import { HPI_ACTION } from '../actions/actionTypes';
import { YesNoResponse } from '../../constants/enums';
import {
    HpiResponseType,
    ResponseTypes,
    TimeOption,
    ExpectedResponseDict,
    ExpectedResponseInterface,
    BodyLocationTotal,
    BodyLocationOptions,
    EdgeInterface,
    BodyLocationToggle,
} from '../../constants/hpiEnums';
import { v4 } from 'uuid';

export interface HpiState {
    graph: {
        [node: string]: string[];
    };
    nodes: {
        [node: string]: {
            response: HpiResponseType;
            responseType: ResponseTypes;
            text: string;
            blankYes: string;
            blankNo: string;
            blankTemplate: string;
        };
    };
    edges: {
        [edge: string]: EdgeInterface;
    };
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
            /* 
            This function adds a new node to the HPI state "nodes" attribute
            by copying responseType, text, blankYes, blankNo and blankTemplate
            attributes from the corresponding node information from the 
            knowledge graph, while adding the response attribute. The response
            attribute will have a value dependent on the expected response based
            on the response type. A graph entry with the key being the medId and
            value being the list of edges in order associated with the current
            medId. The edge entry is added by copying the edge from the edge in
            the knowledge graph.
            */
            const { medId, node, edges } = action.payload;
            if (medId in state.nodes) return state;
            const response = Object.keys(ResponseTypes)[
                Object.values(ResponseTypes).indexOf(node.responseType)
            ] as keyof ExpectedResponseInterface;
            const edgeDict: { [edgeKey: string]: EdgeInterface } = {};
            const edgeKeys = edges.map((edge) => {
                const edgeKey = 'to' + edge.to + 'from' + edge.from;
                edgeDict[edgeKey] = edge;
                return edgeKey;
            });
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
                graph: {
                    ...state.graph,
                    [medId]: edgeKeys,
                },
                edges: {
                    ...state.edges,
                    ...edgeDict,
                },
            };
        }

        case HPI_ACTION.BODY_LOCATION_RESPONSE: {
            /* 
            Initializes body location response by adding new entries with each key 
            being the body location name and value being a dictionary of left, center,
            and right or true/false as the response for the given medId.
            */
            const { medId, bodyOptions } = action.payload;
            const currResponse = state.nodes[medId].response;
            const newResponse: BodyLocationTotal = {};
            // merge array of arrays to one array
            if (
                state.nodes[medId].responseType == ResponseTypes.BODYLOCATION &&
                isBodyLocationLRDict(currResponse) &&
                !Object.keys(currResponse).length
            ) {
                bodyOptions
                    .reduce(
                        (prevValue, currValue) => prevValue.concat(currValue),
                        []
                    )
                    .map((bodyOptionItem) => {
                        newResponse[
                            bodyOptionItem.name
                        ] = bodyOptionItem.needsRightLeft
                            ? { left: false, center: false, right: false }
                            : false;
                    });
                return updateResponse(medId, newResponse, state);
            } else return state;
        }

        case HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE: {
            /*
            Toggles either the left/center/right response attribute or the 
            response itself between true or false.
            */
            const { medId, bodyOption, toggle } = action.payload;
            const response = state.nodes[medId].response as BodyLocationTotal;
            if (
                state.nodes[medId].responseType ===
                    ResponseTypes.BODYLOCATION &&
                isBodyOption(bodyOption)
            ) {
                const bodyOptionItem = response[bodyOption];
                return isBodyLocationToggleDict(bodyOptionItem) &&
                    isBodyLocationToggle(toggle) &&
                    toggle
                    ? updateResponse(
                          medId,
                          {
                              ...response,
                              [bodyOption]: {
                                  ...bodyOptionItem,
                                  [toggle]: !bodyOptionItem[toggle],
                              },
                          },
                          state
                      )
                    : updateResponse(
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
            /* 
            Adds or removes multiple choice option based on whether it was 
            already present in the list.
            */
            const { medId, name } = action.payload;
            const response = state.nodes[medId].response;
            if (
                [ResponseTypes.CLICK_BOXES, ResponseTypes.MEDS_POP].includes(
                    state.nodes[medId].responseType
                ) &&
                isStringArray(response)
            ) {
                return !response.includes(name)
                    ? updateResponse(medId, [...response, name], state)
                    : updateResponse(
                          medId,
                          response.filter((val) => val != name),
                          state
                      );
            } else throw new Error('Not a string array');
        }

        case HPI_ACTION.HANDLE_INPUT_CHANGE: {
            // Updates text input response
            const { medId, textInput } = action.payload;
            if (
                [ResponseTypes.SHORT_TEXT, ResponseTypes.RADIOLOGY].includes(
                    state.nodes[medId].responseType
                )
            )
                return updateResponse(medId, textInput, state);
            else throw new Error('Not a short text response');
        }

        case HPI_ACTION.HANDLE_NUMERIC_INPUT_CHANGE: {
            // Updates numeric input response
            const { medId, input } = action.payload;
            if (state.nodes[medId].responseType === ResponseTypes.NUMBER)
                return updateResponse(medId, input, state);
            else throw new Error('Not a number input response');
        }

        case HPI_ACTION.LIST_TEXT_HANDLE_CHANGE: {
            /* 
            updates list input response using unique ids corresponding 
            to each list text response.
            */
            const { uuid, medId, textInput } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.LIST_TEXT &&
                isListTextDictionary(response)
            ) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        [uuid]: textInput,
                    },
                    state
                );
            } else throw new Error('Not a list text response');
        }
        case HPI_ACTION.REMOVE_LIST_INPUT: {
            // removes list input response
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
            // adds new blank list input with unique id
            const { medId } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.LIST_TEXT &&
                isListTextDictionary(response)
            ) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        [v4()]: '',
                    },
                    state
                );
            } else throw new Error('Not a list text response');
        }
        case HPI_ACTION.HANDLE_TIME_INPUT_CHANGE: {
            // fixes number input for time input response
            const { medId, numInput } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.TIME3DAYS &&
                isTimeInputDictionary(response)
            ) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        numInput: numInput,
                    },
                    state
                );
            } else throw new Error('Not a time input response');
        }
        case HPI_ACTION.HANDLE_TIME_OPTION_CHANGE: {
            // fixes time option for time input response
            const { medId, timeOption } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.TIME3DAYS &&
                isTimeInputDictionary(response)
            ) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        timeOption: timeOption,
                    },
                    state
                );
            } else throw new Error('Not a time input response');
        }

        case HPI_ACTION.YES_NO_TOGGLE_OPTION: {
            /* 
            Yes/no/none response function. If the current option is 
            the same as the input option chosen by the user, the 
            "None" option is the new response (in other words, a
            double click of the same option is unclicked). Else, the 
            new response is the input response.
            */
            const { medId, optionSelected } = action.payload;
            if (
                state.nodes[medId].responseType ===
                (ResponseTypes.YES_NO || ResponseTypes.NO_YES)
            ) {
                return updateResponse(
                    medId,
                    state.nodes[medId].response === optionSelected
                        ? YesNoResponse.None
                        : optionSelected,
                    state
                );
            } else throw new Error('Not a yes/no response');
        }

        case HPI_ACTION.SCALE_HANDLE_VALUE: {
            // update scale value
            const { medId, value } = action.payload;
            return updateResponse(medId, value, state);
        }

        case HPI_ACTION.SCALE_HANDLE_CLEAR: {
            // clear scale value
            const { medId } = action.payload;
            return updateResponse(medId, undefined, state);
        }

        case HPI_ACTION.HANDLE_BLANK_QUESTION_CHANGE: {
            /* 
            For BLANK patient history type questions, each new response ID is 
            saved, which correspond to the keys in the corresponding patient 
            history state. This ID can be used to reference the response in the 
            other state.  
            TODO: have an ability to remove response ID when the input is deleted
            on HPI.  
            */
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
            )
                return updateResponse(medId, [...response, conditionId], state);
            else throw new Error('Not a blank response');
        }

        case HPI_ACTION.POP_RESPONSE: {
            /* 
            For POP type patient history questions, save the list of condition
            IDs corresponding to the keys in the corresponding patient history
            type state. These IDs can be used to reference the responses in the 
            other state.  
            */
            const { medId, conditionIds } = action.payload;
            const response = state.nodes[medId].response;
            if (
                [
                    ResponseTypes.FH_POP,
                    ResponseTypes.PMH_POP,
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
