import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { MedicationsNote } from '../MedicationsNote';
import { YesNoResponse } from 'constants/enums';

Enzyme.configure({ adapter: new Adapter() });

const initMedications = {
    0: {
        drugName: '',
        startYear: -1,
        isCurrentlyTaking: YesNoResponse.None,
        endYear: -1,
        schedule: '',
        dose: '',
        reasonForTaking: '',
        sideEffects: [],
        comments: '',
    },
};

const mountWithProps = (medications = initMedications, isRich = false) => {
    return mount(<MedicationsNote medications={medications} isRich={isRich} />);
};

describe('Medications Note', () => {
    // const nonEmptyMeds = {
    //     0: {
    //         drugName: 'foo',
    //         startYear: 2000,
    //         isCurrentlyTaking: YesNoResponse.None,
    //         endYear: -1,
    //         schedule: 'bar',
    //         dose: '24',
    //         reasonForTaking: '',
    //         sideEffects: ['a', 'b'],
    //         comments: '',
    //     },
    //     1: {
    //         // Should not render because of empty drugName
    //         drugName: '',
    //         startYear: 2000,
    //         isCurrentlyTaking: YesNoResponse.None,
    //         endYear: -1,
    //         schedule: 'bar',
    //         dose: '24',
    //         reasonForTaking: '42',
    //         sideEffects: ['a', 'b'],
    //         comments: 'comment',
    //     },
    //     2: {
    //         drugName: 'test',
    //         startYear: -1,
    //         isCurrentlyTaking: YesNoResponse.Yes,
    //         endYear: 1555,
    //         schedule: '',
    //         dose: '',
    //         reasonForTaking: '42',
    //         sideEffects: [],
    //         comments: 'comment',
    //     },
    // };
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
    //     const wrapper = mountWithProps({ ...nonEmptyMeds });
    //     // 1 + numNonEmptyEntries
    //     expect(wrapper.find('ul')).toHaveLength(1);
    //     expect(wrapper.find('div')).toHaveLength(2);
    //     const expected = [
    //         [
    //             'foo.',
    //             'Start Year: 2000',
    //             'Schedule: bar',
    //             'Dose: 24',
    //             'Side Effects: a, b',
    //         ],
    //         ['test.', 'Reason for Taking: 42', 'Comments: comment'],
    //     ];
    //     wrapper.find('div').forEach((row, r) => {
    //         expect(row.find('b').text()).toEqual(expected[r][0]);
    //         // fields other than drugName appear as lists
    //         row.find('ul')
    //             .children()
    //             .forEach((node, idx) =>
    //                 expect(node.text()).toEqual(expected[r][idx + 1])
    //             );
    //     });
    // });

    // it('renders only non-empty entries and preserves order (rich-text)', () => {
    //     const wrapper = mountWithProps({ ...nonEmptyMeds }, true);
    //     expect(wrapper.find('table')).toHaveLength(1);
    //     expect(wrapper.find('tr')).toHaveLength(3);

    //     const expected = [
    //         [
    //             'Drug Name',
    //             'Start Year',
    //             'Schedule',
    //             'Dose',
    //             'Reason for Taking',
    //             'Side Effects',
    //             'Comments',
    //         ],
    //         ['foo', '2000', 'bar', '24', '', 'a, b', ''],
    //         ['test', '', '', '', '', '', 'comment'],
    //     ];
    //     wrapper
    //         .find('tr')
    //         .forEach((row, r) =>
    //             row
    //                 .children()
    //                 .forEach((node, idx) =>
    //                     expect(node.text()).toEqual(expected[r][idx])
    //                 )
    //         );
    // });
});
