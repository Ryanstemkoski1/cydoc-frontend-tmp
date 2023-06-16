import HPINote, {
    // findRoots,
    // sortGraph,
    joinLists,
    // isEmpty,
    // extractNode,
} from '../HPINote';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialHpiState } from 'redux/reducers/hpiReducer';
import { initialSurgicalHistoryState } from 'redux/reducers/surgicalHistoryReducer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

// const createGraphNode = (fields = {}) => ({
//     uid: '',
//     medID: '',
//     category: '',
//     text: '',
//     responseType: 'SHORT-TEXT',
//     bodySystem: '',
//     noteSection: '',
//     doctorView: '',
//     patientView: '',
//     doctorCreated: '',
//     blankTemplate: 'blankTemplate',
//     blankYes: 'blankYes',
//     blankNo: 'blankNo',
//     response: '',
//     ...fields,
// });

const mountWithStore = (hpi = initialHpiState) => {
    const store = mockStore({
        hpi,
        surgicalHistory: initialSurgicalHistoryState,
    });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <HPINote />
            </Provider>
        ),
    };
};

describe('sortGraph', () => {
    // // TODO: Fix tests below
    // it('handles empty hpi', () => {
    //     const hpi = {
    //         graph: {},
    //         edges: {},
    //         nodes: {},
    //     };
    //     sortGraph(hpi);
    //     expect(hpi).toEqual(hpi);
    // });
    // it('sorts correctly', () => {
    //     const edges = {
    //         e0: {
    //             to: 'n3',
    //             from: 'n0',
    //             toQuestionOrder: 3,
    //             fromQuestionOrder: 1,
    //         },
    //         e1: {
    //             // edge between 2 roots
    //             to: 'n1',
    //             from: 'n0',
    //             toQuestionOrder: 1,
    //             fromQuestionOrder: 1,
    //         },
    //         e2: {
    //             to: 'n2',
    //             from: 'n0',
    //             toQuestionOrder: 2,
    //             fromQuestionOrder: 1,
    //         },
    //         e3: {
    //             to: 'n4',
    //             from: 'n1',
    //             toQuestionOrder: 3,
    //             fromQuestionOrder: 1,
    //         },
    //         e4: {
    //             to: 'n5',
    //             from: 'n1',
    //             toQuestionOrder: 2,
    //             fromQuestionOrder: 1,
    //         },
    //     };
    //     const nodes = {
    //         n0: createGraphNode({ uid: 'n0' }),
    //         n1: createGraphNode({ uid: 'n1' }),
    //         n2: createGraphNode({ uid: 'n2' }),
    //         n3: createGraphNode({ uid: 'n3' }),
    //         n4: createGraphNode({ uid: 'n4' }),
    //         n5: createGraphNode({ uid: 'n5' }),
    //     };
    //     const hpi = {
    //         edges,
    //         nodes,
    //         graph: {
    //             n0: ['e0', 'e1', 'e2'],
    //             n1: ['e3', 'e4'],
    //             n2: [],
    //             n3: [],
    //             n4: [],
    //             n5: [],
    //         },
    //     };
    //     const expectedHpi = {
    //         edges,
    //         nodes,
    //         graph: {
    //             n0: ['e1', 'e2', 'e0'],
    //             n1: ['e4', 'e3'],
    //             n2: [],
    //             n3: [],
    //             n4: [],
    //             n5: [],
    //         },
    //     };
    //     sortGraph(hpi);
    //     expect(hpi).toEqual(expectedHpi);
    // });
});

describe('findRoots', () => {
    // // TODO: Fix below tests
    // it('handles empty hpi', () => {
    //     const hpi = {
    //         graph: {},
    //         edges: {},
    //         nodes: {},
    //     };
    //     expect(findRoots(hpi)).toEqual(new Set());
    // });
    // it('finds all roots', () => {
    //     const hpi = {
    //         edges: {
    //             e0: {
    //                 to: 'n3',
    //                 from: 'n0',
    //                 toQuestionOrder: 3,
    //                 fromQuestionOrder: 1,
    //             },
    //             e1: {
    //                 to: 'n5',
    //                 from: 'n1',
    //                 toQuestionOrder: 1,
    //                 fromQuestionOrder: 1,
    //             },
    //             e2: {
    //                 to: 'n0',
    //                 from: 'n4',
    //                 toQuestionOrder: 1,
    //                 fromQuestionOrder: 1,
    //             },
    //         },
    //         nodes: {
    //             n0: createGraphNode({ uid: 'n0' }),
    //             n1: createGraphNode({ uid: 'n1' }),
    //             n2: createGraphNode({ uid: 'n2' }),
    //             n3: createGraphNode({ uid: 'n3' }),
    //             n4: createGraphNode({ uid: 'n4' }),
    //             n5: createGraphNode({ uid: 'n5' }),
    //         },
    //         graph: {
    //             n0: ['e0'],
    //             n1: ['e1'],
    //             n2: [],
    //             n3: [],
    //             n4: ['e2'],
    //             n5: [],
    //         },
    //     };
    //     const expectedRoots = new Set(['n1', 'n2', 'n4']);
    //     expect(findRoots(hpi)).toEqual(expectedRoots);
    // });
});

