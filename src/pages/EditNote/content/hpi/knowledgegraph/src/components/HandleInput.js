import React from 'react';
import { Input } from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';
import '../css/HandleInput.css';

class HandleInput extends React.Component {
    static contextType = HPIContext;

    handleInputChange = (_e, data) => {
        let textInput = data.value;
        const values = this.context.hpi;
        values[this.props.node].response = textInput;
        this.context.onContextChange('hpi', values);
    };

    render() {
        let responseType = this.context.hpi[this.props.node]['responseType'];
        return (
            <Input
                onChange={this.handleInputChange}
                rows={responseType === 'SHORT-TEXT' ? '2' : '4'}
                value={this.context.hpi[this.props.node].response}
            />
        );
    }
}

export default HandleInput;
