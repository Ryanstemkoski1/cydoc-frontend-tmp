import { HpiState } from '@redux/reducers/hpiReducer';
import { FamilyHistoryState } from '@redux/reducers/familyHistoryReducer';
import { MedicationsState } from '@redux/reducers/medicationsReducer';
import { SurgicalHistoryElements } from '@redux/reducers/surgicalHistoryReducer';
import { MedicalHistoryState } from '@redux/reducers/medicalHistoryReducer';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';
import { ChiefComplaintsState } from '@redux/reducers/chiefComplaintsReducer';
import {
    NodeInterface,
    NodeResponseType,
    ResponseTypes,
    ListTextInput,
    BodyLocationType,
    TimeInput,
    LabTestType,
    SelectOneInput,
    SelectManyInput,
} from '@constants/hpiEnums';
import { HPI } from '../processing/fillHPIAnswers'; // TODO: fixing
import { extractNode } from './extractNodeDetails';
import { YesNoResponse } from '@constants/enums';
import { isHPIResponseValid } from '@utils/getHPIFormData';

/**
 * Defines the properties for HPI (History of Present Illness) note state.
 *
 * Includes states for:
 * - `hpi`: HPI details.
 * - `familyHistory`: Family medical history.
 * - `medications`: Current medications.
 * - `surgicalHistory`: Past surgeries.
 * - `medicalHistory`: General medical history.
 * - `patientInformation`: Basic patient info.
 * - `chiefComplaints`: Main complaints from the patient.
 */
export interface WholeNoteProps {
    hpi: HpiState;
    familyHistory: FamilyHistoryState;
    medications: MedicationsState;
    surgicalHistory: SurgicalHistoryElements;
    medicalHistory: MedicalHistoryState;
    patientInformation: PatientInformationState;
    chiefComplaints: ChiefComplaintsState;
}

/* Defines the structure of a Redux node, utilized in getNodeConditions
 * and checkParent functions.
 */
export type ReduxNodeInterface = {
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
    response: NodeResponseType;
};

/* Represents a node in the graph with associated HPI response data. */
export type GraphNode = NodeInterface & { response: NodeResponseType };

/**
 * Returns array of HPI question and answer fields sorted according to
 * question. Each list item represents a disjoint graph.
 *
 * Pre-condition: hpi.graph is already sorted according to edge order and
 * there are no cycles
 */
export const extractHpiArray = (
    state: WholeNoteProps
): { [key: string]: HPI } => {
    const formattedHpis: { [key: string]: HPI } = {};
    if (Object.keys(state.hpi.order).length) {
        for (const nodeId of Object.keys(state.hpi.order)) {
            const allResponses = extractNodes(nodeId, state);
            const chiefComplaint =
                nodeId in state.hpi.nodes
                    ? state.hpi.nodes[nodeId].doctorView
                    : undefined;
            if (!chiefComplaint || !(chiefComplaint in state.chiefComplaints))
                continue;
            const val = allResponses.reduce((prev, val, idx) => {
                prev[idx] = val;
                return prev;
            }, {} as HPI);
            if (Object.keys(val).length) formattedHpis[chiefComplaint] = val;
        }
    }
    return formattedHpis;
};

/**
 * Extracts and formats all nodes connected to the source according to
 * questionOrder
 */
export const extractNodes = (
    source: string,
    state: WholeNoteProps
): [string, string, string][] => {
    const formattedHpi: [string, string, string][] = [],
        order = state.hpi.order[source];
    let hideChildren: string[] = [];
    for (let i = 1; i < Object.keys(order).length + 1; i++) {
        const node = state.hpi.nodes[order[i.toString()]];
        hideChildren = [...hideChildren, ...checkParent(node, state)];
        if (!isEmpty(state, node) && !hideChildren.includes(node.medID)) {
            formattedHpi.push(extractNode(state, node));
        }
    }
    return formattedHpi;
};

/**
 * Extracts conditional logic from a node's text.
 * e.g.
 * "This node should be shown ONLYIF[condition1, condition2] if applicable."
 * return ['condition1', 'condition2']
 */
export function getNodeConditions(node: ReduxNodeInterface) {
    const matches = node.text.match(/ONLYIF\[.*]\s/); // get "ONLYIF[**] " part from text;

    if (!matches) return [];

    const conditions = matches[0]
        ?.match(/\[.*\]\s/)?.[0] // get "[**] " part from text
        ?.replace(/(\[)|(\])/g, '') // replace "[" or "]" with ""
        ?.split(',')
        ?.map((sentence: string) => sentence.trim()) as string[];

    return conditions;
}

