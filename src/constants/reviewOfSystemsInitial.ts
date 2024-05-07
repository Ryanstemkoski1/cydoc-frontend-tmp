import { ReviewOfSystemsState } from '@redux/reducers/reviewOfSystemsReducer';
import { YesNoResponse } from 'constants/enums';

export const initialReviewOfSystemsState: ReviewOfSystemsState = {
    General: {
        'Weight changes': YesNoResponse.None,
        Fatigue: YesNoResponse.None,
        Fever: YesNoResponse.None,
        Chills: YesNoResponse.None,
    },
    'Eyes/Ears': {
        'Vision changes': YesNoResponse.None,
        'Hearing changes': YesNoResponse.None,
    },
    Respiratory: {
        'Shortness of breath': YesNoResponse.None,
        Cough: YesNoResponse.None,
    },
    'Cardiovascular/Hematological': {
        'Chest pain': YesNoResponse.None,
        Palpitations: YesNoResponse.None,
        'Easy bruising': YesNoResponse.None,
        'Easy bleeding': YesNoResponse.None,
    },
    Gastrointestinal: {
        Nausea: YesNoResponse.None,
        Vomiting: YesNoResponse.None,
        'Abdominal pain': YesNoResponse.None,
        Diarrhea: YesNoResponse.None,
        Constipation: YesNoResponse.None,
    },
    Urinary: {
        Dysuria: YesNoResponse.None,
        'Urinary frequency': YesNoResponse.None,
        Hematuria: YesNoResponse.None,
    },
    Musculoskeletal: {
        'Joint pain': YesNoResponse.None,
        'Muscle pain': YesNoResponse.None,
    },
    Dermatologic: {
        'Skin changes': YesNoResponse.None,
    },
    Neurological: {
        Headache: YesNoResponse.None,
        'Loss of consciousness': YesNoResponse.None,
        Numbness: YesNoResponse.None,
        Tingling: YesNoResponse.None,
        Dizziness: YesNoResponse.None,
    },
    Psychiatric: {
        'Mood changes': YesNoResponse.None,
    },
};
