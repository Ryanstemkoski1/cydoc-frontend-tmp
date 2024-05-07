import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initialHpiState } from '@redux/reducers/hpiReducer';
import { initialSurgicalHistoryState } from '@redux/reducers/surgicalHistoryReducer';
import { extractNode, joinLists } from '../../../../../../utils/getHPIText';
import HPINote from '../HPINote';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const createGraphNode = (responseType, response, medID) => ({
    uid: '',
    medID: medID,
    category: '',
    text: '',
    responseType: responseType,
    bodySystem: '',
    noteSection: '',
    doctorView: '',
    patientView: '',
    doctorCreated: '',
    blankTemplate: 'blankTemplate',
    blankYes: 'The patient does take insulin',
    blankNo: 'The patient does not currently take insulin',
    response: response,
});
const node1 = createGraphNode('MEDS-BLANK', ['ausydfg121873'], 'DML0002');

const createState = () => {
    return {
        hpi: {
            nodes: {
                DML0002: node1,
            },
            graph: {
                DML0001: ['DML0002', 'DML0003', 'DML0006'],
            },
        },
    };
};

const state = createState();

describe('extractNode suite', () => {
    test('grabs correct child node', () => {
        const parentNode = createGraphNode('YES-NO', 'YES', 'DML0001');
        const result = state.hpi.nodes[state.hpi.graph[parentNode.medID][0]];
        // Check the result
        expect(result).toEqual(node1);
    });

    test('ensures is of correct responseType', () => {
        const parentNode = createGraphNode('YES-NO', 'YES', 'DML0001');
        const responseTypes = [
            'MEDS-BLANK',
            'MEDS-POP',
            'FH-POP',
            'FH-BLANK',
            'PMH-POP',
            'PMH-BLANK',
            'PSH-BLANK',
            'PSH-POP',
        ];
        const childNode = state.hpi.nodes[state.hpi.graph[parentNode.medID][0]];

        const result =
            responseTypes.includes(childNode.responseType) &&
            Array.isArray(childNode.response) &&
            childNode.response.length !== 0;

        // Check the result
        expect(result).toEqual(true);
    });
    test('ensures skips correct parent node', () => {
        const parentNode = createGraphNode('YES-NO', 'YES', 'DML0001');
        const result = extractNode(state, parentNode);
        expect(result).toEqual(['', '', '']);
    });
    test('ensures doesnt skip upon YES/NO NO parent node', () => {
        const parentNode = createGraphNode('YES-NO', 'NO', 'DML0001');
        const result = extractNode(state, parentNode);
        expect(result).toEqual([parentNode.blankNo, '', '']);
    });
    test('ensures doesnt skip upon NO/YES YES parent node', () => {
        const parentNode = createGraphNode('NO-YES', 'YES', 'DML0001');
        const result = extractNode(state, parentNode);
        expect(result).toEqual([parentNode.blankYes, '', '']);
    });
});

const mountWithStore = (hpi = initialHpiState) => {
    const store = mockStore({
        hpi,
        surgicalHistory: initialSurgicalHistoryState,
    });
    const text = 'No history of present illness reported';
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <HPINote text={text} />
            </Provider>
        ),
    };
};

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
});
