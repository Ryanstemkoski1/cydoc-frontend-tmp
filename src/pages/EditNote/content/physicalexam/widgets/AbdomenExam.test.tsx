import { shallow } from 'enzyme';
import React from 'react';
import AbdomenExam from './AbdomenExam';

describe('AbdomenExam', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<AbdomenExam />);
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = shallow(<AbdomenExam />);
        expect(wrapper).toMatchSnapshot();
    });
});
