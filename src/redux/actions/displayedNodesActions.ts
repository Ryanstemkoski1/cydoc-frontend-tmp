import { DISPLAYED_NODES_ACTION } from './actionTypes';

export interface AddDisplayedNodesAction {
    type: DISPLAYED_NODES_ACTION.ADD_DISPLAYED_NODES;
    payload: {
        category: string;
        nodes: string[];
    };
}

export function addDisplayedNodes(
    category: string,
    nodes: string[]
): AddDisplayedNodesAction {
    return {
        type: DISPLAYED_NODES_ACTION.ADD_DISPLAYED_NODES,
        payload: {
            category,
            nodes,
        },
    };
}

export interface RemoveAllNodesAction {
    type: DISPLAYED_NODES_ACTION.REMOVE_ALL_NODES;
    payload: {
        category: string;
    };
}

export function removeAllNodes(category: string): RemoveAllNodesAction {
    return {
        type: DISPLAYED_NODES_ACTION.REMOVE_ALL_NODES,
        payload: {
            category,
        },
    };
}

export interface RemoveDisplayedNodesAction {
    type: DISPLAYED_NODES_ACTION.REMOVE_DISPLAYED_NODES;
    payload: {
        category: string;
        nodes: string[];
    };
}

export function removeDisplayedNodes(
    category: string,
    nodes: string[]
): RemoveDisplayedNodesAction {
    return {
        type: DISPLAYED_NODES_ACTION.REMOVE_DISPLAYED_NODES,
        payload: {
            category,
            nodes,
        },
    };
}

export type DisplayedNodesActionTypes =
    | AddDisplayedNodesAction
    | RemoveAllNodesAction
    | RemoveDisplayedNodesAction;
