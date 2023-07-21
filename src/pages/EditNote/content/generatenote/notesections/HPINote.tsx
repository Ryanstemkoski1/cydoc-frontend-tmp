import React from 'react';
import { connect } from 'react-redux';
import { createHPI, createInitialHPI, HPI } from '../generateHpiText';
import { CurrentNoteState } from 'redux/reducers';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import { HpiState } from 'redux/reducers/hpiReducer';
import {
    BodyLocationType,
    SelectOneInput,
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
import { selectSurgicalHistoryProcedures } from 'redux/selectors/surgicalHistorySelectors';
import { selectMedicalHistoryState } from 'redux/selectors/medicalHistorySelector';
import { selectPatientInformationState } from 'redux/selectors/patientInformationSelector';
import { SurgicalHistoryElements } from 'redux/reducers/surgicalHistoryReducer';
import { MedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';
import { PatientInformationState } from 'redux/reducers/patientInformationReducer';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';
import { capitalizeFirstLetter } from '../generateHpiText';
import './HPINote.css';

interface HPINotePropsFromRedux {
    hpi: HpiState;
    familyHistory: FamilyHistoryState;
    medications: MedicationsState;
    surgicalHistory: SurgicalHistoryElements;
    medicalHistory: MedicalHistoryState;
    patientInformation: PatientInformationState;
    chiefComplaints: ChiefComplaintsState;
}

type HPINoteProps = HPINotePropsFromRedux & { bulletNoteView?: boolean };

export type GraphNode = NodeInterface & { response: HpiResponseType };

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
    response: HpiResponseType;
};

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

        case ResponseTypes.SELECTMANY:
        case ResponseTypes.SHORT_TEXT:
        case ResponseTypes.RADIOLOGY:
            return node.response === '';

        case ResponseTypes.SELECTONE: {
            const response = node.response as SelectOneInput;
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
                            Object.entries(value)?.some(([_k, v]) => v)
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

        case ResponseTypes.SELECTMANY:
        case ResponseTypes.SELECTONE:
            const clickBoxesRes = response as SelectOneInput;
            updatedRes = Object.keys(clickBoxesRes).filter(
                (key) => clickBoxesRes[key]
            );
            updatedNeg = Object.keys(clickBoxesRes).filter(
                (key) => !clickBoxesRes[key] && negAnswer
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
                    state.familyHistory[key].hasAfflictedFamilyMember ==
                        YesNoResponse.Yes &&
                    state.familyHistory[key].condition.length > 0
                )
                    arr.push(state.familyHistory[key].condition);
                return arr;
            }, []);
            updatedNeg = res.reduce(function (arr: string[], key) {
                if (
                    state.familyHistory[key].hasAfflictedFamilyMember ==
                        YesNoResponse.No &&
                    negAnswer &&
                    state.familyHistory[key].condition.length > 0
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
                const { hasHadSurgery, procedure } = state.surgicalHistory[key];
                if (hasHadSurgery == YesNoResponse.Yes && procedure.length > 0)
                    posArr.push(procedure);
                else if (
                    hasHadSurgery == YesNoResponse.No &&
                    procedure.length > 0
                )
                    negArr.push(procedure);
            });
            answer = joinLists(posArr, 'and');
            negRes = joinLists(negArr, 'or');
    }
    return [node.blankTemplate, answer, negRes];
};

