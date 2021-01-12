import React from 'react';
import TimePicker from 'react-time-picker';
import HPIContext from 'contexts/HPIContext.js';

class TimeOfDayInput extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event) => {
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'][0] = event;
        this.context.onContextChange('hpi', values);
    };

    render() {
        const value = this.context['hpi']['nodes'][this.props.node][
            'response'
        ][0];
        return (
            <TimePicker
                key={this.props.node}
                value={value}
                onChange={this.handleChange}
            />
        );
    }
}

export default TimeOfDayInput;
