export enum YesNoResponse {
    Yes = 'YES',
    No = 'NO',
    None = '',
}

export enum YesNoMaybeResponse {
    Yes = 'YES',
    No = 'NO',
    Maybe = 'MAYBE',
    None = '',
}

export enum SubstanceUsageResponse {
    Yes = 'YES',
    InThePast = 'IN_THE_PAST',
    NeverUsed = 'NEVER_USED',
    None = '',
}

export interface LRButtonState {
    left: boolean;
    center: boolean;
    right: boolean;
}

export enum LeftRight {
    Left = 'LEFT',
    Right = 'RIGHT',
}
export enum YesNoUncertainResponse {
    Yes = 'YES',
    No = 'NO',
    Uncertain = 'UNCERTAIN',
    None = '',
}

export enum WhenResponse {
    Today = 'TODAY',
    ThisWeek = 'THIS_WEEK',
    ThisMonth = 'THIS_MONTH',
    ThisYear = 'THIS_YEAR',
    None = '',
}

export interface DropdownOption {
    key: string | number;
    value: string;
    text: string;
}
