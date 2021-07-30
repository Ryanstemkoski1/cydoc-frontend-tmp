import { initialHpiState, medId, hpiReducer } from './hpiReducer';
import { HPI_ACTION } from '../actions/actionTypes';
import { BodyLocationOptions, ExpectedResponseDict } from 'constants/hpiEnums';
import { options } from 'pages/EditNote/content/hpi/knowledgegraph/src/components/responseComponents/BodyLocation';

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
    describe('add node, graph and edge', () => {
        it('returns node with response', () => {
            const node = {
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
            };
            const edges = [
                {
                    to: 'foo1',
                    from: 'foo2',
                    toQuestionOrder: -1,
                    fromQuestionOrder: -1,
                },
                {
                    to: 'foo3',
                    from: 'foo2',
                    toQuestionOrder: -1,
                    fromQuestionOrder: -1,
                },
            ];
            const edgeKeys = edges.map(
                (edge) => 'to' + edge.to + 'from' + edge.from
            );
            const responseNode = {
                response: node.response,
                responseType: node.responseType,
                text: node.text,
                blankYes: node.blankYes,
                blankNo: node.blankNo,
                blankTemplate: node.blankTemplate,
            };
            const payload = {
                medId: medId,
                node: node,
                edges: edges,
            };
            const nextState = hpiReducer(initialHpiState, {
                type: HPI_ACTION.ADD_NODE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(nextState.nodes).toHaveProperty(medId);
            expect(nextState.nodes[medId]).toMatchObject(responseNode);
            expect(nextState.graph).toHaveProperty(medId);
            expect(nextState.graph[medId]).toEqual(edgeKeys);
            edgeKeys.map((edge, index) => {
                expect(nextState.edges).toHaveProperty(edge);
                expect(nextState.edges[edge]).toMatchObject(edges[index]);
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
        it('adds body location responses', () => {
            payload.bodyOptions = options;
            nextState.nodes[medId].responseType = 'BODYLOCATION';
            nextState.nodes[medId].response = ExpectedResponseDict.BODYLOCATION;
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_RESPONSE,
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
        });
        it('handles body location toggle for LRButton', () => {
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
                expect(nextState.nodes[medId].response).toContain(payload.name);
            });
            expect(nextState).toMatchSnapshot();
            // opposite direction
            [...Array(10).keys()].map((i) => {
                payload.name = 'foo' + (9 - i).toString();
                nextState = hpiReducer(nextState, {
                    type: HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK,
                    payload,
                });
                expect(nextState.nodes[medId].response).not.toContain(
                    payload.name
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
        describe('handles blank widget questions', () => {
            it('handles new blank response', () => {
                nextState.nodes[medId].responseType = 'FH-BLANK';
                nextState.nodes[medId].response =
                    ExpectedResponseDict['FH_BLANK'];
                payload = { medId: medId, conditionId: 'foo' };
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.HANDLE_BLANK_QUESTION_CHANGE,
                        payload,
                    })
                ).toMatchSnapshot();
            });
        });
        describe('handles pop response questions', () => {
            it('handles new pop response', () => {
                nextState.nodes[medId].responseType = 'FH-POP';
                nextState.nodes[medId].response =
                    ExpectedResponseDict['FH_POP'];
                payload = { medId: medId, conditionIds: ['foo1', 'foo2'] };
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.POP_RESPONSE,
                        payload,
                    })
                ).toMatchSnapshot();
            });
        });
    });
});
