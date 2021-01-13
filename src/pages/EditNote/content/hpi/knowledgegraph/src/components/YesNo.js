import React from 'react';
import HPIContext from 'contexts/HPIContext.js';

class YesNo extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        const answers = this.context.hpi[this.props.node].response;
        this.state = {
            yesToggle: answers === 'Yes' ? true : false,
            noToggle: answers === 'No' ? true : false,
        };
        this.handleYesClick = this.handleYesClick.bind(this);
        this.handleNoClick = this.handleNoClick.bind(this);
    }
    // eventually combine into one function.

    handleYesClick() {
        this.setState({
            yesToggle: !this.state.yesToggle,
            noToggle: !this.state.yesToggle ? false : this.state.noToggle,
        });
        const values = this.context.hpi;
        values[this.props.node].response = !this.state.yesToggle ? 'Yes' : '';
        this.context.onContextChange('hpi', values);
    }

    handleNoClick() {
        this.setState({
            noToggle: !this.state.noToggle,
            yesToggle: !this.state.noToggle ? false : this.state.yesToggle,
        });
        const values = this.context.hpi;
        values[this.props.node].response = !this.state.noToggle ? 'No' : '';
        this.context.onContextChange('hpi', values);
    }

    render() {
        const answer = this.context.hpi[this.props.node].response;
        return (
            <div>
                <button
                    className={`ui ${
                        answer === 'Yes' ? 'violet' : 'basic'
                    } button`}
                    onClick={this.handleYesClick}
                >
                    {' '}
                    Yes{' '}
                </button>
                <button
                    className={`ui ${
                        answer === 'No' ? 'violet' : 'basic'
                    } button`}
                    onClick={this.handleNoClick}
                >
                    {' '}
                    No{' '}
                </button>
            </div>
        );
    }
}

export default YesNo;
