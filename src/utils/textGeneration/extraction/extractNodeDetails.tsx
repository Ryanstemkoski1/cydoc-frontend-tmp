import { WholeNoteProps } from './extractHpi';
import { ResponseTypes } from '@constants/hpiEnums';
import { YesNoResponse } from '@constants/enums';
import {
    TimeInput,
    NodeInterface,
    NodeResponseType,
    BodyLocationType,
    LabTestType,
    ListTextInput,
    SelectOneInput,
} from '@constants/hpiEnums';

/* Represents a node in the graph with associated HPI response data. */
export type GraphNode = NodeInterface & { response: NodeResponseType };

/**
 * Extracts question and answer from the node, formatted for the HPI
 * Pre-condition: node has non-empty response according to its type
 */
export const extractNode = (
    state: WholeNoteProps,
    node: GraphNode
): [string, string, string] => {
    /* eslint-disable no-case-declarations, no-fallthrough */
    if (
        (node?.responseType === ResponseTypes.YES_NO &&
            node?.response == YesNoResponse.Yes) ||
        (node?.responseType === ResponseTypes.NO_YES &&
            node?.response === YesNoResponse.No)
    ) {
        const childNode =
            state?.hpi?.nodes?.[state?.hpi?.graph?.[node?.medID]?.[0]];
        const responseTypes = [
            'MEDS-BLANK',
            'MEDS-POP',
            'FH-POP',
            'FH-BLANK',
            'PMH-POP',
            'PMH-BLANK',
            'PSH-BLANK',
            'PSH-POP',
        ];
        if (childNode) {
            if (Array.isArray(childNode?.response)) {
                if (
                    responseTypes?.includes(childNode?.responseType) &&
                    childNode?.response?.length !== 0
                ) {
                    return ['', '', ''];
                }
            }
        }
    }

    if (
        node.responseType === ResponseTypes.NO_YES ||
        node.responseType === ResponseTypes.YES_NO
    ) {
        return node?.response === YesNoResponse.Yes
            ? [node.blankYes, '', '']
            : [node.blankNo, '', ''];
    }
    // all other types utilize blankTemplate and the second string
    const { response } = node;
    const negAnswer = node?.blankTemplate?.includes('NOTANSWER');
    const lastSeparator = negAnswer ? 'or' : 'and';
    let answer = '',
        negRes = '',
        res,
        updatedRes,
        updatedNeg;

    if (
        [
            ResponseTypes.LABORATORY_TEST,
            ResponseTypes.CBC,
            ResponseTypes.BMP,
            ResponseTypes.LFT,
        ].includes(node.responseType)
    ) {
        return formatLabTestResponse(response as LabTestType);
    }

    switch (node.responseType) {
        case ResponseTypes.YEAR:
        case ResponseTypes.NUMBER:
        case ResponseTypes.AGEATEVENT:
        case ResponseTypes.SCALE1TO10:
            answer = formatNumberResponse(response as number);
            break;
        case ResponseTypes.TIME3DAYS:
            const timeRes = response as TimeInput;
            answer = formatTimeResponse(timeRes);
            break;
        case ResponseTypes.DATE:
        case ResponseTypes.SHORT_TEXT:
        case ResponseTypes.RADIOLOGY:
            answer = response as string;
            break;
        case ResponseTypes.BODYLOCATION:
            answer = formatBodyLocationResponse(
                response as BodyLocationType,
                lastSeparator
            );
            break;
        // let it be handled like other string arrays
        case ResponseTypes.LIST_TEXT:
            answer = formatListTextResponse(
                response as ListTextInput,
                lastSeparator
            );
            break;

        case ResponseTypes.PSYCHDXPICKER:
            answer = formatPsychDxPickerResponse(response as string[]);
            break;

        case ResponseTypes.SELECTMANYDENSE:
        case ResponseTypes.SELECTMANY:
        case ResponseTypes.PRONOUN:
        case ResponseTypes.SELECTONE:
            [updatedRes, updatedNeg, answer, negRes] = formatSelectResponse(
                response as SelectOneInput,
                negAnswer
            );

            break;

        case ResponseTypes.FH_POP:
        case ResponseTypes.FH_BLANK:
            res = response as string[];
            [updatedRes, updatedNeg, answer, negRes] =
                formatFamilyHistoryResponse(res, state, negAnswer);
            break;

        case ResponseTypes.MEDS_BLANK:
            answer = formatMedicationBlankResponse(
                response as string[],
                lastSeparator,
                state
            );
            break;

        case ResponseTypes.MEDS_POP:
            const medsRes = response as { [meds: string]: string };
            [updatedRes, updatedNeg, answer, negRes] =
                formatMedicationPopResponse(medsRes);
            break;

        case ResponseTypes.PMH_POP:
        case ResponseTypes.PMH_BLANK:
            res = response as string[];
            updatedRes = res.reduce(function (arr: string[], key) {
                if (
                    key in state.medicalHistory &&
                    state.medicalHistory[key]?.hasBeenAfflicted ==
                        YesNoResponse.Yes &&
                    state.medicalHistory[key]?.condition.length > 0
                )
                    arr.push(state.medicalHistory[key].condition);
                return arr;
            }, []);
            updatedNeg = res.reduce(function (arr: string[], key) {
                if (
                    key in state.medicalHistory &&
                    state.medicalHistory[key]?.hasBeenAfflicted ==
                        YesNoResponse.No &&
                    negAnswer &&
                    state.medicalHistory[key]?.condition.length > 0
                )
                    arr.push(state.medicalHistory[key].condition);
                return arr;
            }, []);
            answer = joinLists(
                updatedRes.length > 0 ? (updatedRes as string[]) : [],
                'and'
            );
            negRes = joinLists(
                updatedNeg.length > 0 ? (updatedNeg as string[]) : [],
                'or'
            );
            break;

        case ResponseTypes.PSH_POP:
        case ResponseTypes.PSH_BLANK:
            [answer, negRes] = formatPastSurgicalHistoryResponse(
                response as string[],
                state
            );
    }
    return [node.blankTemplate, answer, negRes];
};

