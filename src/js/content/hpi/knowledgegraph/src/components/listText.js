import React from 'react'
import HPIContext from "../../../../../contexts/HPIContext";
import HandleInput from './HandleInput';

export default class ListText extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.handlePlusClick = this.handlePlusClick.bind(this); 
    } 

    handlePlusClick() {
        var values = this.context['hpi']
        var list_keys = this.props.am_child ? Object.keys(values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response']) : Object.keys(values[this.props.category_code][this.props.uid]['response'])
        var last_index = list_keys[list_keys.length - 1] + 1
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'][last_index] = ""
        else values[this.props.category_code][this.props.uid]["response"][last_index] = ""
        this.context.onContextChange("hpi", values)
    }

    render() {
        var button_map = []
        let input_res = this.context['hpi'][this.props.category_code][this.props.uid]
        let res = this.props.am_child ? input_res['children'][this.props.child_uid]['response'] : input_res['response']
        for (var res_index in res) { 
            button_map.push(<HandleInput 
                key = {res_index}
                type = {this.props.type}
                uid = {this.props.uid}
                category_code = {this.props.category_code}
                am_child={this.props.am_child}
                child_uid={this.props.child_uid}
                input_id={res_index} 
            />)
        }
        return (
        <div> 
            <div> {button_map}</div>
            <div> <button onClick={this.handlePlusClick} style={{borderRadius: '50%'}}> + </button> </div>
        </div>)
        }}