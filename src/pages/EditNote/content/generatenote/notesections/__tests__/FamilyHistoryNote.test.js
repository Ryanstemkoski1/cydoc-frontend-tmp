import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { FamilyHistoryNote } from '../FamilyHistoryNote';
import { YesNoResponse } from 'constants/enums';
import { FamilyOption } from 'constants/familyHistoryRelations';

Enzyme.configure({ adapter: new EnzymeAdapter() });

// Empty indicated by all hasAfflictedFamilyMember == YesNoReponse.None
const emptyFH = {
    0: {
        condition: 'Type II Diabetes',
        hasAfflictedFamilyMember: YesNoResponse.None,
        familyMembers: {},
    },
};

const mountWithProps = (familyHistory = emptyFH) => {
    return mount(<FamilyHistoryNote familyHistory={familyHistory} />);
};

describe('Family History Note', () => {
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
    it('renders only non-empty entries', () => {
        const wrapper = mountWithProps({
            0: {
                condition: 'foo',
                hasAfflictedFamilyMember: YesNoResponse.Yes,
                familyMembers: {
                    0: {
                        member: FamilyOption.Mother,
                        causeOfDeath: YesNoResponse.Yes,
                        living: YesNoResponse.None,
                        comments: 'comment',
                    },
                    1: {
                        member: FamilyOption.Son,
                        causeOfDeath: YesNoResponse.No,
                        living: YesNoResponse.Yes,
                        comments: '',
                    },
                },
            },
            1: {
                // Should not see because hasAfflicatedFamilyMember == YesNoResponse.No
                condition: 'foo',
                hasAfflictedFamilyMember: YesNoResponse.No,
                familyMembers: {
                    0: {
                        member: FamilyOption.Mother,
                        causeOfDeath: YesNoResponse.Yes,
                        living: YesNoResponse.None,
                        comments: 'comment',
                    },
                },
            },
            2: {
                condition: 'bar',
                hasAfflictedFamilyMember: YesNoResponse.Yes,
                familyMembers: {
                    0: {
                        member: FamilyOption.MaternalAunt,
                        causeOfDeath: YesNoResponse.No,
                        living: YesNoResponse.No,
                        comments: 'comment',
                    },
                },
            },
            3: {
                condition: 'lonely',
                hasAfflictedFamilyMember: YesNoResponse.Yes,
                familyMembers: {},
            },
        });
        const expected = [
            'foo: mother (died of foo), comment, son (still living). ',
            'bar: maternal aunt (not the cause of death), comment. ',
            'lonely ',
            'No family history of foo.',
        ];
        const items = wrapper.find('li');
        expect(items).toHaveLength(4);
        items.forEach((node, i) => expect(node.text()).toEqual(expected[i]));
    });
});
