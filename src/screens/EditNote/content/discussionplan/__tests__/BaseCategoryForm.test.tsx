import React from 'react';
import { BaseCategoryForm } from '../forms/BaseCategoryForm';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

const mountWithProps = ({ ...props } = {}) => {
    props = {
        category: 'differentialDiagnoses',
        categoryData: [{}],
        numColumns: 2,
        components: {
            mobileContent: vi.fn(),
            mobileTitle: vi.fn(),
            gridColumn: vi.fn(),
            gridHeaders: vi.fn(),
        },
        ...props,
    };
    return render(<BaseCategoryForm {...props} />);
};

describe('BaseCategoryForm', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithProps();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithProps();
        expect(wrapper.container.innerHTML).toMatchSnapshot();
    });

    // it('calls only mobileContent and mobileTitle when in mobile view', () => {
    //     const mockMobileContent = vi.fn();
    //     const mockMobileTitle = vi.fn();
    //     const mockGridHeaders = vi.fn();
    //     const mockGridColumn = vi.fn();
    //     mountWithProps({
    //         mobile: true,
    //         components: {
    //             mobileContent: mockMobileContent,
    //             mobileTitle: mockMobileTitle,
    //             mockGridHeaders: mockGridHeaders,
    //             mockGridColumn: mockGridColumn,
    //         },
    //     });

    //     expect(mockMobileTitle).toHaveBeenCalled();
    //     expect(mockMobileContent).toHaveBeenCalled();

    //     expect(mockGridColumn).toHaveBeenCalledTimes(0);
    //     expect(mockGridHeaders).toHaveBeenCalledTimes(0);
    // });

    it('calls only gridHeaders and gridColumn when not in mobile view', () => {
        const mockMobileContent = vi.fn();
        const mockMobileTitle = vi.fn();
        const mockGridHeaders = vi.fn();
        const mockGridColumn = vi.fn();
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
        expect(
            wrapper.container.querySelectorAll('.active.content')
        ).toHaveLength(1);
        (
            wrapper.container.querySelector('.title') as HTMLButtonElement
        ).click();
        expect(
            wrapper.container.querySelectorAll('.active.content')
        ).toHaveLength(1);
    });

    it('converts category prop to header using start case', () => {
        const wrapper = mountWithProps({ category: 'differentialDiagnoses' });
        const header = wrapper.container.querySelector('.ui.attached.header');
        expect(header?.textContent).toEqual('Differential Diagnoses');
    });
});