/*
    Checks if a given node has children nodes that should not be displayed
    (i.e. in the case if the user clicks "NO" to a YES/NO question, "YES"
    to a NO/YES question or there is NO selected option for SELECTONE and SELECTMANY question)
*/
export const checkParent = (
    node: ReduxNodeInterface,
    state: WholeNoteProps
): string[] => {
    const medId = node.medID;
    const { response, responseType } = node;
    const childNodes = state.hpi.graph[medId];
    let childNodesToHide: string[] = [];

    switch (responseType) {
        case ResponseTypes.YES_NO: {
            childNodesToHide = response == YesNoResponse.No ? childNodes : [];
            break;
        }
        case ResponseTypes.NO_YES: {
            childNodesToHide = response == YesNoResponse.Yes ? childNodes : [];
            break;
        }
        case ResponseTypes.SELECTMANYDENSE:
        case ResponseTypes.SELECTMANY:
        case ResponseTypes.PRONOUN:
        case ResponseTypes.SELECTONE: {
            if (!isHPIResponseValid(response, responseType)) {
                childNodesToHide = childNodes;
                break;
            }

            const nodeResponse = response as SelectManyInput | SelectOneInput;
            const validNodeResponse = Object.keys(nodeResponse).filter(
                (key) => nodeResponse[key]
            );

            for (const childNodeId of childNodes) {
                const conditions = getNodeConditions(
                    state.hpi.nodes[childNodeId]
                );
                if (
                    conditions.some((item) => {
                        !validNodeResponse.includes(item);
                    })
                ) {
                    childNodesToHide.push(childNodeId);
                }
            }

            break;
        }
        default: {
            childNodesToHide = [];
            break;
        }
    }

    return childNodesToHide;
};

/* Returns whether the user has responded to this node or not */
export const isEmpty = (state: WholeNoteProps, node: GraphNode): boolean => {
    switch (node.responseType) {
        case ResponseTypes.YES_NO:
        case ResponseTypes.NO_YES:
            return node?.response === YesNoResponse.None;

        case ResponseTypes.YEAR:
        case ResponseTypes.SCALE1TO10:
        case ResponseTypes.NUMBER:
        case ResponseTypes.AGEATEVENT:
            return node?.response === undefined;

        case ResponseTypes.LIST_TEXT: {
            return Object?.entries(node?.response as ListTextInput).every(
                ([, value]) => value === ''
            );
        }

        case ResponseTypes.BODYLOCATION:
            return Object?.entries(node.response as BodyLocationType).every(
                ([, value]) => {
                    if (typeof value === 'boolean') return !value;
                    else return Object?.entries(value).every(([, v]) => !v);
                }
            );

        case ResponseTypes.TIME3DAYS: {
            const timeRes = node?.response as TimeInput;
            return (
                timeRes?.numInput === undefined && timeRes?.timeOption === ''
            );
        }
        case ResponseTypes.LABORATORY_TEST:
        case ResponseTypes.CBC:
        case ResponseTypes.BMP:
        case ResponseTypes.LFT: {
            const response = node?.response as LabTestType;
            for (const comp in response?.components) {
                if (response?.components?.[comp]?.value) return false;
            }
            return true;
        }

        case ResponseTypes.SELECTMANY:
        case ResponseTypes.DATE:
        case ResponseTypes.SHORT_TEXT:
        case ResponseTypes.RADIOLOGY:
            return node.response === '';

        case ResponseTypes.SELECTMANYDENSE:
        case ResponseTypes.PRONOUN:
        case ResponseTypes.SELECTONE: {
            const response = node?.response as SelectOneInput;
            return Object?.keys(response).every((key) => !response[key]);
        }

        case ResponseTypes.MEDS_POP: {
            const response = node?.response as { [med: string]: string };
            return Object?.keys(response).every(
                (key) => response[key] == YesNoResponse.None
            );
        }

        case ResponseTypes.FH_POP: {
            const response = (node?.response as []) || [];
            return response?.every(
                (condition) =>
                    state?.familyHistory?.[condition]
                        ?.hasAfflictedFamilyMember == ''
            );
        }

        case ResponseTypes.PMH_POP: {
            const response = (node?.response as []) || [];
            return response?.every(
                (condition) =>
                    state?.medicalHistory?.[condition]?.hasBeenAfflicted == ''
            );
        }

        case ResponseTypes.PSH_POP: {
            const response = (node?.response as []) || [];
            return response?.every(
                (surgery) =>
                    state?.surgicalHistory?.[surgery]?.hasHadSurgery == ''
            );
        }

        default:
            return (node?.response as string[])?.length === 0;
    }
};