/**
 * Joins list of strings following English grammar
 * e.g. A, B, and C
 *      A and B
 *      A
 */
export const joinLists = (items: string[], lastSeparator = 'and'): string => {
    if (items?.length > 1) {
        const lastItem = items.pop();
        items.push(`${lastSeparator} ${lastItem}`);
    }
    const separator = items?.length > 2 ? ', ' : ' ';
    return items?.join(separator);
};

/** A Helper Function to convert a numeric response into a string.*/
const formatNumberResponse = (response: number): string => response.toString();

/**
 * A Helper Function to format a TimeInput response into a single string
 * by joining the numeric input and time option with a space.
 */
const formatTimeResponse = (response: TimeInput): string => {
    return [response?.numInput, response?.timeOption].join(' ');
};

/**
 * A Helper Function to format a body locations response
 * by filtering and joining selected locations using a specified separator
 */
const formatBodyLocationResponse = (
    response: BodyLocationType,
    lastSeparator: string
): string => {
    return joinLists(
        Object?.entries(response as BodyLocationType).reduce(
            (acc: string[], [key, value]) => {
                if (
                    (typeof value === 'boolean' && value) ||
                    Object?.entries(value)?.some(([, v]) => v)
                )
                    acc.push(key);
                return acc;
            },
            []
        ),
        lastSeparator
    );
};

/**
 * A Helper Function to format and return LabTestType response
 */
const formatLabTestResponse = (response: LabTestType): [string, '', ''] => {
    const labRes = response as LabTestType;
    for (const comp in labRes.components) {
        if (labRes.components[comp].value)
            return [
                `The patient's ${labRes.name} showed ${comp} ${labRes.components[comp].value} ${labRes.components[comp].unit}`,
                '',
                '',
            ];
    }
    return ['', '', ''];
};

/**
 * A Helper Function to format ListText response as string
 */
const formatListTextResponse = (
    response: ListTextInput,
    lastSeparator: string
): string => {
    return joinLists(
        Object.values(response as ListTextInput).filter(
            (val: string) => val.length > 0
        ),
        lastSeparator
    );
};

/**
 * A Helper Function to fan array of diagnosis strings into a single string, handling cases
 * for one, two, or multiple diagnoses.
 * The response is returned as a comma-separated list with 'and' before the last item.
 */
const formatPsychDxPickerResponse = (response: string[]): string => {
    const filteredResponse = (response as string[]).filter(
        (item) => item.trim() !== ''
    );
    if (filteredResponse.length === 0) {
        return '';
    } else if (filteredResponse.length === 1) {
        return filteredResponse[0];
    } else if (filteredResponse.length === 2) {
        return filteredResponse.join(' and ');
    } else {
        const allButLast = filteredResponse.slice(0, -1).join(', ');
        const last = filteredResponse[filteredResponse.length - 1];
        return `${allButLast}, and ${last}`;
    }
};

