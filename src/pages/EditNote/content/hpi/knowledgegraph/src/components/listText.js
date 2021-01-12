import React from 'react';
import HPIContext from 'contexts/HPIContext.js';
import HandleInput from './HandleInput';
import '../css/listText.css';

export default class ListText extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.handlePlusClick = this.handlePlusClick.bind(this);
    }

    handlePlusClick() {
        let values = this.context['hpi'];
        let listKeys = Object.keys(
            values['nodes'][this.props.node]['response']
        );
        let lastIndex = parseInt(listKeys[listKeys.length - 1]) + 1;
        values['nodes'][this.props.node]['response'][lastIndex] = '';
        this.context.onContextChange('hpi', values);
    }

    render() {
        let values = this.context['hpi'];
        let buttonMap = [];
        let inputRes = this.context['hpi']['nodes'][this.props.node];
        let res = inputRes['response'];
        for (let resIndex in res) {
            buttonMap.push(
                <HandleInput
                    key={resIndex}
                    type={values['nodes'][this.props.node]['responseType']}
                    inputID={resIndex}
                    category={'nodes'}
                    node={this.props.node}
                />
            );
        }
        return (
            <div>
                <div> {buttonMap}</div>
                <div>
                    {' '}
                    <button
                        onClick={this.handlePlusClick}
                        className='button-plus-click'
                    >
                        {' '}
                        +{' '}
                    </button>{' '}
                </div>
            </div>
        );
    }
}
