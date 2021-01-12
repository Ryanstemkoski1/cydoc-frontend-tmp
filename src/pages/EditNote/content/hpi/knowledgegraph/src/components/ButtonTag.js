import React from 'react';
import HPIContext from 'contexts/HPIContext.js';

class ButtonTag extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        const values = this.context['hpi']['nodes'][this.props.node];
        const answers = values['response'];
        this.state = {
            id: answers !== null && answers.includes(this.props.name) ? -1 : 1,
            buttonStyle:
                answers !== null && answers.includes(this.props.name)
                    ? 'violet'
                    : 'basic',
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let newStyle;
        if (this.state.id === 1) {
            newStyle = 'violet';
        } else {
            newStyle = 'basic';
        }
        this.setState({ id: this.state.id * -1, buttonStyle: newStyle });
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'] = values['nodes'][
            this.props.node
        ]['response'].concat(this.props.name);
        this.context.onContextChange('hpi', values);
    }

    render() {
        return (
            <button
                className= {`ui small ${this.state.buttonStyle} button`}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        );
    }
}

export default ButtonTag;
