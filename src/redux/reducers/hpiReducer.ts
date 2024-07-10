import { HpiActionTypes } from '@redux/actions/hpiActions';
import { CHIEF_COMPLAINTS, HPI_ACTION } from '../actions/actionTypes';
import { YesNoResponse } from '@constants/enums';
import {
    HpiResponseType,
    ResponseTypes,
    TimeOption,
    ExpectedResponseDict,
    ExpectedResponseInterface,
    BodyLocationType,
    BodyLocationOptions,
    EdgeInterface,
    leftRightCenter,
    LabTestType,
    NodeInterface,
    OrderInterface,
    SelectOneInput,
} from '@constants/hpiEnums';
import { v4 } from 'uuid';

export interface HpiState {
    graph: {
        [node: string]: string[];
    };
    nodes: {
        [node: string]: {
            uid: string;
            medID: string;
            category: string;
            text: string;
            responseType: ResponseTypes;
            bodySystem: string;
            noteSection: string;
            doctorView: string;
            patientView: string;
            doctorCreated: string;
            blankTemplate: string;
            blankYes: string;
            blankNo: string;
            response: HpiResponseType;
        };
    };
    edges: {
        [edge: string]: EdgeInterface;
    };
    order: {
        [medId: string]: OrderInterface;
    };
    miscNotes: {
        [disease: string]: string;
    };
}

export const initialHpiState: HpiState = {
    graph: {},
    nodes: {},
    edges: {},
    order: {},
    miscNotes: {},
};
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

function labTestResponse(
    node: NodeInterface,
    response: keyof ExpectedResponseInterface
): HpiResponseType {
    /* 
    Passed from ADD_NODE - parses 'text' string to get each of 
    name, snomed, components, and units and places them into a
    key-value format for the LABORATORY_TEST response attribute
    in state. User responses can then be saved in the 'components' 
    object as either a change in 'unit', 'value', or 'unitOptions'.
    This response format will then be easy to read in LaboratoryTest.tsx.
    */
    let specificResponse = ExpectedResponseDict[response];
    if (
        [
            ResponseTypes.LABORATORY_TEST,
            ResponseTypes.CBC,
            ResponseTypes.BMP,
            ResponseTypes.LFT,
        ].includes(node.responseType)
    ) {
        const name = node.text.split('NAME[')[1].split(']')[0],
            snomed = node.text.split('SNOMED[')[1].split(']')[0],
            components = node.text
                .split('COMPONENTS_AND_UNITS[')[1]
                .split(']')[0],
            responseDict: LabTestType = {
                name: name,
                snomed: snomed,
                components: {},
            };
        components.split(',').forEach((cu) => {
            const compSplit = cu.split('HASUNITS');
            responseDict.components[compSplit[0].trim()] = {
                unit: compSplit[1].trim(),
                value: undefined,
                unitOptions: compSplit[1]
                    .trim()
                    .split('#')
                    .map((str) => str.trim() as TimeOption),
            };
        });
        specificResponse = responseDict;
    } else if (
        [ResponseTypes.SELECTONE, ResponseTypes.MEDS_POP].includes(
            node.responseType
        )
    ) {
        const text = node.text,
            click = text.search('CLICK'),
            select = text.search('\\['),
            endSelect = text.search('\\]'),
            cleanText = select != -1 && endSelect != -1,
            responses =
                click != -1 || cleanText
                    ? text
                          .slice(
                              select + 1,
                              endSelect != -1 ? endSelect : text.length
                          )
                          .split(',')
                          .map((response) => response.trim())
                    : [],
            newRes = {} as SelectOneInput;
        responses.map((key) => (newRes[key] = false));
        specificResponse = newRes;
    }
    return specificResponse;
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
        (typeof value.numInput === 'number' ||
            typeof value.numInput === 'undefined') &&
        'timeOption' in value &&
        (Object.values(TimeOption).includes(value.timeOption) ||
            value.timeOption == '')
    );
}

export function isBodyLocationLRItem(value: any): value is leftRightCenter {
    return (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length == 3 &&
        Object.keys(value).every(
            (item: string) => typeof value[item] == 'boolean'
        ) &&
        Object.keys(value).includes('left') &&
        Object.keys(value).includes('right') &&
        Object.keys(value).includes('center')
    );
}

export function isBodyOption(value: any): value is BodyLocationOptions {
    return Object.values(BodyLocationOptions).includes(value);
}

