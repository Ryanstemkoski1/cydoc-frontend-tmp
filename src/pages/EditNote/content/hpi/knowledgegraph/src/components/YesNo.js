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
            yesColor:
                answers !== null && answers === 'Yes'
                    ? 'lightslategrey'
                    : 'whitesmoke',
            yesFont: answers !== null && answers === 'Yes' ? 'white' : 'black',
            noColor:
                answers !== null && answers === 'No'
                    ? 'lightslategrey'
                    : 'whitesmoke',
            noFont: answers !== null && answers === 'No' ? 'white' : 'black',
        };
        this.handleYesClick = this.handleYesClick.bind(this);
        this.handleNoClick = this.handleNoClick.bind(this);
    }
    // eventually combine into one function.

    handleYesClick() {
        this.setState({
            yesColor: 'lightslategrey',
            yesID: 1,
            noID: -1,
            noColor: 'whitesmoke',
            yesFont: 'white',
            noFont: 'black',
        });
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'] = 'Yes';
        this.context.onContextChange('hpi', values);
    }

    handleNoClick() {
        this.setState({
            yesColor: 'whitesmoke',
            yesID: -1,
            noID: 1,
            noColor: 'lightslategrey',
            yesFont: 'black',
            noFont: 'white',
        });
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'] = 'No';
        this.context.onContextChange('hpi', values);
    }

    render() {
        return (
            <div>
                <button
                    className='button_yesno'
                    style={{
                        backgroundColor: this.state.yesColor,
                        color: this.state.yesFont,
                    }}
                    onClick={this.handleYesClick}
                >
                    Yes
                </button>
                <button
                    className='button_yesno'
                    style={{
                        backgroundColor: this.state.noColor,
                        color: this.state.noFont,
                    }}
                    onClick={this.handleNoClick}
                >
                    No
                </button>
            </div>
        );
    }
}

export default YesNo;
