import React from 'react';
import HPIContext from 'contexts/HPIContext.js';

class YesNo extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        const answers = this.context['hpi']['nodes'][this.props.node][
            'response'
        ];
        this.state = {
            yesID: 0,
            noID: 0,
            // colors of the yes and no buttons depending on whether either are clicked
            yesStyle:
                answers !== null && answers === 'Yes' ? 'violet' : 'basic',
            noStyle: answers !== null && answers === 'No' ? 'violet' : 'basic',
        };
        this.handleYesClick = this.handleYesClick.bind(this);
        this.handleNoClick = this.handleNoClick.bind(this);
    }
    // eventually combine into one function.

    handleYesClick() {
        this.setState({
            yesStyle: 'violet',
            yesID: 1,
            noID: -1,
            noStyle: 'basic',
        });
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'] = 'Yes';
        this.context.onContextChange('hpi', values);
    }

    handleNoClick() {
        this.setState({
            yesStyle: 'basic',
            yesID: -1,
            noID: 1,
            noStyle: 'violet',
        });
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'] = 'No';
        this.context.onContextChange('hpi', values);
    }

    render() {
        return (
            <div>
                <button
                    className={`ui ${this.state.yesStyle} button`}
                    onClick={this.handleYesClick}
                >
                    Yes
                </button>
                <button
                    className={`ui ${this.state.noStyle} button`}
                    onClick={this.handleNoClick}
                >
                    No
                </button>
            </div>
        );
    }
}

export default YesNo;
