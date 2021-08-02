import { YesNoMaybeResponse, YesNoResponse } from './enums';
import { HpiState } from 'redux/reducers/hpiReducer';

export enum BodySystemNames {
    NEUROPSYCHIATRIC = 'Neuropsychiatric',
    RESPIRATORY = 'Respiratory',
    PAIN = 'Pain',
    ENDOCRINE = 'Endocrine',
    DERMATOLOGIC = 'Dermatologic',
    HEMATOLOGIC = 'Hematologic',
    OPHTHALMOLOGIC = 'Ophthalmologic',
    GASTROINTESTINAL = 'Gastrointestinal',
    LIFESTYLE = 'Lifestyle',
    IMMUNE = 'Immune',
    NEUROLOGIC = 'Neurologic',
    PSYCHIATRIC = 'Psychiatric',
    HEENT = 'HEENT',
    SPECIAL_DEMOGRAPHICS = 'Special Demographics',
    SYSTEMIC = 'Systemic',
    MUSCULOSKELETAL = 'Musculoskeletal',
    CARDIOVASCULAR = 'Cardiovascular',
    REPRODUCTIVE = 'Reproductive',
    CARDIAC = 'Cardiac',
    SENSORY = 'Sensory',
    URINARY = 'Urinary',
    SKELETAL = 'Skeletal',
}