/**
 * A Helper Function to format a SelectOneInput response into categorized arrays and strings.
 */
const formatSelectResponse = (
    response: SelectOneInput,
    negAnswer: any
): [string[], string[], string, string] => {
    const clickBoxesRes = response as SelectOneInput;
    const updatedRes = Object.keys(clickBoxesRes).filter(
        (key) => clickBoxesRes[key] && key.toLowerCase() !== 'other'
    );
    const updatedNeg = Object.keys(clickBoxesRes).filter(
        (key) =>
            !clickBoxesRes[key] && negAnswer && key.toLowerCase() !== 'other'
    );

    // If zero YESs are selected but any NOs are selected --> all selections are NO
    const allNo = updatedRes.length === 0 && updatedNeg.length > 0;

    let answer = joinLists(
        updatedRes.length > 0 ? (updatedRes as string[]) : [],
        'and'
    );
    const negRes = joinLists(
        updatedNeg.length > 0 ? (updatedNeg as string[]) : [],
        'or'
    );

    // All no --> custom answer selection to indicate that all selections were no
    if (allNo) {
        answer = 'all no';
    }
    return [updatedRes, updatedNeg, answer, negRes];
};

/**
 * A Helper Function to format family history responses into
 * categorized arrays and strings based on conditions.
 */
const formatFamilyHistoryResponse = (
    res: string[],
    state: any,
    negAnswer: any
): [string[], string[], string, string] => {
    const updatedRes = res.reduce(function (arr: string[], key) {
        if (
            key in state?.familyHistory &&
            state?.familyHistory?.[key]?.hasAfflictedFamilyMember ==
                YesNoResponse.Yes &&
            state?.familyHistory?.[key]?.condition?.length > 0
        )
            arr.push(state?.familyHistory?.[key]?.condition);
        return arr;
    }, []);
    const updatedNeg = res.reduce(function (arr: string[], key) {
        if (
            key in state.familyHistory &&
            state?.familyHistory?.[key]?.hasAfflictedFamilyMember ==
                YesNoResponse.No &&
            negAnswer &&
            state?.familyHistory?.[key]?.condition?.length > 0
        )
            arr.push(state.familyHistory[key].condition);
        return arr;
    }, []);
    const answer = joinLists(
        updatedRes?.length > 0 ? (updatedRes as string[]) : [],
        'and'
    );
    const negRes = joinLists(
        updatedNeg?.length > 0 ? (updatedNeg as string[]) : [],
        'or'
    );
    return [updatedRes, updatedNeg, answer, negRes];
};

const formatMedicationBlankResponse = (
    response: string[],
    lastSeparator,
    state: any
): string => {
    return joinLists(
        (response as string[]).reduce((acc: string[], key) => {
            if (
                key in state.medications &&
                state.medications[key].isCurrentlyTaking == YesNoResponse.Yes
            )
                return [...acc, state.medications[key].drugName];
            return acc;
        }, []) || [],
        lastSeparator
    );
};

/**
 * A Helper Function to format medication responses into
 * categorized arrays and strings based on conditions.
 */
const formatMedicationPopResponse = (medsRes: {
    [meds: string]: string;
}): [string[], string[], string, string] => {
    const updatedRes = Object.keys(medsRes).filter(
        (key) => medsRes[key] == YesNoResponse.Yes
    );
    const updatedNeg = Object.keys(medsRes).filter(
        (key) => medsRes[key] == YesNoResponse.No
    );
    const answer = joinLists(
        updatedRes.length > 0 ? (updatedRes as string[]) : [],
        'and'
    );
    const negRes = joinLists(
        updatedNeg.length > 0 ? (updatedNeg as string[]) : [],
        'or'
    );
    return [updatedRes, updatedNeg, answer, negRes];
};

/**
 * A Helper Function to format past surgical history responses into
 * categorized arrays and strings based on conditions.
 */
const formatPastSurgicalHistoryResponse = (
    response: string[],
    state: any
): [string, string] => {
    const posArr: string[] = [];
    const negArr: string[] = [];
    (response as string[]).map((key) => {
        if (key in state.surgicalHistory) {
            const { hasHadSurgery, procedure } = state.surgicalHistory[key];
            if (hasHadSurgery == YesNoResponse.Yes && procedure.length > 0)
                posArr.push(procedure);
            else if (hasHadSurgery == YesNoResponse.No && procedure.length > 0)
                negArr.push(procedure);
        }
    });
    const answer = joinLists(posArr, 'and');
    const negRes = joinLists(negArr, 'or');
    return [answer, negRes];
};
