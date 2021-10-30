import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { YesNoResponse } from 'constants/enums';

//Component that triggers its handleClick function on all children when clicked
const AllNegativeButton = (props) => {
    // whether every No button is selected
    const { children, handleClick } = props;
    const allNegative =
        !children ||
        children.every(
            (currentOption) =>
                currentOption.props.children[0].props.children.props.active
        );
    return (
        <Fragment>
            <Button
                toggle
                content='Select All Negative'
                active={allNegative}
                onClick={() =>
                    React.Children.map(children, (child) => {
                        const optionName =
                            child.props.children?.[1]?.props?.children;
                        const noButton =
                            child.props.children?.[0]?.props?.children;
                        if (allNegative) {
                            handleClick(optionName, null);
                        } else if (!noButton?.props?.active) {
                            handleClick(optionName, YesNoResponse.No);
                        }
                    })
                }
                className='select-all-negative'
            />
            {children}
        </Fragment>
    );
};

export default AllNegativeButton;