export enum DiseaseCategories {
    PNEUMONIA = 'PNEUMONIA',
    VISION_CHANGES = 'VISION_CHANGES',
    GERD = 'GERD',
    ANXIETY = 'ANXIETY',
    DEPRESSION = 'DEPRESSION',
    TB = 'TB',
    HYPERTHYROIDISM = 'HYPERTHYROIDISM',
    UQ_PAIN = 'UQ_PAIN',
    GENERAL = 'GENERAL',
    LIVING_SITUATION = 'LIVING_SITUATION',
    LEG_PAIN = 'LEG_PAIN',
    COAGULOPATHY = 'COAGULOPATHY',
    DIABETES = 'DIABETES',
    HEARING_LOSS = 'HEARING_LOSS',
    BIPOLAR = 'BIPOLAR',
    SUICIDE = 'SUICIDE',
    DIZZINESS = 'DIZZINESS',
    SMOKING = 'SMOKING',
    NAIL_CHANGES = 'NAIL_CHANGES',
    HEART_FAILURE = 'HEART_FAILURE',
    WHEEZING = 'WHEEZING',
    UPPER_RESPIRATORY = 'UPPER_RESPIRATORY',
    ARTHRITIS = 'ARTHRITIS',
    ALCOHOL = 'ALCOHOL',
    RHINORRHEA = 'RHINORRHEA',
    HYPOTHYROIDISM = 'HYPOTHYROIDISM',
    CONFUSION = 'CONFUSION',
    IMMUNOSUPPRESSION = 'IMMUNOSUPPRESSION',
    JAUNDICE = 'JAUNDICE',
    VOICE_CHANGES = 'VOICE_CHANGES',
    PNEUMOTHORAX = 'PNEUMOTHORAX',
    DIET = 'DIET',
    DRY_SKIN = 'DRY_SKIN',
    TBI = 'TBI',
    HEMOPTYSIS = 'HEMOPTYSIS',
    PERIOD_CHANGES = 'PERIOD_CHANGES',
    COPD = 'COPD',
    LUNG_CANCER = 'LUNG_CANCER',
    FATIGUE = 'FATIGUE',
    SARCOIDOSIS = 'SARCOIDOSIS',
    EPISTAXIS = 'EPISTAXIS',
    PALPITATIONS = 'PALPITATIONS',
    PACEMAKER_ISSUE = 'PACEMAKER_ISSUE',
    CONJUNCTIVITIS = 'CONJUNCTIVITIS',
    ABD_PAIN = 'ABD_PAIN',
    ASTHMA = 'ASTHMA',
    PRURITUS = 'PRURITUS',
    RLQ_PAIN = 'RLQ_PAIN',
    POSTPREGNANCY = 'POSTPREGNANCY',
    URINARY_SYMPTOMS = 'URINARY_SYMPTOMS',
    HEADACHE = 'HEADACHE',
    GEN_MUSCLE_PAIN = 'GEN_MUSCLE_PAIN',
    LQ_PAIN = 'LQ_PAIN',
    PAIN = 'PAIN',
    EYE_CONDITIONS = 'EYE_CONDITIONS',
    BACK_PAIN = 'BACK_PAIN',
    CHEST_PAIN = 'CHEST_PAIN',
    SHORTBREATH = 'SHORTBREATH',
    PEDIATRICS = 'PEDIATRICS',
    BOWEL_SYMPTOMS = 'BOWEL_SYMPTOMS',
    STROKE = 'STROKE',
    EDEMA = 'EDEMA',
    DYSPHAGIA = 'DYSPHAGIA',
    JOINT_PAIN = 'JOINT_PAIN',
    GEN_DERM = 'GEN_DERM',
    POST_SURGERY = 'POST_SURGERY',
    SORE_THROAT = 'SORE_THROAT',
    ESOPHAGEAL_CANCER = 'ESOPHAGEAL_CANCER',
    ERECTILE_DYSFUNCTION = 'ERECTILE_DYSFUNCTION',
    COUGH = 'COUGH',
    PTSD = 'PTSD',
    DEMENTIA = 'DEMENTIA',
    EAR_PAIN = 'EAR_PAIN',
    EXERCISE = 'EXERCISE',
    SYSTEMIC_LUPUS_ERYTHEMATOSUS = 'SYSTEMIC_LUPUS_ERYTHEMATOSUS',
    CONCENTRATION_PROBLEMS = 'CONCENTRATION_PROBLEMS',
    HYPERLIPIDEMIA = 'HYPERLIPIDEMIA',
    PULMONARY_EMBOLISM = 'PULMONARY_EMBOLISM',
    SEIZURE = 'SEIZURE',
    AORTIC_ANEURYSM = 'AORTIC_ANEURYSM',
    WEIGHT = 'WEIGHT',
    MEMORY_PROBLEMS = 'MEMORY_PROBLEMS',
    ALLERGY = 'ALLERGY',
    DVT = 'DVT',
    MULTIPLE_SCLEROSIS = 'MULTIPLE_SCLEROSIS',
    SLEEP = 'SLEEP',
    TRAVEL_HISTORY = 'TRAVEL_HISTORY',
    LIVER_DISEASE = 'LIVER_DISEASE',
    BLOATING = 'BLOATING',
    FEVER = 'FEVER',
    EMPLOYMENT = 'EMPLOYMENT',
    HEMATEMESIS = 'HEMATEMESIS',
    LYMPHADENOPATHY = 'LYMPHADENOPATHY',
    BLOOD_PRESSURE = 'BLOOD_PRESSURE',
    NAUSEA_VOMITING = 'NAUSEA_VOMITING',
    NUMBESS_TINGLING = 'NUMBESS_TINGLING',
    HAIR_LOSS = 'HAIR_LOSS',
    IMAGING = 'IMAGING',
}

