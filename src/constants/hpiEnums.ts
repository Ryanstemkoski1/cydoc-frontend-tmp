import { YesNoMaybeResponse, YesNoResponse } from './enums';
import { HpiState } from '@redux/reducers/hpiReducer';

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

export const options: BodyLocationLRItemType[][] = [
    [
        { name: BodyLocationOptions.HEAD, needsRightLeft: false },
        { name: BodyLocationOptions.EYE, needsRightLeft: true },
        { name: BodyLocationOptions.EAR, needsRightLeft: true },
        { name: BodyLocationOptions.NOSE, needsRightLeft: false },
        { name: BodyLocationOptions.MOUTH, needsRightLeft: false },
        { name: BodyLocationOptions.THROAT, needsRightLeft: false },
        { name: BodyLocationOptions.NECK, needsRightLeft: false },
    ],
    [
        { name: BodyLocationOptions.CHEST, needsRightLeft: false },
        { name: BodyLocationOptions.STOMACH, needsRightLeft: false },
        { name: BodyLocationOptions.PELVIS, needsRightLeft: false },
        { name: BodyLocationOptions.GROIN, needsRightLeft: false },
    ],
    [
        { name: BodyLocationOptions.SHOULDER, needsRightLeft: true },
        { name: BodyLocationOptions.UPPER_ARM, needsRightLeft: true },
        { name: BodyLocationOptions.ELBOW, needsRightLeft: true },
        { name: BodyLocationOptions.LOWER_ARM, needsRightLeft: true },
    ],
    [
        { name: BodyLocationOptions.WRIST, needsRightLeft: true },
        { name: BodyLocationOptions.HAND, needsRightLeft: true },
        { name: BodyLocationOptions.FINGER, needsRightLeft: true },
    ],
    [
        { name: BodyLocationOptions.UPPER_BACK, needsRightLeft: false },
        { name: BodyLocationOptions.MID_BACK, needsRightLeft: false },
        { name: BodyLocationOptions.LOWER_BACK, needsRightLeft: false },
    ],
    [
        { name: BodyLocationOptions.HIP, needsRightLeft: true },
        { name: BodyLocationOptions.UPPER_LEG, needsRightLeft: true },
        { name: BodyLocationOptions.KNEE, needsRightLeft: true },
        { name: BodyLocationOptions.LOWER_LEG, needsRightLeft: true },
    ],
    [
        { name: BodyLocationOptions.ANKLE, needsRightLeft: true },
        { name: BodyLocationOptions.FOOT, needsRightLeft: true },
        { name: BodyLocationOptions.TOE, needsRightLeft: true },
    ],
];

export function bodyLocationResponse(): BodyLocationType {
    const responseDict: BodyLocationType = {};
    options
        .reduce((prevValue, currValue) => prevValue.concat(currValue), [])
        .map((bodyOptionItem) => {
            responseDict[bodyOptionItem.name] = bodyOptionItem.needsRightLeft
                ? { left: false, center: false, right: false }
                : false;
        });
    return responseDict;
}

export enum ResponseTypes {
    NUMBER = 'NUMBER',
    DATE = 'DATE',
    LIST_TEXT = 'LIST-TEXT',
    PSH_BLANK = 'PSH-BLANK',
    PMH_POP = 'PMH-POP',
    MEDS_POP = 'MEDS-POP',
    TIME3DAYS = 'TIME3DAYS',
    NO_YES = 'NO-YES',
    YES_NO = 'YES-NO',
    SHORT_TEXT = 'SHORT-TEXT',
    LONG_TEXT = 'LONG_TEXT',
    FH_POP = 'FH-POP',
    PMH_BLANK = 'PMH-BLANK',
    SELECTONE = 'SELECTONE',
    SELECTMANY = 'SELECTMANY',
    SELECTMANYDENSE = 'SELECTMANYDENSE',
    PSH_POP = 'PSH-POP',
    MEDS_BLANK = 'MEDS-BLANK',
    BODYLOCATION = 'BODYLOCATION',
    FH_BLANK = 'FH-BLANK',
    SCALE1TO10 = 'SCALE1TO10',
    RADIOLOGY = 'RADIOLOGY',
    LABORATORY_TEST = 'LABORATORY-TEST',
    CBC = 'CBC',
    BMP = 'BMP',
    LFT = 'LFT',
    SEARCH = 'SEARCH',
    YEAR = 'YEAR',
    NULL = '',
    PSYCHDXPICKER = 'PSYCHDXPICKER',
}

