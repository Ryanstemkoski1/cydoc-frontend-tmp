import { vi, describe, it, expect } from 'vitest';
import { WholeNoteProps } from '../textGeneration/extraction/extractHpi';
import {
    extractNode,
    GraphNode,
    joinLists,
} from '../textGeneration/extraction/extractNodeDetails';

const wholeNoteValue: WholeNoteProps = {
    hpi: {
        edges: {},
        graph: { OST001: ['OST002'] },
        nodes: {
            QST001: {
                blankNo:
                    'Question 1 they do not want to see a demo of all the question types.',
                blankTemplate: '',
                blankYes:
                    'Question 1 they want to see a demo of all the question types.',
                bodySystem: 'General Medicine',
                category: 'ALL_QUESTION_TYPES_DEMO',
                displayOrder: 0,
                doctorCreated: 'CYDOC',
                doctorView: 'All Question Types Demo',
                isQuestionRequired: 0,
                medID: 'QST001',
                noteSection: 'HPI',
                outpatientVsEmergency: 'Outpatient',
                patientView: 'All Question Types Demo',
                response: '',
                responseType: 'YES-NO',
                specialty: 'Adult Medicine',
                text: 'Question 1 do you want to see a demo of all the question types?',
                uid: '77e44b4ca20d4e6cb1fc33325c68c1f4',
            },
            QST002: {
                blankNo: '',
                blankTemplate:
                    'Question 6 reports ANSWER. Question 6 denies NOTANSWER.',
                blankYes: '',
                bodySystem: 'General Medicine',
                category: 'ALL_QUESTION_TYPES_DEMO',
                displayOrder: 0,
                doctorCreated: 'CYDOC',
                doctorView: 'All Question Types Demo',
                isQuestionRequired: 0,
                medID: 'QST006',
                noteSection: 'HPI',
                outpatientVsEmergency: 'Outpatient',
                patientView: 'All Question Types Demo',
                response: {
                    'runny nose': true,
                    cough: false,
                    'sore throat': false,
                },
                responseType: 'SELECTMANY',
                specialty: 'Adult Medicine',
                text: 'Question 6, SELECTMANY question: Do you have any of the following symptoms? CLICK[runny nose, cough, sore throat]',
                uid: '0c0fe26603f441c1b64997f5546faeb5',
            },
        },
    },
    familyHistory: null,
    medications: null,
    surgicalHistory: null,
    medicalHistory: null,
    patientInformation: null,
    chiefComplaints: { 'All Question Types Demo': '' },
};

const node: GraphNode = {
    blankNo:
        'Question 1 they do not want to see a demo of all the question types.',
    blankTemplate: '',
    blankYes: 'Question 1 they want to see a demo of all the question types.',
    bodySystem: 'General Medicine',
    category: 'ALL_QUESTION_TYPES_DEMO',
    displayOrder: 0,
    doctorCreated: 'CYDOC',
    doctorView: 'All Question Types Demo',
    isQuestionRequired: 0,
    medID: 'QST001',
    noteSection: 'HPI',
    outpatientVsEmergency: 'Outpatient',
    patientView: 'All Question Types Demo',
    response: 'No',
    responseType: 'YES-NO',
    specialty: 'Adult Medicine',
    text: 'Question 1 do you want to see a demo of all the question types?',
    uid: '77e44b4ca20d4e6cb1fc33325c68c1f4',
};

const anotherNode: GraphNode = {
    blankNo: '',
    blankTemplate: 'Question 6 reports ANSWER. Question 6 denies NOTANSWER.',
    blankYes: '',
    bodySystem: 'General Medicine',
    category: 'ALL_QUESTION_TYPES_DEMO',
    displayOrder: 0,
    doctorCreated: 'CYDOC',
    doctorView: 'All Question Types Demo',
    isQuestionRequired: 0,
    medID: 'QST006',
    noteSection: 'HPI',
    outpatientVsEmergency: 'Outpatient',
    patientView: 'All Question Types Demo',
    response: {
        'runny nose': true,
        cough: false,
        'sore throat': false,
    },
    responseType: 'SELECTMANY',
    specialty: 'Adult Medicine',
    text: 'Question 6, SELECTMANY question: Do you have any of the following symptoms? CLICK[runny nose, cough, sore throat]',
    uid: '0c0fe26603f441c1b64997f5546faeb5',
};

describe('joinLists', () => {
    it('handles empty list', () => {
        expect(joinLists([])).toEqual('');
    });

    it('handles 1 item', () => {
        expect(joinLists(['a'])).toEqual('a');
    });

    it('handles 2 items', () => {
        const items = ['a', 'b'];
        expect(joinLists(items)).toEqual('a and b');
    });

    it('handles >2 items', () => {
        const items = ['a', 'b', 'c'];
        expect(joinLists(items)).toEqual('a, b, and c');
    });

    it('handles custom lastSeparate', () => {
        const items = ['a', 'b', 'c', 'd'];
        expect(joinLists(items, 'or')).toEqual('a, b, c, or d');
    });
});

describe('extract node responses', () => {
    it('extract node', () => {
        expect(extractNode(wholeNoteValue, node)).toEqual([
            'Question 1 they do not want to see a demo of all the question types.',
            '',
            '',
        ]);
    });
    it('extract node1 responses', () => {
        expect(extractNode(wholeNoteValue, anotherNode)).toEqual([
            'Question 6 reports ANSWER. Question 6 denies NOTANSWER.',
            'runny nose',
            'cough or sore throat',
        ]);
    });
});
