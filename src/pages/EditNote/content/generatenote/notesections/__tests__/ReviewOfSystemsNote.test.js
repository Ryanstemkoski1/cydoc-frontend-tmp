import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { ReviewOfSystemsNote } from '../ReviewOfSystemsNote';
import { YesNoResponse } from 'constants/enums';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const emptyROS = {
    General: {
        'Weight changes': YesNoResponse.None,
        Fatigue: YesNoResponse.None,
        Weakness: YesNoResponse.None,
        Fevers: YesNoResponse.None,
        Chills: YesNoResponse.None,
        'Night sweats': YesNoResponse.None,
    },
    Eyes: {
        Glasses: YesNoResponse.None,
        Contacts: YesNoResponse.None,
        Blurriness: YesNoResponse.None,
    },
    Ears: {
        'Changes in hearing': YesNoResponse.None,
        'Hearing loss': YesNoResponse.None,
        Tinnitus: YesNoResponse.None,
        Earache: YesNoResponse.None,
        Discharge: YesNoResponse.None,
    },
};

const mountWithProps = (ros = emptyROS) => {
    return mount(<ReviewOfSystemsNote ROSState={ros} />);
};

describe('ReviewOfSystems Note', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithProps();
        expect(wrapper).toBeTruthy();
    });
    it('matches snapshot', () => {
        const wrapper = mountWithProps();
        expect(wrapper.html()).toMatchSnapshot();
    });
    it('renders correctly when completely empty', () => {
        const wrapper = mountWithProps();
        expect(wrapper.text()).toContain('No review of systems reported');
    });
    it('renders only non-empty options', () => {
        const wrapper = mountWithProps({
            General: {
                'Weight changes': YesNoResponse.Yes,
                Fatigue: YesNoResponse.Yes,
                Weakness: YesNoResponse.No,
                Fevers: YesNoResponse.No,
                Chills: YesNoResponse.None,
                'Night sweats': YesNoResponse.None,
            },
            Eyes: {
                // Shouldn't appear because all Nones
                Glasses: YesNoResponse.None,
                Contacts: YesNoResponse.None,
                Blurriness: YesNoResponse.None,
            },
            Ears: {
                'Changes in hearing': YesNoResponse.Yes,
                'Hearing loss': YesNoResponse.None,
                Tinnitus: YesNoResponse.None,
                Earache: YesNoResponse.None,
                Discharge: YesNoResponse.None,
            },
        });

        const expected = [
            'General: Positive for weight changes, fatigue. Negative for weakness, fevers. ',
            'Ears: Positive for changes in hearing. ',
        ];

        const items = wrapper.find('li');
        expect(items).toHaveLength(2);
        items.forEach((node, i) => expect(node.text()).toEqual(expected[i]));
    });
});
