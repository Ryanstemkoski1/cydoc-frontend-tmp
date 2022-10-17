import { initialHpiState, medId, hpiReducer } from './hpiReducer';
import { HPI_ACTION } from '../actions/actionTypes';
import {
    BodyLocationOptions,
    ExpectedResponseDict,
    options,
} from 'constants/hpiEnums';

describe('hpi reducers', () => {
    const processedState = {
        graph: {},
        nodes: {
            [medId]: {
                uid: 'uid',
                medID: 'medID',
                category: 'category',
                text: 'text',
                responseType: 'responseType',
                bodySystem: 'bodySystem',
                noteSection: 'noteSection',
                DoctorView: 'DoctorView',
                PatientView: 'PatientView',
                doctorCreated: 'doctorCreated',
                response: 'response',
            },
        },
        edges: {},
    };
    describe('initial state', () => {
        it('returns the initial state', () => {
            const action = { type: 'dummy_action' };
            expect(hpiReducer(undefined, action)).toEqual(initialHpiState);
        });
    });
    describe('process knowledge graph', () => {
        it('processes knowledge graph', () => {
            const order = {
                1: medId,
                2: 'foo2',
                3: 'foo1',
                4: 'foo3',
            };
            const graph = {
                [medId]: [1, 2],
                foo1: [3],
                foo2: [],
                foo3: [],
            };
            const nodes = {
                [medId]: {
                    uid: 'uid',
                    medID: medId,
                    category: 'category',
                    text: 'text',
                    responseType: 'BODYLOCATION',
                    bodySystem: 'bodySystem',
                    noteSection: 'noteSection',
                    doctorView: 'DoctorView',
                    patientView: 'PatientView',
                    doctorCreated: 'doctorCreated',
                    response: ExpectedResponseDict['BODYLOCATION'],
                    blankTemplate: 'blankTemplate',
                    blankYes: 'blankYes',
                    blankNo: 'blankNo',
                },
                foo1: {},
                foo2: {},
                foo3: {},
            };
            const edges = {
                1: {
                    to: 'foo1',
                    from: medId,
                    toQuestionOrder: 3,
                    fromQuestionOrder: 1,
                },
                2: {
                    to: 'foo2',
                    from: medId,
                    toQuestionOrder: 2,
                    fromQuestionOrder: 1,
                },
                3: {
                    to: 'foo3',
                    from: 'foo1',
                    toQuestionOrder: 4,
                    fromQuestionOrder: 3,
                },
            };
            const graphData = {
                order: order,
                graph: graph,
                nodes: nodes,
                edges: edges,
            };
            const payload = {
                graphData: graphData,
            };
            let nextState = hpiReducer(initialHpiState, {
                type: HPI_ACTION.PROCESS_KNOWLEDGE_GRAPH,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            options
                .reduce((a, b) => a.concat(b), [])
                .map((bodyOptionItem) => {
                    expect(nextState.nodes[medId].response).toHaveProperty(
                        bodyOptionItem.name
                    );
                    expect(
                        nextState.nodes[medId].response[bodyOptionItem.name]
                    ).toEqual(
                        bodyOptionItem.needsRightLeft
                            ? { left: false, center: false, right: false }
                            : false
                    );
                });
            const edgeKeys = {
                [medId]: ['foo2', 'foo1'],
                foo1: ['foo3'],
                foo2: [],
                foo3: [],
            };
            Object.keys(graph).map((key) => {
                expect(nextState.nodes).toHaveProperty(key);
                expect(nextState.graph).toHaveProperty(key);
                expect(nextState.nodes[key]).toMatchObject(nodes[key]);
                expect(nextState.graph[key]).toEqual(edgeKeys[key]);
            });
        });
    });
    describe('handle user actions', () => {
        let payload = {};
        let nextState = {};
        beforeEach(() => {
            payload = { medId: medId };
            nextState = processedState;
        });
        it('handles body location toggle for LRButton', () => {
            nextState.nodes.medId.responseType = 'BODYLOCATION';
            nextState.nodes.medId.response =
                ExpectedResponseDict['BODYLOCATION'];
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_RESPONSE,
                payload: {
                    medId: medId,
                    bodyOptions: options,
                },
            });
            expect(nextState).toMatchSnapshot();
            payload.bodyOption = BodyLocationOptions.ANKLE;
            ['left', 'center', 'right'].map((toggle) => {
                payload.toggle = toggle;
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                    payload,
                });
                expect(
                    nextState.nodes[medId].response[payload.bodyOption]
                ).toHaveProperty(payload.toggle);
                expect(
                    nextState.nodes[medId].response[payload.bodyOption][
                        payload.toggle
                    ]
                ).toEqual(true);
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                    payload,
                });
                expect(
                    nextState.nodes[medId].response[payload.bodyOption][
                        payload.toggle
                    ]
                ).toEqual(false);
            });
        });
        it('handles body location toggle for regular button', () => {
            nextState.nodes.medId.responseType = 'BODYLOCATION';
            nextState.nodes.medId.response =
                ExpectedResponseDict['BODYLOCATION'];
            payload.bodyOption = BodyLocationOptions.NOSE;
            payload.toggle = null;
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(nextState.nodes[medId].response[payload.bodyOption]).toEqual(
                true
            );
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                payload,
            });
            expect(nextState.nodes[medId].response[payload.bodyOption]).toEqual(
                false
            );
        });
        it('handles multiple choice click', () => {
            nextState.nodes[medId].response = ExpectedResponseDict.CLICK_BOXES;
            nextState.nodes[medId].responseType = 'CLICK-BOXES';
            [...Array(10).keys()].map((i) => {
                payload.name = 'foo' + i.toString();
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK,
                    payload,
                });
                expect(nextState.nodes[medId].response).toHaveProperty(
                    payload.name
                );
                expect(nextState.nodes[medId].response[payload.name]).toEqual(
                    true
                );
            });
            expect(nextState).toMatchSnapshot();
            // opposite direction
            [...Array(10).keys()].map((i) => {
                payload.name = 'foo' + (9 - i).toString();
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK,
                    payload,
                });
                expect(nextState.nodes[medId].response[payload.name]).toEqual(
                    false
                );
            });
        });
        it('handles input change', () => {
            payload.textInput = 'foo';
            nextState.nodes[medId].responseType = 'SHORT-TEXT';
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.HANDLE_INPUT_CHANGE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(nextState.nodes[medId].response).toEqual(payload.textInput);
        });
        it('handles numeric input change', () => {
            payload.input = 42;
            nextState.nodes[medId].responseType = 'NUMBER';
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.HANDLE_NUMERIC_INPUT_CHANGE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(nextState.nodes[medId].response).toEqual(payload.input);
        });
        describe('handles list text actions', () => {
            const uuid = 'foo';
            const listTextResponse = {
                1: '1',
                2: '2',
                3: '3',
            };
            it('handles changing list text input', () => {
                nextState.nodes[medId].responseType = 'LIST-TEXT';
                nextState.nodes[medId].response = listTextResponse;
                payload.uuid = uuid;
                payload.textInput = 'foo';
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.LIST_TEXT_HANDLE_CHANGE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response).toHaveProperty(
                    payload.uuid
                );
                expect(nextState.nodes[medId].response[payload.uuid]).toEqual(
                    payload.textInput
                );
            });
            it('handles removing list text input', () => {
                payload.uuid = uuid;
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.REMOVE_LIST_INPUT,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response).not.toHaveProperty(
                    payload.uuid
                );
                expect(nextState.nodes[medId].response).toMatchObject(
                    listTextResponse
                );
            });
            it('handles adding list text input', () => {
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.ADD_LIST_INPUT,
                    payload,
                });
                expect(
                    Object.keys(nextState.nodes[medId].response).length
                ).toEqual(4);
            });
        });
        describe('handles time input actions', () => {
            it('handles time input change', () => {
                nextState.nodes[medId].responseType = 'TIME3DAYS';
                nextState.nodes[medId].response = {
                    numInput: 0,
                    timeOption: 'minutes',
                };
                payload.numInput = 42;
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.HANDLE_TIME_INPUT_CHANGE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response.numInput).toEqual(
                    payload.numInput
                );
            });
            it('handles time option change', () => {
                payload.timeOption = 'days';
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.HANDLE_TIME_OPTION_CHANGE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response.timeOption).toEqual(
                    payload.timeOption
                );
            });
        });
        describe('handles yes no actions', () => {
            it('handles each toggle', () => {
                nextState.nodes[medId].responseType = 'YES-NO';
                ['Yes', 'No'].map((option) => {
                    payload.optionSelected = option;
                    nextState = hpiReducer(nextState, {
                        type: HPI_ACTION.YES_NO_TOGGLE_OPTION,
                        payload,
                    });
                    expect(nextState.nodes[medId].response).toEqual(
                        payload.optionSelected
                    );
                    nextState = hpiReducer(nextState, {
                        type: HPI_ACTION.YES_NO_TOGGLE_OPTION,
                        payload,
                    });
                    expect(nextState.nodes[medId].response).toEqual('');
                });
                expect(nextState).toMatchSnapshot();
            });
        });
        describe('handles scale input actions', () => {
            it('handles scale handle value', () => {
                nextState.nodes[medId].responseType = 'SCALE1TO10';
                payload.value = 3;
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.SCALE_HANDLE_VALUE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response).toEqual(payload.value);
            });
            it('handles scale handle clear', () => {
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.SCALE_HANDLE_CLEAR,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response).toBeUndefined();
            });
        });
        describe('handles blank widget questions', () => {
            it('handles new blank response', () => {
                nextState.nodes[medId].responseType = 'FH-BLANK';
                nextState.nodes[medId].response =
                    ExpectedResponseDict['FH_BLANK'];
                payload = { medId: medId, conditionId: 'foo' };
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.HANDLE_BLANK_QUESTION_CHANGE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response).toContain(
                    payload.conditionId
                );
            });
        });
        describe('handles pop response questions', () => {
            it('handles new pop response', () => {
                nextState.nodes[medId].responseType = 'FH-POP';
                nextState.nodes[medId].response =
                    ExpectedResponseDict['FH_POP'];
                payload = { medId: medId, conditionIds: ['foo1', 'foo2'] };
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.POP_RESPONSE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(nextState.nodes[medId].response).toMatchObject(
                    payload.conditionIds
                );
            });
        });
        describe('handles lab test input actions', () => {
            let nextState = {};
            it('returns node with lab test', () => {
                const order = {
                    1: medId,
                    2: 'foo2',
                    3: 'foo1',
                    4: 'foo3',
                };
                const graph = {
                    [medId]: [1, 2],
                    foo1: [3],
                    foo2: [],
                    foo3: [],
                };
                const nodes = {
                    [medId]: {
                        uid: 'uid',
                        medID: medId,
                        category: 'category',
                        text: 'text',
                        responseType: 'BODYLOCATION',
                        bodySystem: 'bodySystem',
                        noteSection: 'noteSection',
                        doctorView: 'DoctorView',
                        patientView: 'PatientView',
                        doctorCreated: 'doctorCreated',
                        response: ExpectedResponseDict['BODYLOCATION'],
                        blankTemplate: 'blankTemplate',
                        blankYes: 'blankYes',
                        blankNo: 'blankNo',
                    },
                    foo1: {},
                    foo2: {},
                    foo3: {},
                };
                const edges = {
                    1: {
                        to: 'foo1',
                        from: medId,
                        toQuestionOrder: 3,
                        fromQuestionOrder: 1,
                    },
                    2: {
                        to: 'foo2',
                        from: medId,
                        toQuestionOrder: 2,
                        fromQuestionOrder: 1,
                    },
                    3: {
                        to: 'foo3',
                        from: 'foo1',
                        toQuestionOrder: 4,
                        fromQuestionOrder: 3,
                    },
                };
                const graphData = {
                    order: order,
                    graph: graph,
                    nodes: nodes,
                    edges: edges,
                };
                const payload = {
                    graphData: graphData,
                };
                nodes[medId].responseType = 'LABORATORY-TEST';
                nodes[medId].text =
                    'NAME[vitamin B12 level] SNOMED[14598005] COMPONENTS_AND_UNITS[vitamin B12 level HASUNITS picogram/milliliter # picomole/liter # nanogram/liter]';
                nextState = hpiReducer(initialHpiState, {
                    type: HPI_ACTION.PROCESS_KNOWLEDGE_GRAPH,
                    payload,
                });
                const updatedResponse = nextState.nodes[medId].response;
                expect(nextState).toMatchSnapshot();
                expect(updatedResponse.name).toEqual('vitamin B12 level');
                expect(updatedResponse.snomed).toEqual('14598005');
                expect(updatedResponse.components).toHaveProperty(
                    'vitamin B12 level'
                );
                expect(
                    updatedResponse.components['vitamin B12 level'].unit
                ).toEqual(
                    'picogram/milliliter # picomole/liter # nanogram/liter'
                );
                expect(
                    updatedResponse.components['vitamin B12 level'].unitOptions
                ).toEqual([
                    'picogram/milliliter',
                    'picomole/liter',
                    'nanogram/liter',
                ]);
            });
            it('handles value input change', () => {
                payload.component = 'vitamin B12 level';
                payload.value = '5';
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.ADD_NODE,
                    payload,
                });
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.LAB_TEST_INPUT_CHANGE,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(
                    nextState.nodes[medId].response.components[
                        'vitamin B12 level'
                    ].value
                ).toEqual(payload.value);
            });
            it('handles unit option change', () => {
                payload.component = 'vitamin B12 level';
                payload.unit = 'picogram/milliliter';
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.LAB_TEST_HANDLE_CLICK,
                    payload,
                });
                expect(nextState).toMatchSnapshot();
                expect(
                    nextState.nodes[medId].response.components[
                        'vitamin B12 level'
                    ].unit
                ).toEqual(payload.unit);
            });
        });
    });
});