export enum DoctorView {
    PROBLEMS_WITH_CONCENTRATION = 'Problems with concentration',
    INCREASED_CONFUSION = 'Increased confusion',
    MEMORY_PROBLEMS = 'Memory problems',
    COPD = 'COPD',
    HEMOPTYSIS = 'Hemoptysis',
    WHEEZING = 'Wheezing',
    ASTHMA = 'Asthma',
    SHORTNESS_OF_BREATH = 'Shortness of Breath',
    LUNG_CANCER = 'Lung Cancer',
    RHINORRHEA = 'Rhinorrhea',
    PNEUMONIA = 'Pneumonia',
    TUBERCULOSIS = 'Tuberculosis',
    UPPER_RESPIRATORY_INFECTION = 'Upper Respiratory Infection',
    PNEUMOTHORAX = 'Pneumothorax',
    COUGH = 'Cough',
    EAR_PAIN = 'Ear Pain',
    MUSCLE_PAIN = 'Muscle Pain',
    PAIN = 'Pain',
    LEG_PAIN = 'Leg pain',
    ABDOMINAL_PAIN = 'Abdominal Pain',
    UPPER_ABDOMINAL_PAIN = 'Upper Abdominal Pain',
    LOWER_ABDOMINAL_PAIN = 'Lower Abdominal Pain',
    CHEST_PAIN = 'Chest Pain',
    HEADACHE = 'Headache',
    JOINT_PAIN = 'Joint Pain',
    RLQ_PAIN = 'RLQ Pain',
    HYPERTHYROIDISM = 'Hyperthyroidism',
    HYPOTHYROIDISM = 'Hypothyroidism',
    DIABETES = 'Diabetes',
    PRURITIC_SKIN = 'Pruritic skin',
    ALOPECIA = 'Alopecia',
    SKIN_CONCERNS = 'Skin Concerns',
    DRY_SKIN = 'Dry skin',
    JAUNDICE = 'Jaundice',
    NAIL_CHANGES = 'Nail changes',
    COAGULOPATHY = 'Coagulopathy',
    VISION_CHANGES = 'Vision changes',
    CONJUNCTIVITIS = 'Conjunctivitis',
    EYE_CONCERNS = 'Eye Concerns',
    CONSTIPATION = 'Constipation',
    BLOATING = 'Bloating',
    NAUSEA = 'Nausea',
    ESOPHAGEAL_CANCER = 'Esophageal Cancer',
    HEMATEMESIS = 'Hematemesis',
    DIARRHEA = 'Diarrhea',
    LIVER_DISEASE = 'Liver Disease',
    VOMITING = 'Vomiting',
    GERD = 'GERD',
    EXERCISE = 'Exercise',
    DIET = 'Diet',
    HIDDEN = 'HIDDEN',
    SLEEP_DIFFICULTIES = 'Sleep Difficulties',
    TRAVEL_HISTORY = 'Travel History',
    LUPUS = 'Lupus',
    SARCOIDOSIS = 'Sarcoidosis',
    IMMUNOSUPPRESSION = 'Immunosuppression',
    ALLERGIES = 'Allergies',
    EPILEPSY_OR_SEIZURE = 'Epilepsy or Seizure',
    MULTIPLE_SCLEROSIS = 'Multiple Sclerosis',
    NUMBNESS_OR_TINGLING_IN_EXTREMITIES = 'Numbness or tingling in extremities',
    CONCUSSION_TBI = 'Concussion/TBI',
    STROKE = 'Stroke',
    DIZZINESS = 'Dizziness',
    BIPOLAR_DISORDER = 'Bipolar Disorder',
    DEPRESSION = 'Depression',
    SUICIDE_RISK = 'Suicide Risk',
    TOBACCO_USE = 'Tobacco Use',
    PTSD = 'PTSD',
    GENERALIZED_ANXIETY_DISORDER = 'Generalized Anxiety Disorder',
    ALCOHOL_USE = 'Alcohol Use',
    EPISTAXIS = 'Epistaxis',
    HOARSENESS_OR_VOICE_CHANGES = 'Hoarseness or voice changes',
    DYSPHAGIA = 'Dysphagia',
    SORE_THROAT = 'Sore Throat',
    WELL_CHILD_VISIT = 'Well Child Visit',
    POSTPARTUM_VISIT = 'Postpartum Visit',
    POST_SURGERY_ = 'Post-Surgery ',
    FEVER = 'Fever',
    AGING_CHALLENGES_AND_DEMENTIA = 'Aging Challenges and Dementia',
    LYMPHADENOPATHY = 'Lymphadenopathy',
    WEIGHT = 'Weight',
    PERIPHERAL_EDEMA = 'Peripheral edema',
    FATIGUE = 'Fatigue',
    BACK_PAIN = 'Back Pain',
    PULMONARY_EMBOLISM = 'Pulmonary Embolism',
    PACEMAKER_ISSUE = 'Pacemaker Issue',
    HYPERTENSION = 'Hypertension',
    DVT = 'DVT',
    AORTIC_ANEURYSM = 'Aortic Aneurysm',
    HYPERLIPIDEMIA = 'Hyperlipidemia',
    PERIOD_CHANGES = 'Period changes',
    ERECTILE_DYSFUNCTION = 'Erectile dysfunction',
    HEART_FAILURE = 'Heart Failure',
    PALPITATIONS = 'Palpitations',
    HEARING_LOSS = 'Hearing Loss',
    URINARY_SYMPTOMS = 'Urinary Symptoms',
    ARTHRITIS = 'Arthritis',
}

