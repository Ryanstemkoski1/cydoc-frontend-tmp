import React from 'react';
import { YesNoResponse } from 'constants/enums';
import style from './AllNegativeButton.module.scss';
//Component that triggers its handleClick function on all children when clicked
const AllNegativeButton = (props) => {
    // whether every No button is selected
    const { children, handleClick } = props;
    const allNegative =
        !children ||
        children.every(
            (currentOption) =>
                currentOption?.props?.children[1].props?.children?.props
                    ?.noButtonActive
        );

    return (
        <div className={style.symptomsBlock}>
            <button
                className={`${style.symptomsBlock__all} ${
                    allNegative && style.active
                }`}
                onClick={() =>
                    React.Children.map(children, (child) => {
                        const optionName =
                            child.props.children?.[0]?.props?.children;
                        const noButton =
                            child.props.children?.[1]?.props?.children;
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
            {children}
        </div>
    );
};

export default AllNegativeButton;
