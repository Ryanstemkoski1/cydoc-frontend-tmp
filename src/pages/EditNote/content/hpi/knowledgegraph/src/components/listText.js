import React from 'react'
import HPIContext from 'contexts/HPIContext.js';
import HandleInput from './HandleInput';
import '../css/listText.css';

export default class ListText extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.handlePlusClick = this.handlePlusClick.bind(this); 
    } 

    handlePlusClick() {
        var values = this.context['hpi']
        var listKeys = Object.keys(values['nodes'][this.props.node]['response'])
        var lastIndex = listKeys[listKeys.length - 1] + 1
        values['nodes'][this.props.node]["response"][lastIndex] = ""
        this.context.onContextChange("hpi", values)
    }

    render() {
        var values = this.context['hpi']
        var buttonMap = []
        let inputRes = this.context['hpi']['nodes'][this.props.node]
        let res = inputRes['response']
        for (var res_index in res) { 
            buttonMap.push(<HandleInput 
                key = {res_index}
                type = {values['nodes'][this.props.node]['responseType']}
                inputID={res_index} 
                category = {'nodes'}
                node={this.props.node}
            />)
        }
        return (
        <div> 
            <div> {buttonMap}</div>
            <div> <button onClick={this.handlePlusClick} className='button-plus-click'> + </button> </div>
        </div>)
        }}