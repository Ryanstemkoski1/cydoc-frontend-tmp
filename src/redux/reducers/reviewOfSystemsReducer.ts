import { YesNoResponse } from 'constants/enums';
import { ROS_ACTION } from '../actions/actionTypes';
import { ROSActionTypes } from '../actions/reviewOfSystemsActions';

export interface ReviewOfSystemsState {
    [category: string]: {
        [option: string]: YesNoResponse | '';
    };
}

export const initialReviewOfSystemsState: ReviewOfSystemsState = {
    General: {
        'Weight changes': YesNoResponse.None,
        Fatigue: YesNoResponse.None,
        Weakness: YesNoResponse.None,
        Fevers: YesNoResponse.None,
        Chills: YesNoResponse.None,
        'Night sweats': YesNoResponse.None,
    },
    Eyes: {
        Glasses: YesNoResponse.None,
        Contacts: YesNoResponse.None,
        Blurriness: YesNoResponse.None,
    },
    Ears: {
        'Changes in hearing': YesNoResponse.None,
        'Hearing loss': YesNoResponse.None,
        Tinnitus: YesNoResponse.None,
        Earache: YesNoResponse.None,
        Discharge: YesNoResponse.None,
    },
    Nose: {
        Colds: YesNoResponse.None,
        Stuffiness: YesNoResponse.None,
        Sneezing: YesNoResponse.None,
        Itching: YesNoResponse.None,
        Allergy: YesNoResponse.None,
        Nosebleed: YesNoResponse.None,
    },
    Mouth: {
        'Changes in teeth': YesNoResponse.None,
        'Bleeding gums': YesNoResponse.None,
        'Sore throat': YesNoResponse.None,
        Hoarseness: YesNoResponse.None,
    },
    Throat: {
        Lumps: YesNoResponse.None,
        Swelling: YesNoResponse.None,
        Pain: YesNoResponse.None,
        Stiffness: YesNoResponse.None,
    },
    Respiratory: {
        Dyspnea: YesNoResponse.None,
        'Dyspnea on exertion': YesNoResponse.None,
        'Nocturnal dyspnea': YesNoResponse.None,
        Orthopnea: YesNoResponse.None,
        Wheezing: YesNoResponse.None,
        Cough: YesNoResponse.None,
        Asthma: YesNoResponse.None,
        Bronchitis: YesNoResponse.None,
        Emphysema: YesNoResponse.None,
        Pneumonia: YesNoResponse.None,
        Tuberculosis: YesNoResponse.None,
    },
    'Cardiovascular/Hematological': {
        'Chest pain': YesNoResponse.None,
        Palpitations: YesNoResponse.None,
        'High BP': YesNoResponse.None,
        'Low BP': YesNoResponse.None,
        Murmurs: YesNoResponse.None,
        Edema: YesNoResponse.None,
        'Varicose veins': YesNoResponse.None,
        Claudication: YesNoResponse.None,
        'Easy bruising': YesNoResponse.None,
        'Easy bleeding': YesNoResponse.None,
        Anemia: YesNoResponse.None,
        Transfusions: YesNoResponse.None,
    },
    Gastrointestinal: {
        'Changes in appetite': YesNoResponse.None,
        Nausea: YesNoResponse.None,
        Vomiting: YesNoResponse.None,
        'Abdominal pain': YesNoResponse.None,
        Dysphagia: YesNoResponse.None,
        Heartburn: YesNoResponse.None,
        Bloating: YesNoResponse.None,
        Diarrhea: YesNoResponse.None,
        Constipation: YesNoResponse.None,
        Hematemesis: YesNoResponse.None,
        Hemorrhoids: YesNoResponse.None,
        Melena: YesNoResponse.None,
        Hematochezia: YesNoResponse.None,
    },
    Genitourinary: {
        'Urinary tract infection': YesNoResponse.None,
        'Changes in stream': YesNoResponse.None,
        Frequency: YesNoResponse.None,
        Hesitancy: YesNoResponse.None,
        Urgency: YesNoResponse.None,
        Polyuria: YesNoResponse.None,
        Hematuria: YesNoResponse.None,
        Nocturia: YesNoResponse.None,
        Incontinence: YesNoResponse.None,
        Stones: YesNoResponse.None,
    },
    'Genital/Sexual/Gynecological': {
        Discharge: YesNoResponse.None,
        Sores: YesNoResponse.None,
        Itching: YesNoResponse.None,
        STD: YesNoResponse.None,
        Contraception: YesNoResponse.None,
        Hernias: YesNoResponse.None,
        'Testicular/vaginal pain': YesNoResponse.None,
        'Testicular mass': YesNoResponse.None,
        'Breast pain': YesNoResponse.None,
        'Breast masses': YesNoResponse.None,
        'Breast lumps': YesNoResponse.None,
        'Period irregularities': YesNoResponse.None,
        'Pregnancy complications': YesNoResponse.None,
    },
    Musculoskeletal: {
        Osteoarthritis: YesNoResponse.None,
        'Rheumatoid arthritis': YesNoResponse.None,
        'Joint stiffness': YesNoResponse.None,
        'Joint pain': YesNoResponse.None,
        'Joint swelling': YesNoResponse.None,
        'Muscle cramps': YesNoResponse.None,
        'Muscle weakness': YesNoResponse.None,
        'Muscle pain': YesNoResponse.None,
    },
    'Skin/Hair/Nails': {
        Rashes: YesNoResponse.None,
        Itching: YesNoResponse.None,
        Dryness: YesNoResponse.None,
        'Changes in hair': YesNoResponse.None,
        'Changes in nails': YesNoResponse.None,
        Sores: YesNoResponse.None,
        Lumps: YesNoResponse.None,
        Moles: YesNoResponse.None,
    },
    Endocrine: {
        'Heat intolerance': YesNoResponse.None,
        'Cold intolerance': YesNoResponse.None,
        'Excessive sweating': YesNoResponse.None,
        Polydipsia: YesNoResponse.None,
        Polyphagia: YesNoResponse.None,
        Hyperthyroidism: YesNoResponse.None,
        Hypothyroidism: YesNoResponse.None,
        Diabetes: YesNoResponse.None,
        'Skin color change': YesNoResponse.None,
        'Excess hair growth': YesNoResponse.None,
    },
    Neurological: {
        Headache: YesNoResponse.None,
        'Changes in vision': YesNoResponse.None,
        'Double vision': YesNoResponse.None,
        'Fainting/blackouts': YesNoResponse.None,
        Seizures: YesNoResponse.None,
        Paralysis: YesNoResponse.None,
        Numbness: YesNoResponse.None,
        Tingling: YesNoResponse.None,
        'Loss of sensation': YesNoResponse.None,
        'Vertigo/dizziness': YesNoResponse.None,
        Tremor: YesNoResponse.None,
        'Difficulty walking': YesNoResponse.None,
        'Changes in coordination': YesNoResponse.None,
        Confusion: YesNoResponse.None,
        'Memory loss': YesNoResponse.None,
    },
    Psych: {
        Anxiety: YesNoResponse.None,
        Depression: YesNoResponse.None,
        'Suicide attempts': YesNoResponse.None,
    },
};

export function reviewOfSystemsReducer(
    state = initialReviewOfSystemsState,
    action: ROSActionTypes
): ReviewOfSystemsState {
    const { category, option, yesOrNo } = action.payload || {};
    switch (action.type) {
        case ROS_ACTION.TOGGLE_OPTION:
            return {
                ...state,
                [category]: {
                    ...state[category],
                    [option]:
                        yesOrNo === state[category][option] ? '' : yesOrNo,
                },
            };
        default:
            return state;
    }
}
