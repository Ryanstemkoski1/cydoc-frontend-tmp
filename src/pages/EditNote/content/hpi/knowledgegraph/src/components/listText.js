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
        var list_keys = Object.keys(values['nodes'][this.props.node]['response'])
        var last_index = list_keys[list_keys.length - 1] + 1
        values['nodes'][this.props.node]["response"][last_index] = ""
        this.context.onContextChange("hpi", values)
    }

    render() {
        var values = this.context['hpi']
        var button_map = []
        let input_res = this.context['hpi']['nodes'][this.props.node]
        let res = input_res['response']
        for (var res_index in res) { 
            button_map.push(<HandleInput 
                key = {res_index}
                type = {values['nodes'][this.props.node]['responseType']}
                input_id={res_index} 
                category = {'nodes'}
                node={this.props.node}
            />)
        }
        return (
        <div> 
            <div> {button_map}</div>
            <div> <button onClick={this.handlePlusClick} className='button-plus-click'> + </button> </div>
        </div>)
        }}