export enum PatientView {
    INCREASED_CONFUSION = 'Increased confusion',
    YOUNG_CHILD_VISIT = 'Young Child Visit',
    MEMORY_PROBLEMS = 'Memory problems',
    MUSCLE_PAIN = 'Muscle Pain',
    DIET = 'Diet',
    HEADACHE = 'Headache',
    NAUSEA = 'Nausea',
    HIGH_BLOOD_PRESSURE = 'High Blood Pressure',
    NOSE_BLEEDS = 'Nose bleeds',
    ALLERGIES = 'Allergies',
    ASTHMA = 'Asthma',
    EAR_PAIN = 'Ear Pain',
    SWELLING_IN_EXTREMITIES = 'Swelling in extremities',
    HOARSENESS_OR_VOICE_CHANGES = 'Hoarseness or voice changes',
    VISION_CHANGES = 'Vision changes',
    CHALLENGES_RELATED_TO_AGING = 'Challenges Related to Aging',
    POST_SURGERY = 'Post-Surgery',
    ERECTILE_DYSFUNCTION = 'Erectile dysfunction',
    WHEEZING = 'Wheezing',
    LUPUS = 'Lupus',
    RUNNY_NOSE = 'Runny nose',
    PROBLEMS_WITH_CONCENTRATION = 'Problems with concentration',
    HEARING_LOSS = 'Hearing Loss',
    FATIGUE = 'Fatigue',
    ARTHRITIS = 'Arthritis',
    FEELING_ANXIOUS = 'Feeling Anxious',
    HEARTBURN = 'Heartburn',
    COUGHING_UP_BLOOD = 'Coughing Up Blood',
    SEIZURE = 'Seizure',
    STROKE = 'Stroke',
    ITCHY_SKIN = 'Itchy skin',
    RECENT_TRAVEL = 'Recent Travel',
    BLOATING = 'Bloating',
    TUBERCULOSIS = 'Tuberculosis',
    COPD = 'COPD',
    ITCHY_RED_EYES = 'Itchy, red eyes',
    PNEUMONIA = 'Pneumonia',
    HIGH_CHOLESTEROL_TRIGLYCERIDES = 'High cholesterol/triglycerides',
    WEIGHT_CONCERNS = 'Weight Concerns',
    HIDDEN = 'HIDDEN',
    NAIL_CHANGES = 'Nail changes',
    VOMITING = 'Vomiting',
    AFTER_PREGNANCY_VISIT = 'After Pregnancy Visit',
    SHORTNESS_OF_BREATH = 'Shortness of Breath',
    TRAUMATIC_EXPERIENCE = 'Traumatic Experience',
    SLEEP_DIFFICULTIES = 'Sleep Difficulties',
    DIABETES = 'Diabetes',
    PERIOD_CHANGES = 'Period changes',
    NUMBNESS_OR_TINGLING_IN_EXTREMITIES = 'Numbness or tingling in extremities',
    TROUBLE_SWALLOWING = 'Trouble swallowing',
    YELLOWING_OF_THE_SKIN_OR_EYES = 'Yellowing of the skin or eyes',
    PAIN = 'Pain',
    JOINT_PAIN = 'Joint Pain',
    BOWEL_SYMPTOMS = 'Bowel Symptoms',
    URINATION_OR_BLADDER_CONCERNS = 'Urination or Bladder Concerns',
    PALPITATIONS = 'Palpitations',
    MOOD_SWINGS = 'Mood Swings',
    MULTIPLE_SCLEROSIS = 'Multiple Sclerosis',
    FEVER = 'Fever',
    DIARRHEA = 'Diarrhea',
    EXERCISE = 'Exercise',
    FEELING_SAD = 'Feeling Sad',
    SORE_THROAT = 'Sore Throat',
    HEAD_INJURY = 'Head Injury',
    SKIN_CONCERNS = 'Skin Concerns',
    LEG_PAIN = 'Leg pain',
    DIZZINESS = 'Dizziness',
    OTHER_MEDICAL_CONCERN = 'Other Medical Concern',
    CONSTIPATION = 'Constipation',
    DRY_SKIN = 'Dry skin',
    EYE_CONCERNS = 'Eye Concerns',
    CHEST_PAIN = 'Chest Pain',
    HAIR_LOSS = 'Hair loss',
    COLD = 'Cold',
    BACK_PAIN = 'Back Pain',
    COUGH = 'Cough',
    VOMITING_BLOOD = 'Vomiting Blood',
    ABDOMINAL_PAIN = 'Abdominal Pain',
}

