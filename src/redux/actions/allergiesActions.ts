import { ALLERGIES_ACTION } from './actionTypes';

interface HasAllergiesAction {
    type: ALLERGIES_ACTION.HAS_ALLERGIES;
    payload: {
        hasAllergies: boolean;
    };
}

export function toggleHasAllergies(state: boolean): HasAllergiesAction {
    return {
        type: ALLERGIES_ACTION.HAS_ALLERGIES,
        payload: {
            hasAllergies: state,
        },
    };
}

interface UpdateIncitingAgentAction {
    type: ALLERGIES_ACTION.UPDATE_INCITING_AGENT;
    payload: {
        index: string;
        newIncitingAgent: string;
    };
}

export function updateIncitingAgent(index: string, newIncitingAgent: string) {
    return {
        type: ALLERGIES_ACTION.UPDATE_INCITING_AGENT,
        payload: {
            index,
            newIncitingAgent,
        },
    };
}

interface UpdateReactionAction {
    type: ALLERGIES_ACTION.UPDATE_REACTION;
    payload: {
        index: string;
        newReaction: string;
    };
}

export function updateReaction(index: string, newReaction: string) {
    return {
        type: ALLERGIES_ACTION.UPDATE_REACTION,
        payload: {
            index,
            newReaction,
        },
    };
}

interface UpdateCommentsAction {
    type: ALLERGIES_ACTION.UPDATE_COMMENTS;
    payload: {
        index: string;
        newComments: string;
    };
}

export function updateComments(index: string, newComments: string) {
    return {
        type: ALLERGIES_ACTION.UPDATE_COMMENTS,
        payload: {
            index,
            newComments,
        },
    };
}

interface UpdateIdAction {
    type: ALLERGIES_ACTION.UPDATE_ID;
    payload: {
        index: string;
        id: string;
    };
}

export function updateId(index: string, id: string) {
    return {
        type: ALLERGIES_ACTION.UPDATE_ID,
        payload: {
            index,
            id,
        },
    };
}

interface AddAllergyAction {
    type: ALLERGIES_ACTION.ADD_ALLERGY;
}

export function addAllergy() {
    return {
        type: ALLERGIES_ACTION.ADD_ALLERGY,
    };
}

interface DeleteAllergyAction {
    type: ALLERGIES_ACTION.DELETE_ALLERGY;
    payload: {
        index: string;
    };
}

export function deleteAllergy(index: string) {
    return {
        type: ALLERGIES_ACTION.DELETE_ALLERGY,
        payload: {
            index,
        },
    };
}

export type AllergiesActionTypes =
    | HasAllergiesAction
    | UpdateIncitingAgentAction
    | UpdateReactionAction
    | UpdateCommentsAction
    | UpdateIdAction
    | AddAllergyAction
    | DeleteAllergyAction;
