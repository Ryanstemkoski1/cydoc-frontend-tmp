import React from 'react';
import { shallow } from 'enzyme';
import GenerateNote from '../GenerateNote';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialPhysicalExamState } from 'redux/reducers/physicalExamReducer';
import { initialReviewOfSystemsState } from 'constants/reviewOfSystemsInitial';

const mockStore = configureMockStore([thunk]);

const initialStore = {
    reviewOfSystems: initialReviewOfSystemsState,
    physicalExam: initialPhysicalExamState,
    medicalHistory: {},
    surgicalHistory: {},
    medications: {},
    allergies: {},
    socialHistory: {},
    familyHistory: {},
    plan: {},
};

const store = mockStore(initialStore);

describe('Generate Note', () => {
    it('matches snapshot', () => {
        const component = shallow(<GenerateNote store={store} />);
        expect(component).toMatchSnapshot();
    });
});