export function isLabTestDictionary(value: any): value is LabTestType {
    return (
        typeof value == 'object' &&
        !Array.isArray(value) &&
        'name' in value &&
        typeof value.name == 'string' &&
        'snomed' in value &&
        typeof value.snomed == 'string' &&
        'components' in value &&
        typeof value.components == 'object' &&
        Object.keys(value.components).every(
            (item: string) =>
                'unit' in value.components[item] &&
                'value' in value.components[item] &&
                'unitOptions' in value.components[item] &&
                typeof value.components[item].unit == 'string' &&
                (typeof value.components[item].value == 'string' ||
                    typeof value.components[item].value == 'number' ||
                    typeof value.components[item].value == 'undefined') &&
                typeof value.components[item].unitOptions == 'object'
        )
    );
}

export function isSelectOneResponse(value: any): value is SelectOneInput {
    return (
        typeof value == 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).every(
            (item: string) => typeof value[item] == 'boolean'
        )
    );
}

export function hpiReducer(
    state = initialHpiState,
    action: HpiActionTypes
): HpiState {
    switch (action.type) {
        case HPI_ACTION.PROCESS_KNOWLEDGE_GRAPH: {
            const { graph, nodes, edges, order } = action.payload.graphData,
                parentNode = order['1'];
            let newState = {
                    ...state,
                    order: {
                        ...state.order,
                        [parentNode]: order,
                    },
                },
                stack = [parentNode];
            while (stack.length) {
                const currNode = stack.shift();
                if (!currNode || !(currNode in graph)) continue;
                stack = [
                    ...stack,
                    ...graph[currNode].map((edge) => edges[edge.toString()].to),
                ];
                const childNodes = graph[currNode]
                        .map((edge: number) => [
                            edges[edge.toString()].toQuestionOrder.toString(),
                            edges[edge.toString()].to,
                        ])
                        .sort(
                            (tup1, tup2) =>
                                parseInt(tup1[0]) - parseInt(tup2[0])
                        )
                        .map(([_questionOrder, medId]) => medId),
                    node = nodes[currNode],
                    response = Object.keys(ResponseTypes)[
                        Object.values(ResponseTypes).indexOf(node.responseType)
                    ] as keyof ExpectedResponseInterface;

                // If a node does not exist in the state, then only add new data
                if (!newState.nodes[currNode]) {
                    newState = {
                        ...newState,
                        nodes: {
                            ...newState.nodes,
                            [currNode]: {
                                ...nodes[currNode],
                                response: labTestResponse(node, response),
                            },
                        },
                        graph: {
                            ...newState.graph,
                            [currNode]: Array.from(
                                new Set([
                                    ...(newState.graph[currNode] || []),
                                    ...childNodes,
                                ])
                            ),
                        },
                    };
                }
            }

            return newState;
        }

        case CHIEF_COMPLAINTS.SET_NOTES_CHIEF_COMPLAINTS: {
            const { disease, notes } = action.payload;
            return {
                ...state,
                miscNotes: {
                    ...state.miscNotes,
                    [disease]: notes,
                },
            };
        }

        case HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE: {
            /*
            Toggles either the left/center/right response attribute or the 
            response itself between true or false.
            */
            const { medId, bodyOption, toggle } = action.payload;
            if (
                state.nodes[medId].responseType == ResponseTypes.BODYLOCATION &&
                Object.values(BodyLocationOptions).includes(bodyOption)
            ) {
                const response = state.nodes[medId]
                    .response as BodyLocationType;
                const bodyOptionItem = response[bodyOption];
                return updateResponse(
                    medId,
                    isBodyLocationLRItem(bodyOptionItem)
                        ? toggle == 'center' && bodyOptionItem[toggle]
                            ? {
                                  ...response,
                                  [bodyOption]: {
                                      ...bodyOptionItem,
                                      left: false,
                                      center: false,
                                      right: false,
                                  },
                              }
                            : {
                                  ...response,
                                  [bodyOption]: {
                                      ...bodyOptionItem,
                                      [toggle]: !bodyOptionItem[toggle],
                                  },
                              }
                        : {
                              ...response,
                              [bodyOption]: !response[bodyOption],
                          },
                    state
                );
            } else throw new Error('Not a body location response');
        }

        case HPI_ACTION.SINGLE_MULTIPLE_CHOICE_HANDLE_CLICK: {
            /* 
            Adds or removes multiple choice option based on whether it was 
            already present in the list.
            */
            const { medId, name } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType == ResponseTypes.SELECTONE &&
                isSelectOneResponse(response)
            ) {
                Object.keys(response).forEach((otherName) => {
                    if (otherName != name && response[otherName]) {
                        response[otherName] = false;
                    }
                });
                return updateResponse(
                    medId,
                    {
                        ...response,
                        [name]: !response[name],
                    },
                    state
                );
            } else if (
                state.nodes[medId].responseType ==
                    ResponseTypes.SELECTMANYDENSE &&
                isSelectOneResponse(response)
            ) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        [name]: !response[name],
                    },
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

        case HPI_ACTION.HANDLE_YEAR_INPUT_CHANGE: {
            // Updates year input response
            const { medId, input } = action.payload;
            if (state.nodes[medId].responseType === ResponseTypes.YEAR)
                return updateResponse(medId, input, state);
            else throw new Error('Not a year input response');
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            const { medId, timeOption } = action.payload,
                response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.TIME3DAYS &&
                isTimeInputDictionary(response)
            ) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        timeOption:
                            response.timeOption == timeOption ? '' : timeOption,
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
                [ResponseTypes.YES_NO, ResponseTypes.NO_YES].includes(
                    state.nodes[medId].responseType
                )
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

        case HPI_ACTION.SELECT_MANY_HANDLE_CLICK: {
            const { medId, yesOrNo, option } = action.payload;
            const response = state.nodes[medId].response;
            if (
                state.nodes[medId].responseType === ResponseTypes.SELECTMANY &&
                isSelectOneResponse(response)
            ) {
                if ((yesOrNo === YesNoResponse.Yes) === response[option]) {
                    delete response[option];
                    return updateResponse(medId, response, state);
                }
                return updateResponse(
                    medId,
                    {
                        ...response,
                        [option]: yesOrNo === YesNoResponse.Yes ? true : false,
                    },
                    state
                );
            } else throw new Error('Not a SELECTMANY response');
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
        case HPI_ACTION.LAB_TEST_HANDLE_CLICK: {
            /*
            For LABORATORY_TEST type questions, clicks or unclicks the user's choice
            of unit.
            */
            const { medId, component, unit } = action.payload,
                response = state.nodes[medId].response;
            if (
                [
                    ResponseTypes.LABORATORY_TEST,
                    ResponseTypes.CBC,
                    ResponseTypes.BMP,
                    ResponseTypes.LFT,
                ].includes(state.nodes[medId].responseType) &&
                isLabTestDictionary(response)
            )
                return updateResponse(
                    medId,
                    {
                        ...response,
                        components: {
                            ...response.components,
                            [component]: {
                                ...response.components[component],
                                unit:
                                    response.components[component].unit == unit
                                        ? ''
                                        : unit,
                            },
                        },
                    },
                    state
                );
            else throw new Error('Not a lab test response');
        }

        case HPI_ACTION.LAB_TEST_INPUT_CHANGE: {
            /*
            For LABORATORY_TEST type questions, updates the user's input,
            which corresponds to the value attribute in the components object.
            */
            const { medId, component, value } = action.payload;
            const response = state.nodes[medId].response;
            if (
                [
                    ResponseTypes.LABORATORY_TEST,
                    ResponseTypes.CBC,
                    ResponseTypes.BMP,
                    ResponseTypes.LFT,
                ].includes(state.nodes[medId].responseType) &&
                isLabTestDictionary(response)
            ) {
                const newResponse = {
                    ...response,
                    components: {
                        ...response.components,
                        [component]: {
                            ...response.components[component],
                            value: value,
                        },
                    },
                };
                return updateResponse(medId, newResponse, state);
            } else throw new Error('Not a lab test response');
        }

        case HPI_ACTION.MEDS_POP_YES_NO_TOGGLE: {
            const { medId, medication, optionSelected } = action.payload,
                response = state.nodes[medId].response as {
                    [med: string]: string;
                };
            if (state.nodes[medId].responseType == ResponseTypes.MEDS_POP) {
                return updateResponse(
                    medId,
                    {
                        ...response,
                        [medication]:
                            response[medication] == optionSelected
                                ? YesNoResponse.None
                                : optionSelected,
                    },
                    state
                );
            } else throw new Error('Not a meds pop response');
        }

        case HPI_ACTION.HANDLE_DATE_INPUT_CHANGE: {
            const { medId, input } = action.payload;
            if (state.nodes[medId].responseType === ResponseTypes.DATE)
                return updateResponse(medId, input, state);
            else throw new Error('Not a date input response');
        }

        default:
            return state;
    }
}
