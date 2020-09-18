import React, { Fragment } from 'react';
import { Button } from "semantic-ui-react";
//import NumericInput from 'react-numeric-input';

//Component that manages content for the Physical Exam tab
export default class SelectAllButton extends React.Component {

    constructor(props) {
        super(props)
    }

    render = () => {

        return (
            <Fragment>
                <Button
                    toggle
                    content="∀"
                    active={React.Children.toArray(this.props.children).reduce((a, b) => a && b.props.active, true)}
                    onClick={(e, { active }) => {
                        React.Children.map(
                            this.props.children,
                            (child) => this.props.handleClick(child.props.name, !active)
                        )
                    }}
                    style={{marginBottom: 5}}
                />
                {this.props.children}
            </Fragment>
        )
    }

}