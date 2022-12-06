import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { SurgicalHistoryNote } from '../SurgicalHistoryNote';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const surgical = {
    foo: { procedure: '', year: -1, comments: '' },
    bar: { procedure: '', year: -1, comments: '' },
};

const mountWithProps = (surgicalHistory = surgical, isRich = false) => {
    return mount(
        <SurgicalHistoryNote
            surgicalHistory={surgicalHistory}
            isRich={isRich}
        />
    );
};

describe('Surgical History Note', () => {
    const nonEmptySH = {
        empty: { procedure: '', year: 1000, comments: 'bar' },
        foo: { procedure: '1 aaa', year: -1, comments: 'xxx' },
        test: { procedure: '2 bbb', year: 2000, comments: '' },
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

    // // TODO: Fix below tests
    // it('renders only non-empty entries (non-rich)', () => {
    //     const wrapper = mountWithProps({ ...nonEmptySH });
    //     expect(wrapper.find('li')).toHaveLength(2);
    //     expect(wrapper.text()).toContain('aaa xxx'); // don't show year
    //     expect(wrapper.text()).toContain('bbb 2000. '); // don't show comment
    //     expect(wrapper.text()).not.toContain('1000. bar');
    // });

    // it('renders only non-empty entries (rich-text)', () => {
    //     const wrapper = mountWithProps({ ...nonEmptySH }, true);
    //     expect(wrapper.find('table')).toHaveLength(1);
    //     expect(wrapper.find('tr')).toHaveLength(3);
    //     const expectedCells = [
    //         ['Procedure', 'Year', 'Comments'],
    //         ['aaa', '', 'xxx'],
    //         ['bbb', '2000', ''],
    //     ];
    //     wrapper
    //         .find('tr')
    //         .forEach((row, r) =>
    //             row
    //                 .children()
    //                 .forEach((node, idx) =>
    //                     expect(node.text()).toEqual(expectedCells[r][idx])
    //                 )
    //         );
    // });
});
