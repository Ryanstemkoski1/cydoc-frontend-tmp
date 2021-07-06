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
    describe('add node', () => {
        it('returns node with response', () => {
            const node = {
                uid: 'uid',
                medID: medId,
                category: 'category',
                text: 'text',
                responseType: 'responseType',
                bodySystem: 'bodySystem',
                noteSection: 'noteSection',
                DoctorView: 'DoctorView',
                PatientView: 'PatientView',
                doctorCreated: 'doctorCreated',
                response: 'response',
            };
            const payload = {
                medId: medId,
                node: node,
            };
            const nextState = hpiReducer(initialHpiState, {
                type: HPI_ACTION.ADD_NODE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(nextState.nodes[medId]).toBeTruthy();
        });
    });
    describe('add edge', () => {
        it('returns correct state with edge info', () => {
            const edge = {
                to: 'foo1',
                from: 'foo2',
                toQuestionOrder: -1,
                fromQuestionOrder: -1,
            };
            const payload = {
                medId: medId,
                edge: edge,
            };
            const nextState = hpiReducer(initialHpiState, {
                type: HPI_ACTION.ADD_EDGE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(nextState.graph[medId]).toBeTruthy();
            const newEdge = Object.keys(nextState.edges)[0];
            expect(nextState.graph[medId]).toContain(newEdge);
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
            nextState.nodes[medId].response =
                ExpectedResponseDict['BODYLOCATION'];
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_RESPONSE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
        });
        it('handles body location toggle for LRButton', () => {
            nextState.nodes[medId].responseType = 'BODYLOCATION';
            nextState.nodes[medId].response =
                ExpectedResponseDict['BODYLOCATION'];
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_RESPONSE,
                payload: {
                    medId: medId,
                    bodyOptions: options,
                },
            });
            payload.bodyOption = BodyLocationOptions.ANKLE;
            payload.toggle = 'left';
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(
                nextState.nodes[medId].response[payload.bodyOption][
                    payload.toggle
                ]
            ).toBeTruthy();
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                payload,
            });
            expect(
                nextState.nodes[medId].response[payload.bodyOption][
                    payload.toggle
                ]
            ).toBeFalsy();
        });
        it('handles body location toggle for regular button', () => {
            nextState.nodes[medId].responseType = 'BODYLOCATION';
            nextState.nodes[medId].response =
                ExpectedResponseDict['BODYLOCATION'];
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_RESPONSE,
                payload: {
                    medId: medId,
                    bodyOptions: options,
                },
            });
            payload.bodyOption = BodyLocationOptions.NOSE;
            payload.toggle = null;
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                payload,
            });
            expect(nextState).toMatchSnapshot();
            expect(
                nextState.nodes[medId].response[payload.bodyOption]
            ).toBeTruthy();
            nextState = hpiReducer(nextState, {
                type: HPI_ACTION.BODY_LOCATION_HANDLE_TOGGLE,
                payload,
            });
            expect(
                nextState.nodes[medId].response[payload.bodyOption]
            ).toBeFalsy();
        });
        it('handles multiple choice click', () => {
            payload.name = 'foo';
            nextState.nodes[medId].response = ['foo1'];
            nextState.nodes[medId].responseType = 'CLICK-BOXES';
            expect(
                hpiReducer(nextState, {
                    type: HPI_ACTION.MULTIPLE_CHOICE_HANDLE_CLICK,
                    payload,
                })
            ).toMatchSnapshot();
        });
        it('handles input change', () => {
            payload.textInput = 'foo';
            nextState.nodes[medId].responseType = 'SHORT-TEXT';
            expect(
                hpiReducer(nextState, {
                    type: HPI_ACTION.HANDLE_INPUT_CHANGE,
                    payload,
                })
            ).toMatchSnapshot();
        });
        it('handles numeric input change', () => {
            payload.input = 42;
            nextState.nodes[medId].responseType = 'NUMBER';
            expect(
                hpiReducer(nextState, {
                    type: HPI_ACTION.HANDLE_NUMERIC_INPUT_CHANGE,
                    payload,
                })
            ).toMatchSnapshot();
        });
        describe('handles list text actions', () => {
            const uuid = 'foo';
            const listTextResponse = {
                foo: '',
                1: '1',
                2: '2',
                3: '3',
            };
            beforeEach(() => {
                nextState.nodes[medId].responseType = 'LIST-TEXT';
                nextState.nodes[medId].response = listTextResponse;
            });
            it('handles changing list text input', () => {
                payload.uuid = uuid;
                payload.textInput = 'foo';
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.LIST_TEXT_HANDLE_CHANGE,
                        payload,
                    })
                ).toMatchSnapshot();
            });
            it('handles removing list text input', () => {
                payload.uuid = uuid;
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.REMOVE_LIST_INPUT,
                        payload,
                    })
                ).toMatchSnapshot();
            });
            it('handles adding list text input', () => {
                const newResponse = hpiReducer(nextState, {
                    type: HPI_ACTION.ADD_LIST_INPUT,
                    payload,
                }).nodes[medId].response;
                expect(Object.keys(newResponse).length).toEqual(5);
                expect(uuid in newResponse).toBeTruthy();
            });
        });
        describe('handles time input actions', () => {
            beforeEach(() => {
                nextState.nodes[medId].responseType = 'TIME3DAYS';
                nextState.nodes[medId].response = {
                    numInput: 0,
                    timeOption: 'minutes',
                };
            });
            it('handles time input change', () => {
                payload.numInput = 42;
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.HANDLE_TIME_INPUT_CHANGE,
                        payload,
                    })
                ).toMatchSnapshot();
            });
            it('handles time option change', () => {
                payload.timeOption = 'days';
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.HANDLE_TIME_OPTION_CHANGE,
                        payload,
                    })
                ).toMatchSnapshot();
            });
        });
        it('handles yes no toggle', () => {
            payload.optionSelected = 'Yes';
            nextState.nodes[medId].responseType = 'YES-NO';
            expect(
                hpiReducer(nextState, {
                    type: HPI_ACTION.YES_NO_TOGGLE_OPTION,
                    payload,
                })
            ).toMatchSnapshot();
        });
        describe('handles scale input actions', () => {
            beforeEach(() => {
                nextState.nodes[medId].responseType = 'SCALE1TO10';
            });
            it('handles scale handle value', () => {
                payload.value = 3;
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.SCALE_HANDLE_VALUE,
                        payload,
                    })
                ).toMatchSnapshot();
            });
            it('handles scale handle clear', () => {
                expect(
                    hpiReducer(nextState, {
                        type: HPI_ACTION.SCALE_HANDLE_CLEAR,
                        payload,
                    })
                ).toMatchSnapshot();
            });
        });
    });
});
