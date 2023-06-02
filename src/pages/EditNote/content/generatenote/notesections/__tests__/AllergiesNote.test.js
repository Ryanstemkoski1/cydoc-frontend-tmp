import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { AllergiesNote } from '../AllergiesNote';

Enzyme.configure({ adapter: new Adapter() });

const initAllergies = {
    0: { incitingAgent: '', reaction: '', comments: '' },
};

const mountWithProps = (allergies = initAllergies, isRich = false) => {
    return mount(<AllergiesNote allergies={allergies} isRich={isRich} />);
};

describe('AllergiesNote', () => {
    const allergies = {
        0: { incitingAgent: 'foo', reaction: 'bar', comments: '' },
        1: {
            incitingAgent: '',
            reaction: 'empty-rxn',
            comments: 'empty-comment',
        },
        2: { incitingAgent: 'test', reaction: '', comments: 'comment' },
    };

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
        expect(wrapper.text()).toContain('');
    });

    it('renders only non-empty entries (non-rich)', () => {
        const wrapper = mountWithProps({ ...allergies });
        expect(wrapper.find('li')).toHaveLength(2);
        const expected = ['foo. Reaction: bar', 'test. Comments: comment'];
        wrapper
            .find('li')
            .forEach((node, idx) =>
                expect(node.text()).toContain(expected[idx])
            );
    });

    it('renders only non-empty entries (rich-text)', () => {
        const wrapper = mountWithProps({ ...allergies }, true);
        expect(wrapper.find('table')).toHaveLength(1);
        const expected = [
            ['Inciting Agent', 'Reaction', 'Comments'],
            ['foo', 'bar', ''],
            ['test', '', 'comment'],
        ];
        wrapper
            .find('tr')
            .forEach((row, r) =>
                row
                    .children()
                    .forEach((node, idx) =>
                        expect(node.text()).toContain(expected[r][idx])
                    )
            );
    });
});
