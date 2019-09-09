import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class ToggleButton extends Component {
    // state = {};
    // handleClick = () =>
    //     this.setState((prevState) => ({ active: !prevState.active }));
        // this.props.recordClick()
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, data){
        this.props.onToggleButtonClick(event, data);
    }
    render() {
        const { active } = this.props;

        return (
            <Button
                condition={this.props.condition}
                color={active ? 'violet' : null}
                active={active}
                onClick={this.handleClick}
                basic={!active}
                size={this.props.size}
                compact={this.props.compact}
                title={this.props.title}>
                {this.props.title}
            </Button>
        )
    }
}

ToggleButton.propTypes = {
    title: PropTypes.string,
    size: PropTypes.string,
    compact: PropTypes.bool
};