describe('joinLists', () => {
    it('handles empty list', () => {
        expect(joinLists([])).toEqual('');
    });

    it('handles 1 item', () => {
        expect(joinLists(['a'])).toEqual('a');
    });

    it('handles 2 items', () => {
        const items = ['a', 'b'];
        expect(joinLists(items)).toEqual('a and b');
    });

    it('handles >2 items', () => {
        const items = ['a', 'b', 'c'];
        expect(joinLists(items)).toEqual('a, b, and c');
    });

    it('handles custom lastSeparate', () => {
        const items = ['a', 'b', 'c', 'd'];
        expect(joinLists(items, 'or')).toEqual('a, b, c, or d');
    });
});

describe('isEmpty', () => {
    // // TODO: Fix below tests
    // it('detects empty yes-no questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'YES-NO',
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty yes-no questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'YES-NO',
    //         response: 'YES',
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
    // it('detects empty number questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'NUMBER',
    //         response: null,
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty number questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'NUMBER',
    //         response: 100,
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
    // it('detects empty list-text questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'LIST-TEXT',
    //         response: {},
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty list-text questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'LIST-TEXT',
    //         response: { foo: 'bar' },
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
    // it('detects empty body-location questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'BODYLOCATION',
    //         response: {},
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty body-location questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'BODYLOCATION',
    //         response: { foo: true },
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
    // it('detects empty time3days questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'TIME3DAYS',
    //         response: { numInput: null, timeOption: '' },
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty time3days questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'TIME3DAYS',
    //         response: { numInput: 100, timeOption: 'days' },
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
    // it('detects empty short-text questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'SHORT-TEXT',
    //         response: '',
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty short-text questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'TIME3DAYS',
    //         response: 'foo',
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
    // it('detects empty string[] questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'MED-POP',
    //         response: [],
    //     });
    //     expect(isEmpty(node)).toEqual(true);
    // });
    // it('detects non-empty string[] questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'MED-POP',
    //         response: ['foo'],
    //     });
    //     expect(isEmpty(node)).toEqual(false);
    // });
});

describe('extractNode', () => {
    // // TODO: Fix below tests
    // it('handles yes-no question with no response', () => {
    //     const node = createGraphNode({
    //         responseType: 'YES-NO',
    //         response: 'NO',
    //     });
    //     expect(extractNode(node)).toEqual(['blankNo', '']);
    // });
    // it('handles yes-no question with yes response', () => {
    //     const node = createGraphNode({
    //         responseType: 'YES-NO',
    //         response: 'YES',
    //     });
    //     expect(extractNode(node)).toEqual(['blankYes', '']);
    // });
    // it('handles number questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'NUMBER',
    //         response: 100,
    //     });
    //     expect(extractNode(node)).toEqual(['blankTemplate', '100']);
    // });
    // it('handles time3days questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'TIME3DAYS',
    //         response: { numInput: 100, timeOption: 'days' },
    //     });
    //     expect(extractNode(node)).toEqual(['blankTemplate', '100 days']);
    // });
    // it('handles short-text questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'SHORT-TEXT',
    //         response: 'answer',
    //     });
    //     expect(extractNode(node)).toEqual(['blankTemplate', 'answer']);
    // });
    // it('handles string[] positive questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'MED-POP',
    //         response: ['a', 'b', 'c'],
    //     });
    //     expect(extractNode(node)).toEqual(['blankTemplate', 'a, b, and c']);
    // });
    // it('handles string[] negative questions', () => {
    //     const node = createGraphNode({
    //         responseType: 'MED-POP',
    //         blankTemplate: 'blank NOTANSWER',
    //         response: ['a', 'b', 'c'],
    //     });
    //     expect(extractNode(node)).toEqual(['blank NOTANSWER', 'a, b, or c']);
    // });
});

describe('HPINote', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('handles empty hpi', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toContain(
            'No history of present illness reported'
        );
    });

    // // TODO: Fix below tests
    // it('renders hpi', () => {
    //     const edges = {
    //         e0: {
    //             to: 'n2',
    //             from: 'n0',
    //             toQuestionOrder: 2,
    //             fromQuestionOrder: 1,
    //         },
    //         e1: {
    //             // edge between 2 roots
    //             to: 'n1',
    //             from: 'n0',
    //             toQuestionOrder: 1,
    //             fromQuestionOrder: 1,
    //         },
    //     };
    //     const nodes = {
    //         n0: createGraphNode({ uid: 'n0' }),
    //         n1: createGraphNode({ uid: 'n1' }),
    //         n2: createGraphNode({ uid: 'n2' }),
    //     };
    //     const { wrapper } = mountWithStore({
    //         edges,
    //         nodes,
    //         graph: {
    //             n0: ['e0', 'e1'],
    //             n1: [],
    //             n2: [],
    //         },
    //     });
    //     expect(wrapper.html()).not.toContain(
    //         'No history of present illness reported'
    //     );
    // });
});
