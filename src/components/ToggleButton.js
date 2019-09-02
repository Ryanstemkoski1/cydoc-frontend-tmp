import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

export default class ToggleButton extends Component {
    state = {};
    handleClick = () =>
        this.setState((prevState) => ({ active: !prevState.active }));

    render() {
        const { active } = this.state;

        return (
            <Button color={active ? 'violet' : null} active={active} onClick={this.handleClick} basic={!active}>
                {this.props.title}
            </Button>
        )
    }
}