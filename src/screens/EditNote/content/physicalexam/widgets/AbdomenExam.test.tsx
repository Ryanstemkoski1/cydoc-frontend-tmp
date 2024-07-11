import { shallow } from 'enzyme';
import React from 'react';
import AbdomenExam from './AbdomenExam';
import { describe, expect, it } from 'vitest';

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
