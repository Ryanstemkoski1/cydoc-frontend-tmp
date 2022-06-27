import React from 'react';
import { connect } from 'react-redux';
import { createHPI, createInitialHPI, HPI } from '../generateHpiText';
import { CurrentNoteState } from 'redux/reducers';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import { HpiState } from 'redux/reducers/hpiReducer';
import {
    BodyLocationType,
    ClickBoxesInput,
    HpiResponseType,
    LabTestType,
    ListTextInput,
    NodeInterface,
    TimeInput,
} from 'constants/hpiEnums';
import { YesNoResponse } from 'constants/enums';
import { ResponseTypes } from 'constants/hpiEnums';
import { selectFamilyHistoryState } from 'redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from 'redux/selectors/medicationsSelectors';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
import { MedicationsState } from 'redux/reducers/medicationsReducer';
import { selectSurgicalHistoryState } from 'redux/selectors/surgicalHistorySelectors';
import { selectMedicalHistoryState } from 'redux/selectors/medicalHistorySelector';
import { SurgicalHistoryState } from 'redux/reducers/surgicalHistoryReducer';
import { MedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';

interface HPINoteProps {
    hpi: HpiState;
    familyHistory: FamilyHistoryState;
    medications: MedicationsState;
    surgicalHistory: SurgicalHistoryState;
    medicalHistory: MedicalHistoryState;
}

export type GraphNode = NodeInterface & { response: HpiResponseType };

/* Returns whether the user has responded to this node or not */
export const isEmpty = (state: HPINoteProps, node: GraphNode): boolean => {
    switch (node.responseType) {
        case ResponseTypes.YES_NO:
        case ResponseTypes.NO_YES:
            return node.response === YesNoResponse.None;

        case ResponseTypes.SCALE1TO10:
        case ResponseTypes.NUMBER:
            return node.response === undefined;

        case ResponseTypes.LIST_TEXT: {
            return Object.entries(node.response as ListTextInput).every(
                ([_key, value]) => value === ''
            );
        }

        case ResponseTypes.BODYLOCATION:
            return Object.entries(node.response as BodyLocationType).every(
                ([_key, value]) => {
                    if (typeof value === 'boolean') return !value;
                    else return Object.entries(value).every(([_k, v]) => !v);
                }
            );

        case ResponseTypes.TIME3DAYS: {
            const timeRes = node.response as TimeInput;
            return timeRes.numInput === undefined && timeRes.timeOption === '';
        }
        case ResponseTypes.LABORATORY_TEST:
        case ResponseTypes.CBC:
        case ResponseTypes.BMP:
        case ResponseTypes.LFT: {
            const response = node.response as LabTestType;
            for (const comp in response.components) {
                if (response.components[comp].value) return false;
            }
            return true;
        }

        case ResponseTypes.SHORT_TEXT:
        case ResponseTypes.RADIOLOGY:
            return node.response === '';

        case ResponseTypes.CLICK_BOXES: {
            const response = node.response as ClickBoxesInput;
            return Object.keys(response).every((key) => !response[key]);
        }

        case ResponseTypes.MEDS_POP: {
            const response = node.response as { [med: string]: string };
            return Object.keys(response).every(
                (key) => response[key] == YesNoResponse.None
            );
        }

        case ResponseTypes.FH_POP: {
            const response = node.response as [];
            return response.every(
                (condition) =>
                    state.familyHistory[condition].hasAfflictedFamilyMember ==
                    ''
            );
        }

        case ResponseTypes.PMH_POP: {
            const response = node.response as [];
            return response.every(
                (condition) =>
                    state.medicalHistory[condition].hasBeenAfflicted == ''
            );
        }

        case ResponseTypes.PSH_POP: {
            const response = node.response as [];
            return response.every(
                (surgery) => state.surgicalHistory[surgery].hasHadSurgery == ''
            );
        }

        default:
            return (node.response as string[]).length === 0;
    }
};

/**
 * Joins list of strings following English grammar
 * e.g. A, B, and C
 *      A and B
 *      A
 */
export const joinLists = (items: string[], lastSeparator = 'and'): string => {
    if (items.length > 1) {
        const lastItem = items.pop();
        items.push(`${lastSeparator} ${lastItem}`);
    }
    const separator = items.length > 2 ? ', ' : ' ';
    return items.join(separator);
};

/**
 * Extracts question and answer from the node, formatted for the HPI
 * Pre-condition: node has non-empty response according to its type
 */
export const extractNode = (
    state: HPINoteProps,
    node: GraphNode
): [string, string, string] => {
    /* eslint-disable no-case-declarations, no-fallthrough */
    if (
        node.responseType === ResponseTypes.NO_YES ||
        node.responseType === ResponseTypes.YES_NO
    ) {
        return node.response === YesNoResponse.Yes
            ? [node.blankYes, '', '']
            : [node.blankNo, '', ''];
    }

    // all other types utilize blankTemplate and the second string
    const { response } = node;
    const negAnswer = node.blankTemplate.includes('NOTANSWER');
    const lastSeparator = negAnswer ? 'or' : 'and';
    let answer = '',
        negRes = '',
        res,
        updatedRes,
        updatedNeg;
    switch (node.responseType) {
        case ResponseTypes.NUMBER:
        case ResponseTypes.SCALE1TO10:
            answer = (response as number).toString();
            break;

        case ResponseTypes.TIME3DAYS:
            const timeRes = response as TimeInput;
            answer = [timeRes.numInput, timeRes.timeOption].join(' ');
            break;

        case ResponseTypes.SHORT_TEXT:
        case ResponseTypes.RADIOLOGY:
            answer = response as string;
            break;

        case ResponseTypes.BODYLOCATION:
            answer = joinLists(
                Object.entries(response as BodyLocationType).reduce(
                    (acc: string[], [key, value]) => {
                        if (
                            (typeof value === 'boolean' && value) ||
                            Object.entries(value).some(([_k, v]) => v)
                        )
                            acc.push(key);
                        return acc;
                    },
                    []
                ),
                lastSeparator
            );
            break;

        case ResponseTypes.LABORATORY_TEST:
        case ResponseTypes.CBC:
        case ResponseTypes.BMP:
        case ResponseTypes.LFT:
            const labRes = response as LabTestType;
            for (const comp in labRes.components) {
                if (labRes.components[comp].value)
                    return [
                        `The patient's ${labRes.name} showed ${comp} ${labRes.components[comp].value} ${labRes.components[comp].unit}`,
                        '',
                        '',
                    ];
            }
            break;

        // let it be handled like other string arrays
        case ResponseTypes.LIST_TEXT:
            answer = joinLists(
                Object.values(response as ListTextInput),
                lastSeparator
            );
            break;

        case ResponseTypes.CLICK_BOXES:
            const clickBoxesRes = response as ClickBoxesInput;
            updatedRes = Object.keys(clickBoxesRes).reduce(function (
                arr: string[],
                key
            ) {
                if (clickBoxesRes[key]) arr.push(key);
                return arr;
            },
            []);
            updatedNeg = Object.keys(clickBoxesRes).reduce(function (
                arr: string[],
                key
            ) {
                if (!clickBoxesRes[key] && negAnswer) arr.push(key);
                return arr;
            },
            []);
            answer = joinLists(
                updatedRes.length > 0 ? (updatedRes as string[]) : [],
                'and'
            );
            negRes = joinLists(
                updatedNeg.length > 0 ? (updatedNeg as string[]) : [],
                'or'
            );
            break;

        case ResponseTypes.FH_POP:
        case ResponseTypes.FH_BLANK:
            res = response as string[];
            updatedRes = res.reduce(function (arr: string[], key) {
                if (
                    state.familyHistory[key].hasAfflictedFamilyMember ==
                    YesNoResponse.Yes
                )
                    arr.push(state.familyHistory[key].condition);
                return arr;
            }, []);
            updatedNeg = res.reduce(function (arr: string[], key) {
                if (
                    state.familyHistory[key].hasAfflictedFamilyMember ==
                        YesNoResponse.No &&
                    negAnswer
                )
                    arr.push(state.familyHistory[key].condition);
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

        case ResponseTypes.MEDS_BLANK:
            answer = joinLists(
                Object.keys(response as ClickBoxesInput),
                lastSeparator
            );
            break;

        case ResponseTypes.MEDS_POP:
            const medsRes = response as { [meds: string]: string };
            updatedRes = Object.keys(medsRes).reduce(function (
                arr: string[],
                key
            ) {
                if (medsRes[key] == YesNoResponse.Yes) arr.push(key);
                return arr;
            },
            []);
            updatedNeg = Object.keys(medsRes).reduce(function (
                arr: string[],
                key
            ) {
                if (medsRes[key] == YesNoResponse.No) arr.push(key);
                return arr;
            },
            []);
            answer = joinLists(
                updatedRes.length > 0 ? (updatedRes as string[]) : [],
                'and'
            );
            negRes = joinLists(
                updatedNeg.length > 0 ? (updatedNeg as string[]) : [],
                'or'
            );
            break;

        case ResponseTypes.PMH_POP:
        case ResponseTypes.PMH_BLANK:
            res = response as string[];
            updatedRes = res.reduce(function (arr: string[], key) {
                if (
                    state.medicalHistory[key].hasBeenAfflicted ==
                    YesNoResponse.Yes
                )
                    arr.push(state.medicalHistory[key].condition);
                return arr;
            }, []);
            updatedNeg = res.reduce(function (arr: string[], key) {
                if (
                    state.medicalHistory[key].hasBeenAfflicted ==
                        YesNoResponse.No &&
                    negAnswer
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
            const posArr: string[] = [];
            const negArr: string[] = [];
            (response as string[]).map((key) => {
                const { hasHadSurgery, procedure } = state.surgicalHistory[key];
                if (hasHadSurgery == YesNoResponse.Yes) posArr.push(procedure);
                else if (hasHadSurgery == YesNoResponse.No)
                    negArr.push(procedure);
            });
            answer = joinLists(posArr, 'and');
            negRes = joinLists(negArr, 'or');
    }
    return [node.blankTemplate, answer, negRes];
};

/**
 * Extracts and formats all nodes connected to the source according to
 * questionOrder
 */
export const extractNodes = (
    source: string,
    state: HPINoteProps
): [string, string, string][] => {
    const formattedHpi: [string, string, string][] = [],
        order = state.hpi.order[source];
    for (let i = 1; i < Object.keys(order).length; i++) {
        const node = state.hpi.nodes[order[i.toString()]];
        if (!isEmpty(state, node)) formattedHpi.push(extractNode(state, node));
    }
    return formattedHpi;
};

/**
 * Returns array of HPI question and answer fields sorted according to
 * question. Each list item represents a disjoint graph.
 *
 * Pre-condition: hpi.graph is already sorted according to edge order and
 * there are no cycles
 */
export const extractHpi = (state: HPINoteProps): HPI[] => {
    const formattedHpis: HPI[] = [];
    for (const nodeId of Object.keys(state.hpi.order)) {
        const allResponses = extractNodes(nodeId, state);
        formattedHpis.push(
            allResponses.reduce((prev, val, idx) => {
                prev[idx] = val;
                return prev;
            }, {} as HPI)
        );
    }
    return formattedHpis;
};

const HPINote = (state: HPINoteProps) => {
    /*
    HPI note is generated into sentences, each element of the array
    a paragraph for each chief complaint. The elements of the array 
    are combined into one big string (across all chief complaints). 
    If there are duplicates, all occurrences after the first instance 
    are removed. The strings are then re-separated into an array of 
    strings separated by chief complaint.
    */
    const formattedHpis = extractHpi(state);
    if (formattedHpis.length === 0) {
        return <div>No history of present illness reported.</div>;
    }
    const initialPara = formattedHpis.map((formattedHpi) =>
        // TODO: use actual patient info to populate fields
        createInitialHPI(formattedHpi)
    );
    const paragraphs = [
        ...new Set(initialPara.join('PARAGRAPH_BREAK. ').split('. ')),
    ]
        .join('. ')
        .split('PARAGRAPH_BREAK. ');
    const finalPara = paragraphs.map((hpiString) =>
        createHPI(hpiString, '', 'They', '')
    );
    return (
        <div>
            {finalPara.map((text, i) => (
                <p key={i}>{text}</p>
            ))}
        </div>
    );
};

const mapStateToProps = (state: CurrentNoteState) => ({
    hpi: selectHpiState(state),
    familyHistory: selectFamilyHistoryState(state),
    medications: selectMedicationsState(state),
    surgicalHistory: selectSurgicalHistoryState(state),
    medicalHistory: selectMedicalHistoryState(state),
});
export default connect(mapStateToProps)(HPINote);
