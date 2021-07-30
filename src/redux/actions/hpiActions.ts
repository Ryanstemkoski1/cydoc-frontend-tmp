import { HPI_ACTION } from './actionTypes';
import { YesNoResponse } from 'constants/enums';
import {
    TimeOption,
    NumberInput,
    BodyLocationOptions,
    BodyLocationToggle,
    BodyLocationLRItemType,
    EdgeInterface,
} from 'constants/hpiEnums';
import { NodeInterface } from 'redux/reducers/hpiReducer';

export interface AddNodeAction {
    type: HPI_ACTION.ADD_NODE;
    payload: {
        medId: string;
        node: NodeInterface;
    };
}

export function addNode(medId: string, node: NodeInterface): AddNodeAction {
    return {
        type: HPI_ACTION.ADD_NODE,
        payload: {
            medId,
            node,
        },
    };
}

export interface AddEdgeAction {
    type: HPI_ACTION.ADD_EDGE;
    payload: {
        medId: string;
        edge: EdgeInterface;
    };
}

export function addEdge(medId: string, edge: EdgeInterface): AddEdgeAction {
    return {
        type: HPI_ACTION.ADD_EDGE,
        payload: {
            medId,
            edge,
        },
    };
}

export interface BodyLocationResponseAction {
    type: HPI_ACTION.BODY_LOCATION_RESPONSE;
    payload: {
        medId: string;
        bodyOptions: BodyLocationLRItemType[][];
    };
}

export function bodyLocationResponse(
    medId: string,
    bodyOptions: BodyLocationLRItemType[][]
): BodyLocationResponseAction {
    return {
        type: HPI_ACTION.BODY_LOCATION_RESPONSE,
        payload: {
            medId,
            bodyOptions,
        },
    };
}

export interface BodyLocationResponseAction {
    type: HPI_ACTION.BODY_LOCATION_RESPONSE;
    payload: {
        medId: string;
        bodyOptions: BodyLocationLRItemType[][];
    };
}

export interface BodyLocationHandleToggleAction {
    type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE;
    payload: {
        medId: string;
        bodyOption: BodyLocationOptions;
        toggle: BodyLocationToggle;
    };
}

export function bodyLocationHandleToggle(
    medId: string,
    bodyOption: BodyLocationOptions,
    toggle: BodyLocationToggle
): BodyLocationHandleToggleAction {
    return {
        type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
        payload: {
            medId,
            bodyOption,
            toggle,
        },
    };
}

export interface MultipleChoiceHandleClickAction {
    type: HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK;
    payload: {
        medId: string;
        name: string;
    };
}

export function multipleChoiceHandleClick(
    medId: string,
    name: string
): MultipleChoiceHandleClickAction {
    return {
        type: HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK,
        payload: {
            medId,
            name,
        },
    };
}

export interface HandleInputChangeAction {
    type: HPI_ACTION.HANDLE_INPUT_CHANGE;
    payload: {
        medId: string;
        textInput: string;
    };
}

export function handleInputChange(
    medId: string,
    textInput: string
): HandleInputChangeAction {
    return {
        type: HPI_ACTION.HANDLE_INPUT_CHANGE,
        payload: {
            medId,
            textInput,
        },
    };
}

export interface ListTextHandleChangeAction {
    type: HPI_ACTION.LIST_TEXT_HANDLE_CHANGE;
    payload: {
        uuid: string;
        medId: string;
        textInput: string;
    };
}

export function listTextHandleChange(
    uuid: string,
    medId: string,
    textInput: string
): ListTextHandleChangeAction {
    return {
        type: HPI_ACTION.LIST_TEXT_HANDLE_CHANGE,
        payload: {
            uuid,
            medId,
            textInput,
        },
    };
}

export interface RemoveListInputAction {
    type: HPI_ACTION.REMOVE_LIST_INPUT;
    payload: {
        uuid: string;
        medId: string;
    };
}

export function removeListInput(
    uuid: string,
    medId: string
): RemoveListInputAction {
    return {
        type: HPI_ACTION.REMOVE_LIST_INPUT,
        payload: {
            uuid,
            medId,
        },
    };
}

export interface AddListInputAction {
    type: HPI_ACTION.ADD_LIST_INPUT;
    payload: {
        medId: string;
    };
}

