import { questionTypes } from '../../constants/questionTypes';

export const RESPONSE_PLACEHOLDER = {
    [questionTypes.YES_NO]: {
        yes: 'The patient has abdominal pain',
        no: 'The patient does not have abdominal pain',
    },
    [questionTypes.SHORT_TEXT]: {
        startEg: 'The patient describes their concerns as',
    },
    [questionTypes.NUMBER]: {
        startEg: 'The patient uses',
        endEg: 'pillows at night',
    },
    [questionTypes.SELECTONE]: {
        startEg: 'The patient reports',
        negStartEg: 'The patient denies',
        options: [
            'improved hearing',
            'worsened hearing',
            'no change in hearing',
        ],
    },
    [questionTypes.TIME]: {
        startEg: 'The cough started',
        endEg: 'ago',
    },
    [questionTypes.LIST_TEXT]: {
        startEg: 'The patient normally eats',
        endEg: 'for breakfast',
    },
    [questionTypes.BODY_LOCATION]: {
        startEg: 'The patient feels numbness in their',
    },
};

export const QUESTION_PLACEHOLDER = {
    [questionTypes.YES_NO]: 'Do you have abdominal pain?',
    [questionTypes.SHORT_TEXT]:
        'What concerns do you have about your diabetes?',
    [questionTypes.NUMBER]: 'How many pillows do you use at night?',
    [questionTypes.SELECTONE]: 'Do you have any of the following symptoms:',
    [questionTypes.TIME]: 'How long ago did the cough start?',
    [questionTypes.LIST_TEXT]: 'What do you normally eat for breakfast?',
    [questionTypes.BODY_LOCATION]: 'Where is the numbness?',
};

// Set aliases
RESPONSE_PLACEHOLDER['NO-YES'] = RESPONSE_PLACEHOLDER['YES-NO'];
QUESTION_PLACEHOLDER['NO-YES'] = QUESTION_PLACEHOLDER['YES-NO'];
