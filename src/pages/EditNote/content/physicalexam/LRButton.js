import React, { Fragment } from 'react';
import { Button } from "semantic-ui-react";
import HPIContext from 'contexts/HPIContext.js';

//Component that manages content for the Physical Exam tab
export default class LRButton extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
    }

    render = () => {
        if (this.props.active) {
            return (
                <Button.Group>
                    <Button
                        attached='left'
                        content='L'
                        active={this.context["Physical Exam"][this.props.group][this.props.name].left}
                        color={this.context["Physical Exam"][this.props.group][this.props.name].left ? (this.props.color) : null}
                        onClick={(e, {active}) => this.props.onClick('left', this.props.name, !active)}
                    />
                    <Button
                        content={this.props.content}
                        active={this.props.active}
                        color={this.props.color}
                        onClick={(e, {active}) => this.props.onClick(null, this.props.name, !active)}
                    />
                    <Button
                        attached='right'
                        content='R'
                        active={this.context["Physical Exam"][this.props.group][this.props.name].right}
                        color={this.context["Physical Exam"][this.props.group][this.props.name].right ? (this.props.color) : null}
                        onClick={(e, {active}) => this.props.onClick('right', this.props.name, !active)}
                    />
                </Button.Group>
            )
        } else {
            return (
                <Button.Group>
                    <Button 
                        content={this.props.content}
                        active={this.props.active}
                        color={this.props.color}
                        onClick={(e) => this.props.onClick(null, this.props.name, !this.props.active)}
                    />
                </Button.Group>
            )
        }
        
    }

}