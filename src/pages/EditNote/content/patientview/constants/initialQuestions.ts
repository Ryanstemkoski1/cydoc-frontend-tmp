import { ResponseTypes } from 'constants/hpiEnums';
import { InitialQuestionsState } from 'redux/reducers/userViewReducer';

const initialQuestions: InitialQuestionsState = {
    order: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
    },
    graph: {
        '1': ['8', '9'],
        '2': [],
        '3': [],
        '4': [],
        '5': ['6', '7'],
        '6': [],
        '7': [],
    },
    nodes: {
        '1': {
            uid: '1',
            text: '',
            responseType: ResponseTypes.NULL,
            category: '',
            doctorView: '',
        },
        '2': {
            uid: '2',
            text: 'Are you here for an annual physical exam?',
            responseType: ResponseTypes.YES_NO,
            category: 'ANNUALVISIT',
            doctorView: 'Annual Physical Exam',
        },
        '3': {
            uid: '3',
            text: 'Are you here to follow up any previously diagnosed medical conditions?',
            responseType: ResponseTypes.YES_NO,
            category: '',
            doctorView: '',
        },
        '4': {
            uid: '4',
            text: 'Do you have any new health concerns to discuss with the clinician today?',
            responseType: ResponseTypes.YES_NO,
            category: '',
            doctorView: '',
        },
        '5': {
            uid: '5',
            text: '',
            responseType: ResponseTypes.NULL,
            category: '',
            doctorView: '',
        },
        '6': {
            uid: '6',
            text: 'Please select the most important conditions or symptoms that you would like to discuss today, up to a maximum of 3.',
            responseType: ResponseTypes.SELECTONE,
            category: '',
            doctorView: '',
        },
        '7': {
            uid: '7',
            text: 'List any other conditions or symptoms you would like to discuss with the clinician today. Please be accurate as this information will be used to organize your visit.',
            responseType: ResponseTypes.LIST_TEXT,
            category: '',
            doctorView: '',
        },
        '8': {
            uid: '8',
            text: 'Please confirm the date of your appointment.',
            responseType: ResponseTypes.TIME3DAYS,
            category: '',
            doctorView: '',
        },
        '9': {
            uid: '9',
            text: 'What is the last name of the clinician you are seeing today? (optional)',
            responseType: ResponseTypes.SHORT_TEXT,
            category: '',
            doctorView: '',
        },
    },
};

export default initialQuestions;
