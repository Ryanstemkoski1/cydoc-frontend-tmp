import { YesNoResponse } from 'constants/enums';
import React from 'react';
import style from './AllNegativeButton.module.scss';
//Component that triggers its handleClick function on all children when clicked
const AllNegativeButton = (props) => {
    // whether every No button is selected
    const { children, handleClick } = props;
    const allNegative =
        !children ||
        children.every(
            (currentOption) =>
                currentOption?.props?.children[0]?.props?.noButtonActive
        );

    return (
        <div className={style.symptomsBlock}>
            <div
                className={`${style.symptomsBlock__btn} symptomsBlockBtn flex align-center justify-center`}
            >
                <button
                    className={`${
                        style.symptomsBlock__all
                    } button outline info pill sm ${
                        allNegative && style.active
                    }`}
                    data-hover={false}
                    onClick={() =>
                        React.Children.map(children, (child) => {
                            const optionName =
                                child.props.children?.[1]?.props?.children;
                            const noButton = child.props.children?.[0];
                            if (allNegative) {
                                handleClick(optionName, null);
                            } else if (!noButton?.props?.noButtonActive) {
                                handleClick(optionName, YesNoResponse.No);
                            }
                        })
                    }
                >
                    Select All No
                </button>
            </div>
            {children}
        </div>
    );
};

export default AllNegativeButton;
