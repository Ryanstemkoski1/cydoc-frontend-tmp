import { DISPLAYED_NODES_ACTION } from 'redux/actions/actionTypes';
import {
    displayedNodesReducer,
    initialDisplayedNodesState,
} from './displayedNodesReducer';

describe('initial state', () => {
    it('returns initial state', () => {
        const action = { type: 'dummy_action' };
        expect(displayedNodesReducer(undefined, action)).toEqual(
            initialDisplayedNodesState
        );
    });
});

describe('add and remove displayed nodes', () => {
    let nextState = initialDisplayedNodesState;
    it('adds displayed node to empty state', () => {
        const foo = 'foo1';
        const payload = {
            category: 'foo',
            nodesArr: [foo],
            nodes: {
                [foo]: {
                    text: foo,
                },
            },
        };
        nextState = displayedNodesReducer(initialDisplayedNodesState, {
            type: DISPLAYED_NODES_ACTION.ADD_DISPLAYED_NODES,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toHaveProperty(payload.category);
        expect(nextState[payload.category]).toContain(foo);
        expect(nextState.allNodes).toContain(foo);
        expect(nextState.notDisplayed).not.toContain(foo);
    });
    it('adds displayed node to existing state', () => {
        const foo = 'foo2';
        const payload = {
            category: 'foo',
            nodesArr: [foo],
            nodes: {
                [foo]: {
                    text: foo,
                },
            },
        };
        nextState = displayedNodesReducer(nextState, {
            type: DISPLAYED_NODES_ACTION.ADD_DISPLAYED_NODES,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toHaveProperty(payload.category);
        expect(nextState[payload.category]).toContain(foo);
        expect(nextState.allNodes).toContain(foo);
        expect(nextState.notDisplayed).not.toContain(foo);
    });
    it('adds not displayed node', () => {
        const foo = 'foo3';
        const payload = {
            category: 'foo',
            nodesArr: [foo],
            nodes: {
                [foo]: {
                    text: 'nan',
                },
            },
        };
        nextState = displayedNodesReducer(nextState, {
            type: DISPLAYED_NODES_ACTION.ADD_DISPLAYED_NODES,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toHaveProperty(payload.category);
        expect(nextState[payload.category]).toContain(foo);
        expect(nextState.allNodes).toContain(foo);
        expect(nextState.notDisplayed).toContain(foo);
    });
    const tempState = nextState;
    it('removes all nodes associated with category', () => {
        const payload = {
            category: 'foo',
        };
        const nextState1 = displayedNodesReducer(tempState, {
            type: DISPLAYED_NODES_ACTION.REMOVE_ALL_NODES,
            payload,
        });
        expect(nextState1).toMatchSnapshot();
        expect(nextState1).not.toHaveProperty(payload.category);
        ['foo1', 'foo2', 'foo3'].map((foo) =>
            expect(nextState1.allNodes).not.toContain(foo)
        );
        expect(nextState1.notDisplayed).not.toContain('foo3');
    });
    it('removes chosen displayed nodes', () => {
        const payload = {
            category: 'foo',
            nodes: ['foo1', 'foo3'],
        };
        const nextState2 = displayedNodesReducer(nextState, {
            type: DISPLAYED_NODES_ACTION.REMOVE_DISPLAYED_NODES,
            payload,
        });
        expect(nextState2).toMatchSnapshot();
        expect(nextState2).toHaveProperty(payload.category);
        expect(nextState2[payload.category]).not.toContain('foo1');
        expect(nextState2[payload.category]).toContain('foo2');
        expect(nextState2[payload.category]).not.toContain('foo3');
        expect(nextState2.allNodes).not.toContain('foo1');
        expect(nextState2.allNodes).toContain('foo2');
        expect(nextState2.allNodes).not.toContain('foo3');
        expect(nextState2.notDisplayed).not.toContain('foo3');
    });
});
