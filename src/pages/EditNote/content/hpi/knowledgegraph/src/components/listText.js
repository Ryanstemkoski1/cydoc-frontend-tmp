import React from 'react';
import HPIContext from 'contexts/HPIContext.js';
import { Input } from 'semantic-ui-react';
import '../css/listText.css';

export default class ListText extends React.Component {
    static contextType = HPIContext;

    handleListTextChange = (id) => (_e, data) => {
        let values = this.context.hpi;
        values[this.props.node].response = values.nodes[
            this.props.node
        ].response.map((input, listIndex) => {
            if (id !== listIndex) return input;
            return { ...input, name: data.value };
        });
        this.context.onContextChange('hpi', values);
    };

    RemoveListInput = (id) => () => {
        let values = this.context.hpi;
        values[this.props.node].response = values.nodes[
            this.props.node
        ].response.filter((_input, listIndex) => listIndex != id);
        this.context.onContextChange('hpi', values);
    };

    AddListInput = () => {
        let values = this.context.hpi;
        values[this.props.node].response.push({ name: '' });
        this.context.onContextChange('hpi', values);
    };

    render() {
        let listInputValues = this.context.hpi[this.props.node].response;
        let listInputsArray = listInputValues.map((input, id) => (
            <div key={input}>
                <Input
                    value={input.name}
                    onChange={this.handleListTextChange(id)}
                />
                <button onClick={this.RemoveListInput(id)}> - </button>
            </div>
        ));
        return (
            <div>
                {' '}
                {listInputsArray}
                <button
                    className='button-plus-click'
                    onClick={this.AddListInput}
                >
                    {' '}
                    +
                </button>
            </div>
        );
    }
}