export interface ExpectedResponseInterface {
    YES_NO: YesNoInput;
    NO_YES: YesNoInput;
    SELECTONE: SelectOneInput;
    DATE: DateInput;
    MEDS_POP: SelectOneInput;
    SELECTMANY: SelectManyInput;
    SELECTMANYDENSE: SelectOneInput;
    TIME3DAYS: TimeInput;
    LIST_TEXT: ListTextInput;
    SHORT_TEXT: string;
    LONG_TEXT: string;
    NUMBER: NumberInput;
    YEAR: NumberInput;
    BODYLOCATION: BodyLocationType;
    FH_POP: string[];
    PMH_POP: string[];
    MEDS_BLANK: string[];
    PSH_BLANK: string[];
    PMH_BLANK: string[];
    PSH_POP: string[];
    FH_BLANK: string[];
    SCALE1TO10: ScaleInputType;
    RADIOLOGY: string;
    LABORATORY_TEST: LabTestType;
    CBC: LabTestType;
    BMP: LabTestType;
    LFT: LabTestType;
    SEARCH: {
        [CC: string]: string;
    };
    PSYCHDXPICKER: string[];
}

export const ExpectedResponseDict: ExpectedResponseInterface = {
    YES_NO: YesNoResponse.None,
    NO_YES: YesNoResponse.None,
    DATE: '',
    SELECTONE: {},
    MEDS_POP: {},
    SELECTMANY: {},
    SELECTMANYDENSE: {},
    TIME3DAYS: { numInput: undefined, timeOption: '' },
    LIST_TEXT: { 1: '', 2: '', 3: '' },
    SHORT_TEXT: '',
    LONG_TEXT: '',
    NUMBER: undefined,
    YEAR: undefined,
    BODYLOCATION: bodyLocationResponse(),
    FH_POP: [],
    PMH_POP: [],
    MEDS_BLANK: [],
    PSH_BLANK: [],
    PMH_BLANK: [],
    PSH_POP: [],
    FH_BLANK: [],
    SCALE1TO10: undefined,
    RADIOLOGY: '',
    LABORATORY_TEST: { name: '', snomed: '', components: {} },
    CBC: { name: '', snomed: '', components: {} },
    BMP: { name: '', snomed: '', components: {} },
    LFT: { name: '', snomed: '', components: {} },
    SEARCH: {},
    PSYCHDXPICKER: [],
};

export enum TimeOption {
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
    WEEKS = 'weeks',
    MONTHS = 'months',
    YEARS = 'years',
}

export interface NodeInterface {
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
}

export interface GraphData {
    graph: {
        [node: string]: number[];
    };
    nodes: { [node: string]: NodeInterface };
    edges: {
        [edge: string]: EdgeInterface;
    };
    order: OrderInterface;
}

export interface EdgeInterface {
    from: string;
    to: string;
    fromQuestionOrder: number;
    toQuestionOrder: number;
}

export interface OrderInterface {
    [orderIndex: string]: string;
}

export interface HpiStateProps {
    hpi: HpiState;
}

export type NumberInput = number | undefined;
export type ListTextInput = { [uuid: string]: string };
export type TimeInput = {
    numInput: NumberInput;
    timeOption: TimeOption | '';
};

export type leftRightCenter = {
    left: boolean;
    center: boolean;
    right: boolean;
};

export type BodyLocationType = {
    [bodyOption: string]: leftRightCenter | boolean;
};

export type BodyLocationLRItemType = {
    name: BodyLocationOptions;
    needsRightLeft: boolean;
};

export type LabTestType = {
    name: string;
    snomed: string;
    components: {
        [component: string]: {
            unit: string;
            value: string | number | undefined;
            unitOptions: TimeOption[];
        };
    };
};

export type DateInput = string | undefined;
export type SelectOneInput = { [name: string]: boolean };
export type SelectManyInput = { [name: string]: YesNoResponse };
export type ScaleInputType = number | undefined;
export type YesNoInput =
    | YesNoResponse.Yes
    | YesNoResponse.No
    | YesNoResponse.None;
export type HpiResponseType =
    | string
    | boolean
    | NumberInput
    | DateInput
    | ListTextInput
    | TimeInput
    | SelectOneInput
    | SelectManyInput
    | YesNoMaybeResponse
    | BodyLocationType
    | ScaleInputType
    | YesNoInput
    | LabTestType
    | string[];
