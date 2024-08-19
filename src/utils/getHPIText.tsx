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
