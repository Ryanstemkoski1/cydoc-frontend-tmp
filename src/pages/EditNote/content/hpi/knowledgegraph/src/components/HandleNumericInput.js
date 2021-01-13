import React from 'react';
import NumericInput from 'react-numeric-input';
import HPIContext from 'contexts/HPIContext.js';

class HandleNumericInput extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
    }

    handleChange = (value) => {
        const values = this.context.hpi;
        values[this.props.node].response = value;
        this.context.onContextChange('hpi', values);
    };

    render() {
        const values = this.context.hpi[this.props.node];
        let value = values.response;
        let question = values.text;
        return (
            <NumericInput
                key={question}
                value={value}
                min={0}
                max={this.props.max}
                onChange={this.handleChange}
            />
        );
    }
}

export default HandleNumericInput;