export enum ResponseTypes {
    NUMBER = 'NUMBER',
    LIST_TEXT = 'LIST-TEXT',
    PSH_BLANK = 'PSH-BLANK',
    PMH_POP = 'PMH-POP',
    MEDS_POP = 'MEDS-POP',
    TIME3DAYS = 'TIME3DAYS',
    NO_YES = 'NO-YES',
    YES_NO = 'YES-NO',
    SHORT_TEXT = 'SHORT-TEXT',
    FH_POP = 'FH-POP',
    PMH_BLANK = 'PMH-BLANK',
    CLICK_BOXES = 'CLICK-BOXES',
    PSH_POP = 'PSH-POP',
    MEDS_BLANK = 'MEDS-BLANK',
    BODYLOCATION = 'BODYLOCATION',
    FH_BLANK = 'FH-BLANK',
    SCALE1TO10 = 'SCALE1TO10',
}

export const BodyResponseDict = {
    ANKLE: {
        center: false,
        left: false,
        right: false,
    },
    CHEST: false,
    EAR: {
        center: false,
        left: false,
        right: false,
    },
    ELBOW: {
        center: false,
        left: false,
        right: false,
    },
    EYE: {
        center: false,
        left: false,
        right: false,
    },
    FINGER: {
        center: false,
        left: false,
        right: false,
    },
    FOOT: {
        center: false,
        left: false,
        right: false,
    },
    GROIN: false,
    HAND: {
        center: false,
        left: false,
        right: false,
    },
    HEAD: false,
    HIP: {
        center: false,
        left: false,
        right: false,
    },
    KNEE: {
        center: false,
        left: false,
        right: false,
    },
    LOWER_ARM: {
        center: false,
        left: false,
        right: false,
    },
    LOWER_BACK: false,
    LOWER_LEG: {
        center: false,
        left: false,
        right: false,
    },
    MID_BACK: false,
    MOUTH: false,
    NECK: false,
    NOSE: false,
    PELVIS: false,
    SHOULDER: {
        center: false,
        left: false,
        right: false,
    },
    STOMACH: false,
    THROAT: false,
    TOE: {
        center: false,
        left: false,
        right: false,
    },
    UPPER_ARM: {
        center: false,
        left: false,
        right: false,
    },
    UPPER_BACK: false,
    UPPER_LEG: {
        center: false,
        left: false,
        right: false,
    },
    WRIST: {
        center: false,
        left: false,
        right: false,
    },
};

export interface ExpectedResponseInterface {
    YES_NO: YesNoInput;
    NO_YES: YesNoInput;
    CLICK_BOXES: ClickBoxesInput;
    MEDS_POP: string[];
    TIME3DAYS: TimeInput;
    LIST_TEXT: ListTextInput;
    SHORT_TEXT: string;
    NUMBER: NumberInput;
    BODYLOCATION: BodyLocationTotal;
    FH_POP: string[];
    PMH_POP: string[];
    MEDS_BLANK: string[];
    PSH_BLANK: string[];
    PMH_BLANK: string[];
    PSH_POP: string[];
    FH_BLANK: string[];
    SCALE1TO10: ScaleInputType;
}