/*
    Checks if a given node has children nodes that should not be displayed 
    (i.e. in the case if the user clicks "NO" to a YES/NO question or "YES"
    to a NO/YES question)
*/
export const checkParent = (
    node: ReduxNodeInterface,
    state: HPINoteProps
): string[] => {
    const medId = node.medID;
    return (node.responseType == ResponseTypes.YES_NO &&
        node.response == YesNoResponse.No) ||
        (node.responseType == ResponseTypes.NO_YES &&
            node.response == YesNoResponse.Yes)
        ? state.hpi.graph[medId]
        : [];
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
 * Returns array of HPI question and answer fields sorted according to
 * question. Each list item represents a disjoint graph.
 *
 * Pre-condition: hpi.graph is already sorted according to edge order and
 * there are no cycles
 */
export const extractHpi = (state: HPINoteProps): { [key: string]: HPI } => {
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
// Function to remove specified phrases
function removePhrases(text: string, phrases: string[]): string {
    let modifiedText = text;
    phrases.sort((a, b) => b.length - a.length); // Sorting phrases by length, longest first
    phrases.forEach((phrase) => {
        modifiedText = modifiedText.replace(new RegExp(phrase, 'g'), ''); // Removing each phrase globally
    });
    return modifiedText.trim();
}
const HPINote = (state: HPINoteProps) => {
    const { bulletNoteView } = state;

    /*
    formattedHpis is a dictionary in which each key is the chief complaint
    and the value is an array of template sentences.
    
    The following will convert each CC's array of template sentences into a 
    paragraph, which is then re-split into an array and converted into a Set
    of sentences for de-duplication within the paragraph and comparison with 
    latter chief complaints.
    
    Specifically, each chief complaint set will be compared with later chief
    complaint sets to look for duplicate sentences (finding the complement of
    the second set). The first instances of duplicate sentences are kept, 
    while later ones are removed.
    */
    const formattedHpis = extractHpi(state);
    if (Object.keys(formattedHpis).length === 0) {
        return <div>No history of present illness reported.</div>;
    }
    const initialPara = Object.keys(formattedHpis).map((key) => {
        const formattedHpi = formattedHpis[key];
        // TODO: use actual patient info to populate fields
        return new Set(createInitialHPI(formattedHpi).split('. '));
    });
    for (let i = 0; i < initialPara.length - 1; i++) {
        for (let j = i + 1; j < initialPara.length; j++) {
            const setA = initialPara[i];
            const setB = initialPara[j];
            initialPara[j] = new Set([...setB].filter((x) => !setA.has(x)));
        }
    }
    const title = [];
    const finalPara = initialPara.reduce((acc: string[], hpiStringSet, i) => {
        if (hpiStringSet.size) {
            title.push(Object.keys(formattedHpis)[i]);
            return [
                ...acc,
                createHPI(
                    [...hpiStringSet].join('. '),
                    state.patientInformation.patientName,
                    state.patientInformation.pronouns
                ),
            ];
        }
        // don't include chief complaint if it was a subset of another CC
        // paragraph (i.e. set B is a subset of set A)
        return acc;
    }, []);

    const miscText = [];
    const actualNote = [];
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
        actualNote[i] = {
            chiefComplaint: title[i],
            text: finalPara[i],
            miscNote: miscText[i],
        };
    }

    // Add a list of phrases to remove when in bullet note view
    const phrasesToRemove = [
        'The patient has a',
        'The patient has been',
        'The patient has',
        'The patient is',
        'The patient',
        'He',
        'She',
        'They',
    ];

    return (
        <div>
            {actualNote.reduce((acc: JSX.Element[], text, i) => {
                if (text.chiefComplaint in state.chiefComplaints) {
                    // Process the text based on bulletNoteView flag
                    const processedText = bulletNoteView
                        ? removePhrases(text.text, phrasesToRemove)
                        : text.text;

                    // Return as bullet points if bulletNoteView is true, else return as paragraphs
                    return bulletNoteView
    ? [
          ...acc,
          <ul className="no-bullets" key={i}>
              {i === 0 ? (
                  <b>{capitalizeFirstLetter(text.chiefComplaint)}</b>
              ) : (
                  <li>
                      <b>{capitalizeFirstLetter(text.chiefComplaint)}</b>
                  </li>
              )}
              {
    processedText
        .split('. ')
        .map(
            (sentence, index) =>
                sentence && (
                    <li key={index}>
                        {capitalizeFirstLetter(sentence.trim())}{sentence.trim().endsWith('.') ? '' : '.'}
                    </li>
                )
        )
}
{   
    text.miscNote &&
        text.miscNote
            .split('. ')
            .map(
                (sentence, index) =>
                    sentence && (
                        <li key={index}>
                            {capitalizeFirstLetter(sentence.trim())}{sentence.trim().endsWith('.') ? '' : '.'}
                        </li>
                    )
            )
                    }
          </ul>,
      ]
    : [
          ...acc,
          <p key={i}>
              {i === 0 ? (
                  <b>{capitalizeFirstLetter(text.chiefComplaint)}</b>
              ) : (
                  <li>
                      <b>{capitalizeFirstLetter(text.chiefComplaint)}</b>
                  </li>
              )}
              <br />
              {capitalizeFirstLetter(processedText)}
              {text.miscNote ? (
                  <>
                      {' '}
                      <br />
                      <br />
                      {capitalizeFirstLetter(text.miscNote)}
                  </>
              ) : (
                  ''
              )}
          </p>,
      ];
                }
                return acc;
            }, [])}
        </div>
    );
};
const mapStateToProps = (state: CurrentNoteState) => ({
    hpi: selectHpiState(state),
    familyHistory: selectFamilyHistoryState(state),
    medications: selectMedicationsState(state),
    surgicalHistory: selectSurgicalHistoryProcedures(state),
    medicalHistory: selectMedicalHistoryState(state),
    patientInformation: selectPatientInformationState(state),
    chiefComplaints: selectChiefComplaintsState(state),
});
export default connect(mapStateToProps)(HPINote);
