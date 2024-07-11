import { shallow } from 'enzyme';
import React from 'react';
import LungSounds from './LungSounds';
import { describe, expect, it } from 'vitest';

describe('LungSounds', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<LungSounds />);
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = shallow(<LungSounds />);
        expect(wrapper).toMatchSnapshot();
    });
});
