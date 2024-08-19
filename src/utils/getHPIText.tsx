import { YesNoResponse } from '@constants/enums';
import {
    BodyLocationType,
    NodeResponseType,
    LabTestType,
    ListTextInput,
    NodeInterface,
    ResponseTypes,
    SelectManyInput,
    SelectOneInput,
    TimeInput,
} from '@constants/hpiEnums';
import { doAllHPIWordReplacements } from './textGeneration/processing/handleHPIWordReplacements';
import { ChiefComplaintsState } from '@redux/reducers/chiefComplaintsReducer';
import { FamilyHistoryState } from '@redux/reducers/familyHistoryReducer';
import { HpiState } from '@redux/reducers/hpiReducer';
import { MedicalHistoryState } from '@redux/reducers/medicalHistoryReducer';
import { MedicationsState } from '@redux/reducers/medicationsReducer';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';
import { SurgicalHistoryElements } from '@redux/reducers/surgicalHistoryReducer';
import { UserSurveyState } from '@redux/reducers/userViewReducer';
import { isHPIResponseValid } from './getHPIFormData';
import { splitByPeriod } from './textGeneration/common/textUtils';
import { HPI, fillAnswers } from './textGeneration/processing/fillHPIAnswers';
import {
    WholeNoteProps,
    GraphNode,
    extractHpiArray,
} from './textGeneration/extraction/extractHpi';
/**
 * @module getHpiArrayWithNoDups
 *
 * This module provides utilities for processing and formatting responses
 * from an input questionnaire. It includes functions to check if responses
 * are empty, join lists of strings, extract and format data from nodes,
 * handle conditional logic for displaying child nodes, and generate
 * formatted HPI text.
 *
 * Key Functions:
 * 1. Node Processing:
 * - `isEmpty(state: WholeNoteProps, node: GraphNode): boolean`:
 *    Determines if a node's response is empty based on its type.
 * - `joinLists(items: string[], lastSeparator = 'and'): string`:
 *    Joins a list of strings into a grammatically correct sentence.
 * - `extractNode(state: WholeNoteProps, node: GraphNode): [string, string, string]`:
 *    Formats a node's response for output.
 * - `getNodeConditions(node: ReduxNodeInterface): string[]`:
 *    Extracts conditional logic from a node's text.
 * - `checkParent(node: ReduxNodeInterface, state: WholeNoteProps): string[]`:
 *    Determines which child nodes should be hidden based on the parent node's
 *    response.
 * - `extractNodes(source: string, state: WholeNoteProps): [string, string, string][]`:
 *    Extracts and formats all nodes connected to a source node according to
 *    a specific order.
 *
 * 2. HPI Text Generation:
 * - `getHpiArrayWithNoDups(state: WholeNoteReduxValues, isAdvancedReport: boolean): string`:
 *   Generates formatted HPI text based on the input state and report type,
 *   incorporating responses, conditional logic, and formatting rules.
 */

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
    switch (node.responseType) {
        case ResponseTypes.YEAR:
        case ResponseTypes.NUMBER:
        case ResponseTypes.AGEATEVENT:
        case ResponseTypes.SCALE1TO10:
            answer = (response as number).toString();
            break;

        case ResponseTypes.TIME3DAYS:
            const timeRes = response as TimeInput;
            answer = [timeRes?.numInput, timeRes?.timeOption].join(' ');
            break;

        case ResponseTypes.DATE:
        case ResponseTypes.SHORT_TEXT:
        case ResponseTypes.RADIOLOGY:
            answer = response as string;
            break;

        case ResponseTypes.BODYLOCATION:
            answer = joinLists(
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
                Object.values(response as ListTextInput).filter(
                    (val: string) => val.length > 0
                ),
                lastSeparator
            );
            break;

        case ResponseTypes.PSYCHDXPICKER:
            const filteredResponse = (response as string[]).filter(
                (item) => item.trim() !== ''
            );
            if (filteredResponse.length === 0) {
                answer = '';
            } else if (filteredResponse.length === 1) {
                answer = filteredResponse[0];
            } else if (filteredResponse.length === 2) {
                answer = filteredResponse.join(' and ');
            } else {
                const allButLast = filteredResponse.slice(0, -1).join(', ');
                const last = filteredResponse[filteredResponse.length - 1];
                answer = `${allButLast}, and ${last}`;
            }
            break;

        case ResponseTypes.SELECTMANYDENSE:
        case ResponseTypes.SELECTMANY:
        case ResponseTypes.PRONOUN:
        case ResponseTypes.SELECTONE:
            const clickBoxesRes = response as SelectOneInput;
            updatedRes = Object.keys(clickBoxesRes).filter(
                (key) => clickBoxesRes[key] && key.toLowerCase() !== 'other'
            );
            updatedNeg = Object.keys(clickBoxesRes).filter(
                (key) =>
                    !clickBoxesRes[key] &&
                    negAnswer &&
                    key.toLowerCase() !== 'other'
            );

            // If zero YESs are selected but any NOs are selected --> all selections are NO
            const allNo = updatedRes.length === 0 && updatedNeg.length > 0;

            answer = joinLists(
                updatedRes.length > 0 ? (updatedRes as string[]) : [],
                'and'
            );
            negRes = joinLists(
                updatedNeg.length > 0 ? (updatedNeg as string[]) : [],
                'or'
            );

            // All no --> custom answer selection to indicate that all selections were no
            if (allNo) {
                answer = 'all no';
            }

            break;

        case ResponseTypes.FH_POP:
        case ResponseTypes.FH_BLANK:
            res = response as string[];
            updatedRes = res.reduce(function (arr: string[], key) {
                if (
                    key in state?.familyHistory &&
                    state?.familyHistory?.[key]?.hasAfflictedFamilyMember ==
                        YesNoResponse.Yes &&
                    state?.familyHistory?.[key]?.condition?.length > 0
                )
                    arr.push(state?.familyHistory?.[key]?.condition);
                return arr;
            }, []);
            updatedNeg = res.reduce(function (arr: string[], key) {
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
            answer = joinLists(
                updatedRes?.length > 0 ? (updatedRes as string[]) : [],
                'and'
            );
            negRes = joinLists(
                updatedNeg?.length > 0 ? (updatedNeg as string[]) : [],
                'or'
            );
            break;

        case ResponseTypes.MEDS_BLANK:
            answer = joinLists(
                (response as string[]).reduce((acc: string[], key) => {
                    if (
                        key in state.medications &&
                        state.medications[key].isCurrentlyTaking ==
                            YesNoResponse.Yes
                    )
                        return [...acc, state.medications[key].drugName];
                    return acc;
                }, []) || [],
                lastSeparator
            );
            break;

        case ResponseTypes.MEDS_POP:
            const medsRes = response as { [meds: string]: string };
            updatedRes = Object.keys(medsRes).filter(
                (key) => medsRes[key] == YesNoResponse.Yes
            );
            updatedNeg = Object.keys(medsRes).filter(
                (key) => medsRes[key] == YesNoResponse.No
            );
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
            const posArr: string[] = [];
            const negArr: string[] = [];
            (response as string[]).map((key) => {
                if (key in state.surgicalHistory) {
                    const { hasHadSurgery, procedure } =
                        state.surgicalHistory[key];
                    if (
                        hasHadSurgery == YesNoResponse.Yes &&
                        procedure.length > 0
                    )
                        posArr.push(procedure);
                    else if (
                        hasHadSurgery == YesNoResponse.No &&
                        procedure.length > 0
                    )
                        negArr.push(procedure);
                }
            });
            answer = joinLists(posArr, 'and');
            negRes = joinLists(negArr, 'or');
    }
    return [node.blankTemplate, answer, negRes];
};

/**
 * Represents generated text details.
 *
 * The `HPIText` interface includes:
 * - `title`: The HPI text's title.
 * - `text`: Main content of the HPI.
 * - `miscNote`: Additional notes.
 *
 * e.g.
 * const example: HPIText = {
 *     title: 'Consultation Summary',
 *     text: 'Patient shows symptoms of fatigue and dizziness.',
 *     miscNote: 'Patient reports recent weight loss.'
 * };
 *
 * Used in displaying generated notes. e.g HPINote
 */
export interface HPIText {
    title: string;
    text: string;
    miscNote: string;
}

/* Formats a response object into a single, reversed, quoted string. */
export function getListTextResponseAsSingleString(response = {}): string {
    return Object.values(response)
        .map((item) => (item as string).trim().replace(/[.]\s/, 'g'))
        .filter((item: string) => item)
        .reverse()
        .reduce(
            (accumulator, currentValue) =>
                '"' + currentValue + '"' + '. ' + accumulator,
            ''
        );
}

/*
 * Generates an array of HPIText objects from the UserSurveyState, formatting
 * responses based on their type and excluding a specific node.
 * Used with the `getHpiArrayWithNoDups` function.
 */
function getInitialSurveyResponses(state: UserSurveyState): HPIText[] {
    const responses: HPIText[] = [];

    Object.entries(state.nodes).forEach(([nodeId, value]) => {
        // skipping clinician last name field
        if (nodeId === '9') return;

        if (!value?.response) return;

        let currentNodeResponse = '';

        switch (value.responseType) {
            case ResponseTypes.LIST_TEXT: {
                currentNodeResponse = getListTextResponseAsSingleString(
                    value.response
                );
                break;
            }
            case ResponseTypes.LONG_TEXT:
            case ResponseTypes.DATE:
            case ResponseTypes.YEAR:
            case ResponseTypes.SHORT_TEXT: {
                currentNodeResponse = (value.response as string).trim();
                break;
            }
            default: {
            }
        }

        if (currentNodeResponse) {
            responses.push({
                title:
                    value.responseType === ResponseTypes.LIST_TEXT
                        ? 'Patient describes their concerns as'
                        : value.text,
                text: currentNodeResponse,
                miscNote: '',
            });
        }
    });

    return responses;
}

/**
 * Represents the Redux state for HPI-related data.
 *
 * Includes states for HPI, family history, medications, surgical history,
 * medical history, patient information, chief complaints, and user survey.
 *
 * Used with the `getHpiArrayWithNoDups` function.
 */
export interface WholeNoteReduxValues {
    hpi: HpiState;
    familyHistory: FamilyHistoryState;
    medications: MedicationsState;
    surgicalHistory: SurgicalHistoryElements;
    medicalHistory: MedicalHistoryState;
    patientInformation: PatientInformationState;
    chiefComplaints: ChiefComplaintsState;
    userSurvey: UserSurveyState;
}

/**
 * Generates text from Redux state, handling
 * various response types and removing duplicate answer sentences.
 *
 * - Retrieves and formats chief complaints and survey responses.
 * - Removes duplicate sentences across paragraphs.
 * - Adds miscellaneous notes from the state.
 *
 * @param state related data
 * @returns Array of HPIText objects, including titles, text, and miscellaneous notes.
 */
function getHpiArrayWithNoDups(state: WholeNoteReduxValues) {
    /*
    Return an array of HPIText objects from which duplicate sentences have 
    been removed.

    Convert each chief complaint's array of template sentences into a
    paragraph, which is then re-split into an array and converted into a Set
    of sentences for de-duplication within the paragraph and comparison with
    later chief complaints.

    Specifically, each chief complaint set will be compared with later chief
    complaint sets to look for duplicate sentences (finding the complement of
    the second set). The first instances of duplicate sentences are kept,
    while later ones are removed.
    */

    const initialSurveyResponse = getInitialSurveyResponses(state.userSurvey);

    const hpiTextResult: HPIText[] = [];

    // formattedHpis is a dictionary in which each key is the chief complaint
    // and the value is an array of template sentences.
    const formattedHpis = extractHpiArray(state);

    if (!Object.keys(formattedHpis).length) {
        if (!initialSurveyResponse.length) {
            return 'No history of present illness reported.';
        }

        return initialSurveyResponse;
    }

    const initialPara = Object.keys(formattedHpis).map((key) => {
        const formattedHpi = formattedHpis[key];
        // Populate actual response fields in the text, then split into a set of sentences.
        // // Split by '. ' without retain the period with each sentence
        return new Set(
            splitByPeriod(fillAnswers(formattedHpi), true).filter(Boolean) // Remove any empty strings resulting from the split
        );
    });

    // Remove duplicate sentences by comparing each set of sentences with subsequent sets. This retains unique sentences in each set and excludes duplicates found in later sets.
    // e.g: before: setA ['Patient feels tired.', ' Patient has a cough '], setB ['Patient has a fever.', 'Patient has a cough']
    //      after:  setA ['Patient feels tired.', ' Patient has a cough '], setB ['Patient has a fever.']
    for (let i = 0; i < initialPara.length - 1; i++) {
        for (let j = i + 1; j < initialPara.length; j++) {
            const setA = initialPara[i];
            const setB = initialPara[j];
            initialPara[j] = new Set([...setB].filter((x) => !setA.has(x)));
        }
    }

    const title: string[] = [];
    const finalPara = initialPara.reduce((acc: string[], hpiStringSet, i) => {
        if (hpiStringSet.size) {
            title.push(Object.keys(formattedHpis)[i]);
            return [
                ...acc,
                doAllHPIWordReplacements(
                    Array.from(hpiStringSet).join(' '),
                    state.patientInformation.patientName,
                    state.patientInformation.pronouns
                ),
            ];
        }
        // don't include chief complaint if it was a subset of another CC paragraph (i.e. set B is a subset of set A)
        return acc;
    }, []);

    const miscText: string[] = [];
    /**
     * Utilizes the miscNotes' information from redux state and
     * pushes it into title and miscText array
     */
    for (const key in state.hpi.miscNotes) {
        title.push(key);
        miscText.push(state.hpi.miscNotes[key]);
    }
    //Creates actual note array with objects that contains title, text, miscText
    for (let i = 0; i < finalPara.length; i++) {
        hpiTextResult[i] = {
            title: title[i],
            text: finalPara[i],
            miscNote: miscText[i],
        };
    }
    return [...hpiTextResult, ...initialSurveyResponse];
}

export default getHpiArrayWithNoDups;