export function addListInput(medId: string): AddListInputAction {
    return {
        type: HPI_ACTION.ADD_LIST_INPUT,
        payload: {
            medId,
        },
    };
}

export interface HandleNumericInputChangeAction {
    type: HPI_ACTION.HANDLE_NUMERIC_INPUT_CHANGE;
    payload: {
        medId: string;
        input: NumberInput;
    };
}

export function handleNumericInputChange(
    medId: string,
    input: NumberInput
): HandleNumericInputChangeAction {
    return {
        type: HPI_ACTION.HANDLE_NUMERIC_INPUT_CHANGE,
        payload: {
            medId,
            input,
        },
    };
}

export interface HandleTimeInputChangeAction {
    type: HPI_ACTION.HANDLE_TIME_INPUT_CHANGE;
    payload: {
        medId: string;
        numInput: NumberInput;
    };
}

export function handleTimeInputChange(
    medId: string,
    numInput: NumberInput
): HandleTimeInputChangeAction {
    return {
        type: HPI_ACTION.HANDLE_TIME_INPUT_CHANGE,
        payload: {
            medId,
            numInput,
        },
    };
}

export interface HandleTimeOptionChangeAction {
    type: HPI_ACTION.HANDLE_TIME_OPTION_CHANGE;
    payload: {
        medId: string;
        timeOption: TimeOption;
    };
}

export function handleTimeOptionChange(
    medId: string,
    timeOption: TimeOption
): HandleTimeOptionChangeAction {
    return {
        type: HPI_ACTION.HANDLE_TIME_OPTION_CHANGE,
        payload: {
            medId,
            timeOption,
        },
    };
}

export interface YesNoToggleOptionAction {
    type: HPI_ACTION.YES_NO_TOGGLE_OPTION;
    payload: {
        medId: string;
        optionSelected: YesNoResponse;
    };
}

export function yesNoToggleOption(
    medId: string,
    optionSelected: YesNoResponse
): YesNoToggleOptionAction {
    return {
        type: HPI_ACTION.YES_NO_TOGGLE_OPTION,
        payload: {
            medId,
            optionSelected,
        },
    };
}

export interface ScaleHandleValueAction {
    type: HPI_ACTION.SCALE_HANDLE_VALUE;
    payload: {
        medId: string;
        value: number;
    };
}

export function scaleHandleValue(
    medId: string,
    value: number
): ScaleHandleValueAction {
    return {
        type: HPI_ACTION.SCALE_HANDLE_VALUE,
        payload: {
            medId,
            value,
        },
    };
}

export interface ScaleHandleClearAction {
    type: HPI_ACTION.SCALE_HANDLE_CLEAR;
    payload: {
        medId: string;
    };
}

export function scaleHandleClear(medId: string): ScaleHandleClearAction {
    return {
        type: HPI_ACTION.SCALE_HANDLE_CLEAR,
        payload: {
            medId,
        },
    };
}

export interface BlankQuestionChangeAction {
    type: HPI_ACTION.HANDLE_BLANK_QUESTION_CHANGE;
    payload: {
        medId: string;
        conditionId: string;
        x?: boolean;
    };
}

export function blankQuestionChange(
    medId: string,
    conditionId: string,
    x?: boolean
): BlankQuestionChangeAction {
    return {
        type: HPI_ACTION.HANDLE_BLANK_QUESTION_CHANGE,
        payload: {
            medId,
            conditionId,
            x,
        },
    };
}

export interface PopResponseAction {
    type: HPI_ACTION.POP_RESPONSE;
    payload: {
        medId: string;
        conditionIds: string[];
    };
}

export function popResponse(
    medId: string,
    conditionIds: string[]
): PopResponseAction {
    return {
        type: HPI_ACTION.POP_RESPONSE,
        payload: { medId, conditionIds },
    };
}

export type HpiActionTypes =
    | AddNodeAction
    | AddEdgeAction
    | BodyLocationResponseAction
    | BodyLocationHandleToggleAction
    | MultipleChoiceHandleClickAction
    | HandleInputChangeAction
    | ListTextHandleChangeAction
    | RemoveListInputAction
    | AddListInputAction
    | HandleNumericInputChangeAction
    | HandleTimeInputChangeAction
    | HandleTimeOptionChangeAction
    | YesNoToggleOptionAction
    | ScaleHandleValueAction
    | ScaleHandleClearAction
    | BlankQuestionChangeAction
    | PopResponseAction;
