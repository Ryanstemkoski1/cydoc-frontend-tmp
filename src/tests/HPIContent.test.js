import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import HPIContent from '../pages/EditNote/content/hpi/knowledgegraph/HPIContent';
import HPIContext from '../contexts/HPIContext';
import { noteBody } from '../constants/noteBody';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultContextValues = {
    title: 'Untitled Note',
    _id: null,
    unsavedChanges: false,
    ...noteBody
}

const setup = (props) => {
    return mount(<HPIContent {...props} />);
}

test('renders without crashing', () => {
    // const wrapper = setup(defaultContextValues);
    // expect(wrapper).toBeTruthy();
})
