import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { BaseCategoryForm } from '../forms/BaseCategoryForm';

Enzyme.configure({ adapter: new Adapter() });

const mountWithProps = ({ ...props } = {}) => {
    props = {
        category: 'differentialDiagnoses',
        categoryData: [{}],
        numColumns: 2,
        components: {
            mobileContent: jest.fn(),
            mobileTitle: jest.fn(),
            gridColumn: jest.fn(),
            gridHeaders: jest.fn(),
        },
        ...props,
    };
    return mount(<BaseCategoryForm {...props} />);
};

describe('BaseCategoryForm', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithProps();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithProps();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('calls only mobileContent and mobileTitle when in mobile view', () => {
        const mockMobileContent = jest.fn();
        const mockMobileTitle = jest.fn();
        const mockGridHeaders = jest.fn();
        const mockGridColumn = jest.fn();
        mountWithProps({
            mobile: true,
            components: {
                mobileContent: mockMobileContent,
                mobileTitle: mockMobileTitle,
                mockGridHeaders: mockGridHeaders,
                mockGridColumn: mockGridColumn,
            },
        });

        expect(mockMobileTitle).toHaveBeenCalled();
        expect(mockMobileContent).toHaveBeenCalled();

        expect(mockGridColumn).toHaveBeenCalledTimes(0);
        expect(mockGridHeaders).toHaveBeenCalledTimes(0);
    });

    it('calls only gridHeaders and gridColumn when not in mobile view', () => {
        const mockMobileContent = jest.fn();
        const mockMobileTitle = jest.fn();
        const mockGridHeaders = jest.fn();
        const mockGridColumn = jest.fn();
        mountWithProps({
            mobile: false,
            components: {
                mobileContent: mockMobileContent,
                mobileTitle: mockMobileTitle,
                gridHeaders: mockGridHeaders,
                gridColumn: mockGridColumn,
            },
        });

        expect(mockMobileTitle).toHaveBeenCalledTimes(0);
        expect(mockMobileContent).toHaveBeenCalledTimes(0);

        expect(mockGridColumn).toHaveBeenCalled();
        expect(mockGridHeaders).toHaveBeenCalled();
    });

    // // TODO: Fix below tests
    // it('should not be toggable for differentialDiagnoses', () => {
    //     let wrapper = mountWithProps({
    //         mobile: false,
    //         category: 'differentialDiagnoses',
    //     });
    //     expect(wrapper.find('.active.content')).toHaveLength(1);
    //     wrapper.find('.title').first().simulate('click');
    //     expect(wrapper.find('.active.content')).toHaveLength(1);

    //     // Same applies for mobile view
    //     wrapper = mountWithProps({
    //         mobile: true,
    //         category: 'differentialDiagnoses',
    //     });
    //     expect(wrapper.find('.active.content')).toHaveLength(1);
    //     wrapper.find('.title').first().simulate('click');
    //     expect(wrapper.find('.active.content')).toHaveLength(1);
    // });

    it('should only be toggable in mobile for non-differentialDiagnoses categories', () => {
        let wrapper = mountWithProps({
            mobile: false,
            category: 'prescriptions',
        });
        expect(wrapper.find('.active.content')).toHaveLength(1);
        wrapper.find('.title').first().simulate('click');
        expect(wrapper.find('.active.content')).toHaveLength(1);

        // Mobile starts off collapsed
        wrapper = mountWithProps({ mobile: true, category: 'prescriptions' });
        expect(wrapper.find('.active.content')).toHaveLength(0);
        wrapper.find('.title').first().simulate('click');
        expect(wrapper.find('.active.content')).toHaveLength(1);
    });

    it('converts category prop to header using start case', () => {
        const wrapper = mountWithProps({ category: 'differentialDiagnoses' });
        const header = wrapper.find('.ui.attached.header');
        expect(header.text()).toEqual('Differential Diagnoses');
    });
});
