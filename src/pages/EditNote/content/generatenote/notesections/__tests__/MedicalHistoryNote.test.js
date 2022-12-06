import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { MedicalHistoryNote } from '../MedicalHistoryNote';
import { YesNoResponse } from 'constants/enums';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const emptyMedical = {
    0: {
        condition: 'Type II Diabetes',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
    1: {
        condition: 'Myocardial Infarction',
        hasBeenAfflicted: YesNoResponse.None,
        startYear: -1,
        hasConditionResolved: YesNoResponse.None,
        endYear: -1,
        comments: '',
    },
};

const mountWithProps = (medicalHistory = emptyMedical, isRich = false) => {
    return mount(
        <MedicalHistoryNote medicalHistory={medicalHistory} isRich={isRich} />
    );
};

describe('Medical History Note', () => {
    const nonEmptyMedical = {
        0: {
            condition: 'foo',
            hasBeenAfflicted: YesNoResponse.Yes,
            startYear: 2000,
            hasConditionResolved: YesNoResponse.None,
            endYear: -1,
            comments: 'comments',
        },
        1: {
            condition: 'bar',
            hasBeenAfflicted: YesNoResponse.No,
        },
        2: {
            condition: 'bar',
            hasBeenAfflicted: YesNoResponse.None,
        },
        3: {
            condition: 'test',
            hasBeenAfflicted: YesNoResponse.Yes,
            startYear: -1,
            hasConditionResolved: YesNoResponse.Yes,
            endYear: 2001,
            comments: '',
        },
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
        const wrapper = mountWithProps(emptyMedical);
        expect(wrapper.text()).toContain('');
    });

    // // TODO: Fix below tests
    // it('renders only non-empty entries when hasBeenAfflicted=Yes (non-rich)', () => {
    //     const wrapper = mountWithProps(nonEmptyMedical);
    //     const expected = [
    //         'foo started in 2000. Comments',
    //         'test (resolved 2001). ',
    //     ];

    //     wrapper
    //         .find('li')
    //         .forEach((node, idx) => expect(node.text()).toEqual(expected[idx]));
    // });

    it('renders only non-empty entries when hasBeenAffected=Yes (rich-text)', () => {
        const wrapper = mountWithProps(nonEmptyMedical, true);
        const expected = [
            [
                'Condition',
                'Start Year',
                'Condition Resolved?',
                'End Year',
                'Comments',
            ],
            ['foo', '2000', '', '', 'comments'],
            ['test', '', 'YES', '2001', ''],
        ];

        expect(wrapper.find('table')).toHaveLength(1);
        wrapper
            .find('tr')
            .forEach((row, r) =>
                row
                    .children()
                    .forEach((node, idx) =>
                        expect(node.text()).toEqual(expected[r][idx])
                    )
            );
    });
});