export const ExpectedResponseDict: ExpectedResponseInterface = {
    YES_NO: YesNoResponse.None,
    NO_YES: YesNoResponse.None,
    CLICK_BOXES: [],
    MEDS_POP: [],
    TIME3DAYS: { numInput: 0, timeOption: '' },
    LIST_TEXT: { 1: '', 2: '', 3: '' },
    SHORT_TEXT: '',
    NUMBER: 0,
    BODYLOCATION: {},
    FH_POP: [],
    PMH_POP: [],
    MEDS_BLANK: [],
    PSH_BLANK: [],
    PMH_BLANK: [],
    PSH_POP: [],
    FH_BLANK: [],
    SCALE1TO10: undefined,
};

export enum TimeOption {
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
    WEEKS = 'weeks',
    MONTHS = 'months',
    YEARS = 'years',
}

export enum BodyLocationOptions {
    HEAD = 'Head',
    EYE = 'Eye',
    EAR = 'Ear',
    NOSE = 'Nose',
    MOUTH = 'Mouth',
    THROAT = 'Throat',
    NECK = 'Neck',
    CHEST = 'Chest',
    STOMACH = 'Stomach',
    PELVIS = 'Pelvis',
    GROIN = 'Groin',
    SHOULDER = 'Shoulder',
    UPPER_ARM = 'Upper Arm',
    ELBOW = 'Elbow',
    LOWER_ARM = 'Lower Arm',
    WRIST = 'Wrist',
    HAND = 'Hand',
    FINGER = 'Finger',
    UPPER_BACK = 'Upper Back',
    MID_BACK = 'Mid Back',
    LOWER_BACK = 'Lower Back',
    HIP = 'Hip',
    UPPER_LEG = 'Upper Leg',
    KNEE = 'Knee',
    LOWER_LEG = 'Lower Leg',
    ANKLE = 'Ankle',
    FOOT = 'Foot',
    TOE = 'Toe',
}

export interface NodeInterface {
    uid: string;
    medID: string;
    category: DiseaseCategories;
    text: string;
    responseType: ResponseTypes;
    bodySystem: BodySystemNames;
    noteSection: string;
    doctorView: DoctorView;
    patientView: PatientView;
    doctorCreated: string;
    blankTemplate: string;
    blankYes: string;
    blankNo: string;
}

export interface GraphData {
    graph: {
        [node: string]: number[];
    };
    nodes: { [node: string]: NodeInterface };
    edges: {
        [edge: string]: EdgeInterface;
    };
}

export interface EdgeInterface {
    from: string;
    to: string;
    fromQuestionOrder: number;
    toQuestionOrder: number;
}

export interface HpiStateProps {
    hpi: HpiState;
}

export type NumberInput = number | null;
export type ListTextInput = { [uuid: string]: string };
export type TimeInput = {
    numInput: NumberInput;
    timeOption: TimeOption | '';
};
export type BodyLocationLRType = {
    [bodyOption in BodyLocationOptions]?: {
        left: boolean;
        center: boolean;
        right: boolean;
    };
};
export type BodyLocationType = {
    [bodyOption in BodyLocationOptions]?: boolean;
};
export type BodyLocationLRItemType = {
    name: BodyLocationOptions;
    needsRightLeft: boolean;
};
export type BodyLocationTotal = BodyLocationLRType | BodyLocationType;
export type BodyLocationToggle = 'left' | 'center' | 'right' | null;

export type ClickBoxesInput = string[];
export type ScaleInputType = number | undefined;
export type YesNoInput =
    | YesNoResponse.Yes
    | YesNoResponse.No
    | YesNoResponse.None;
export type HpiResponseType =
    | string
    | boolean
    | NumberInput
    | ListTextInput
    | TimeInput
    | ClickBoxesInput
    | YesNoMaybeResponse
    | BodyLocationTotal
    | ScaleInputType
    | YesNoInput;
