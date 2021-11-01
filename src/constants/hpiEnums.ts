import { YesNoMaybeResponse, YesNoResponse } from './enums';
import { HpiState } from 'redux/reducers/hpiReducer';

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
    RADIOLOGY = 'RADIOLOGY',
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
    RADIOLOGY: string;
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
    RADIOLOGY: '',
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

export type leftRightCenter = {
    left: boolean;
    center: boolean;
    right: boolean;
};
export type BodyLocationLRType = {
    [bodyOption in BodyLocationOptions]?: leftRightCenter;
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
