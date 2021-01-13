import React from 'react';
import HPIContext from 'contexts/HPIContext.js';

/*
TODO:
Make custom labels besides healthy and sick
Can that be passed down from props?
The props are key and pop
*/
class ScaleInput extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            val: undefined,
        };
    }

    handleVal() {
        const values = this.context.hpi;
        values[this.props.node].response = this.state.val;
        this.context.onContextChange('hpi', values);
    }

    handleClear(e) {
        e.preventDefault();
        document.getElementById('scale-slider').value = undefined;
        document.getElementById('scale-value').value = undefined;
        this.setState({ val: undefined });

        const values = this.context.hpi;
        values[this.props.node].response = undefined;
        this.context.onContextChange('hpi', values);
    }

    render() {
        return (
            <div className='scale-input'>
                <label> 1 </label>
                <input
                    type='range'
                    min='1'
                    max='10'
                    step='1'
                    id='scale-slider'
                    value={this.state.val}
                    onChange={(e) =>
                        this.setState({ val: e.target.value }, (e) =>
                            this.handleVal(e)
                        )
                    }
                />
                <label> 10 </label>
                <input
                    min='1'
                    max='10'
                    step='1'
                    type='number'
                    id='scale-value'
                    value={this.state.val}
                    onChange={(e) =>
                        this.setState({ val: e.target.value }, (e) =>
                            this.handleVal(e)
                        )
                    }
                />
                <button
                    className='ui compact basic button'
                    style={{ marginLeft: 10 }}
                    onClick={(e) => {
                        this.handleClear(e);
                        this.setState({ val: undefined });
                    }}
                >
                    Clear
                </button>
            </div>
        );
    }
}

export default ScaleInput;
