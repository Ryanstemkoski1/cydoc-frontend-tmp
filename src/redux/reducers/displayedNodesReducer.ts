import { DISPLAYED_NODES_ACTION } from 'redux/actions/actionTypes';
import { DisplayedNodesActionTypes } from 'redux/actions/displayedNodesActions';

export interface displayedNodesState {
    [chiefComplaint: string]: string[];
    allNodes: string[];
}

export const displayedNodesCutOff = 26;

export const initialDisplayedNodesState: displayedNodesState = { allNodes: [] };

export interface displayedNodesProps {
    displayedNodes: displayedNodesState;
}

export function displayedNodesReducer(
    state = initialDisplayedNodesState,
    action: DisplayedNodesActionTypes
) {
    switch (action.type) {
        case DISPLAYED_NODES_ACTION.ADD_DISPLAYED_NODES: {
            const { category, nodes } = action.payload,
                currNodes = category in state ? state[category] : [];
            return {
                ...state,
                [category]: [
                    ...currNodes,
                    ...nodes.filter((node) => !currNodes.includes(node)),
                ],
                allNodes: [...new Set([...state.allNodes, ...nodes])],
            };
        }

        case DISPLAYED_NODES_ACTION.REMOVE_ALL_NODES: {
            const { [action.payload.category]: nodes, ...res } = state;
            return {
                ...res,
                allNodes: res.allNodes.filter((node) => !nodes.includes(node)),
            };
        }

        case DISPLAYED_NODES_ACTION.REMOVE_DISPLAYED_NODES: {
            const { category, nodes } = action.payload;
            return {
                ...state,
                [category]: state[category].filter(
                    (node) => !nodes.includes(node)
                ),
                allNodes: state.allNodes.filter(
                    (node) => !nodes.includes(node)
                ),
            };
        }

        default:
            return state;
    }
}
