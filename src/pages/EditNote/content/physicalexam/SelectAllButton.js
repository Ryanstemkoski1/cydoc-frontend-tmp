import React, { Fragment } from 'react';
import { Button } from "semantic-ui-react";
import './PhysicalExam.css'
//import NumericInput from 'react-numeric-input';


//Component that triggers its handleClick function on all children when clicked
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
                    className={"spaced-buttons"}
                />
                {this.props.children}
            </Fragment>
        )
    }

}