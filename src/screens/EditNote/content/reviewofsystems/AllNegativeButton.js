import React from 'react';
import style from './AllNegativeButton.module.scss';
import { Button } from '@mui/material';
import { YesNoResponse } from 'constants/enums';
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

    const customButtonStyle = {
        padding: '8px 22px',
        borderRadius: '10px',
        color: allNegative ? 'white' : '#047A9B',
        backgroundColor: allNegative ? '#047A9B' : '#EAF3F5',
        boxShadow: allNegative
            ? '0px 1px 20px 0px rgba(5, 122, 155, 0.04), 0px 2px 20px 0px rgba(5, 122, 155, 0.12), 0px 3px 2px -2px rgba(26, 82, 97, 0.20)'
            : 'none',

        '&:hover': {
            backgroundColor: allNegative ? '#047A9B' : '#EAF3F5',
            boxShadow: allNegative
                ? '0px 1px 20px 0px rgba(5, 122, 155, 0.04), 0px 2px 20px 0px rgba(5, 122, 155, 0.12), 0px 3px 2px -2px rgba(26, 82, 97, 0.20)'
                : 'none',
        },
    };

    return (
        <div className={style.symptomsBlock}>
            <div
                className={`${style.symptomsBlock__btn} symptomsBlockBtn flex align-center justify-center`}
            >
                <Button
                    className={style.symptomsBlock}
                    sx={customButtonStyle}
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
                    <span>Select All No</span>
                </Button>
            </div>
            {children}
        </div>
    );
};

export default AllNegativeButton;
