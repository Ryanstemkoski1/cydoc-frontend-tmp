import { FAMILY_HISTORY_ACTION } from './actionTypes';
import { YesNoResponse } from '../../constants/enums';
import { FamilyOption } from 'constants/familyHistoryRelations';

interface ToggleConditionOptionAction {
    type: FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION;
    payload: {
        conditionIndex: string;
        optionSelected: YesNoResponse;
    };
}

export function toggleConditionOption(
    conditionIndex: string,
    optionSelected: YesNoResponse
) {
    return {
        type: FAMILY_HISTORY_ACTION.TOGGLE_CONDITION_OPTION,
        payload: {
            conditionIndex,
            optionSelected,
        },
    };
}

interface AddFamilyMemberAction {
    type: FAMILY_HISTORY_ACTION.ADD_FAMILY_MEMBER;
    payload: {
        conditionIndex: string;
    };
}

export function addFamilyMember(conditionIndex: string) {
    return {
        type: FAMILY_HISTORY_ACTION.ADD_FAMILY_MEMBER,
        payload: {
            conditionIndex,
        },
    };
}

interface DeleteFamilyMemberAction {
    type: FAMILY_HISTORY_ACTION.DELETE_FAMILY_MEMBER;
    payload: {
        conditionIndex: string;
        familyMemberIndex: string;
    };
}

export function deleteFamilyMember(
    conditionIndex: string,
    familyMemberIndex: string
) {
    return {
        type: FAMILY_HISTORY_ACTION.DELETE_FAMILY_MEMBER,
        payload: {
            conditionIndex,
            familyMemberIndex,
        },
    };
}

interface UpdateMemberAction {
    type: FAMILY_HISTORY_ACTION.UPDATE_MEMBER;
    payload: {
        conditionIndex: string;
        familyMemberIndex: string;
        newMember: FamilyOption;
    };
}

export function updateMember(
    conditionIndex: string,
    familyMemberIndex: string,
    newMember: FamilyOption
) {
    return {
        type: FAMILY_HISTORY_ACTION.UPDATE_MEMBER,
        payload: {
            conditionIndex,
            familyMemberIndex,
            newMember,
        },
    };
}

interface ToggleCauseOfDeathOptionAction {
    type: FAMILY_HISTORY_ACTION.TOGGLE_CAUSE_OF_DEATH_OPTION;
    payload: {
        conditionIndex: string;
        familyMemberIndex: string;
        optionSelected: YesNoResponse;
    };
}

export function toggleCauseOfDeathOption(
    conditionIndex: string,
    familyMemberIndex: string,
    optionSelected: YesNoResponse
) {
    return {
        type: FAMILY_HISTORY_ACTION.TOGGLE_CAUSE_OF_DEATH_OPTION,
        payload: {
            conditionIndex,
            familyMemberIndex,
            optionSelected,
        },
    };
}

interface ToggleLivingOptionAction {
    type: FAMILY_HISTORY_ACTION.TOGGLE_LIVING_OPTION;
    payload: {
        conditionIndex: string;
        familyMemberIndex: string;
        optionSelected: YesNoResponse;
    };
}

export function toggleLivingOption(
    conditionIndex: string,
    familyMemberIndex: string,
    optionSelected: YesNoResponse
) {
    return {
        type: FAMILY_HISTORY_ACTION.TOGGLE_LIVING_OPTION,
        payload: {
            conditionIndex,
            familyMemberIndex,
            optionSelected,
        },
    };
}

interface UpdateCommentsAction {
    type: FAMILY_HISTORY_ACTION.UPDATE_COMMENTS;
    payload: {
        conditionIndex: string;
        familyMemberIndex: string;
        newComments: string;
    };
}

export function updateComments(
    conditionIndex: string,
    familyMemberIndex: string,
    newComments: string
) {
    return {
        type: FAMILY_HISTORY_ACTION.UPDATE_COMMENTS,
        payload: {
            conditionIndex,
            familyMemberIndex,
            newComments,
        },
    };
}

export interface AddConditionAction {
    type: FAMILY_HISTORY_ACTION.ADD_CONDITION;
}

export function addCondition() {
    return {
        type: FAMILY_HISTORY_ACTION.ADD_CONDITION,
    };
}

interface UpdateConditionAction {
    type: FAMILY_HISTORY_ACTION.UPDATE_CONDITION_NAME;
    payload: {
        conditionIndex: string;
        newCondition: string;
    };
}

export function updateCondition(conditionIndex: string, newCondition: string) {
    return {
        type: FAMILY_HISTORY_ACTION.UPDATE_CONDITION_NAME,
        payload: {
            conditionIndex,
            newCondition,
        },
    };
}

export interface AddFhPopOptionsAction {
    type: FAMILY_HISTORY_ACTION.ADD_FH_POP_OPTIONS;
    payload: {
        conditionIndex: string;
        conditionName: string;
    };
}

export function addFhPopOptions(
    conditionIndex: string,
    conditionName: string
): AddFhPopOptionsAction {
    return {
        type: FAMILY_HISTORY_ACTION.ADD_FH_POP_OPTIONS,
        payload: {
            conditionIndex,
            conditionName,
        },
    };
}

export type FamilyHistoryActionTypes =
    | ToggleConditionOptionAction
    | AddFamilyMemberAction
    | DeleteFamilyMemberAction
    | UpdateMemberAction
    | ToggleCauseOfDeathOptionAction
    | ToggleLivingOptionAction
    | UpdateCommentsAction
    | AddConditionAction
    | UpdateConditionAction
    | AddFhPopOptionsAction;
