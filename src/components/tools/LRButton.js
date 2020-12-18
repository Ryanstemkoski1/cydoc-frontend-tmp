import React, { Fragment } from 'react';
import { Button } from "semantic-ui-react";
import HPIContext from 'contexts/HPIContext.js'
import './LRButton.css'
import PropTypes from 'prop-types'

//Component that manages content for the Physical Exam tab
export default class LRButton extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
    }

    render = () => {
        if (this.props.toggle.center) {
            return (
                <Button.Group className={"spaced-buttons"}>
                    <Button
                        attached='left'
                        content='L'
                        active={this.props.toggle.left}
                        color={this.props.toggle.left ? (this.props.color) : null}
                        onClick={(e, {active}) => this.props.onClick('left', this.props.name, !active)}
                    />
                    <Button
                        content={this.props.content}
                        active={this.props.active}
                        color={this.props.color}
                        onClick={(e, {active}) => this.props.onClick('center', this.props.name, !active)}
                    />
                    <Button
                        attached='right'
                        content='R'
                        active={this.props.toggle.right}
                        color={this.props.toggle.right ? (this.props.color) : null}
                        onClick={(e, {active}) => this.props.onClick('right', this.props.name, !active)}
                    />
                </Button.Group>
            )
        } else {
            return (
                <Button.Group className={"spaced-buttons"}>
                    <Button
                        content={this.props.content}
                        active={this.props.toggle.center}
                        color={this.props.color}
                        onClick={(e, {active}) => this.props.onClick(null, this.props.name, !active)}
                    />
                </Button.Group>
            )
        }
        
    }
}

LRButton.propTypes = {
    color: PropTypes.string,
    content: PropTypes.string,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    toggle: PropTypes.object.isRequired
}