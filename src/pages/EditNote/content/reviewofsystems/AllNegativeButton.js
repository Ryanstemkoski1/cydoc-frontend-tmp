import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
//import './PhysicalExam.css';
//import NumericInput from 'react-numeric-input';

//Component that triggers its handleClick function on all children when clicked
export default class AllNegativeButton extends React.Component {
    render = () => {
        return (
            <Fragment>
                <Button
                    toggle
                    content='Select All No'
                    active={
                        //goes through every no buttons and see if they are active
                        this.props.children.every(
                            (currentOption) =>
                                currentOption.props.children[0].props.children
                                    .props.active
                        )
                    }
                    onClick={() => {
                        // calls the handleClick method of child toggles and sets to 'no'
                        React.Children.map(this.props.children, (child) =>
                            this.props.handleClick(
                                child.props.children[1].props.children,
                                'n'
                            )
                        );
                    }}
                    className={'spaced-buttons'}
                />
                {this.props.children}
            </Fragment>
        );
    };
}
