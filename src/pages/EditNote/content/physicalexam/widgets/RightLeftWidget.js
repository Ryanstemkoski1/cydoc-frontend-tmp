import React, {Component} from 'react'
import { Table, Button } from 'semantic-ui-react'
import HPIContext from 'contexts/HPIContext.js'

export default class RightLeftWidget extends Component {

    static contextType = HPIContext 

    constructor(props, context) { 
        super(props, context)
        this.state = {
            pe_types: this.props.type === "Pulses" ? 
            [["brachial", "radial", "ulnar", "dorsalis pedis"], ['right', 'left'], ["0 absent", "1+ weak", "2+", "3+ normal", "4+ bounding"]] : 
            [["biceps", "brachioradialis", "triceps", "patellar", "ankle jerk", "plantar"], ["right", "left"], ["0 no response", "1+ slight", "2+ normal", "3+ very brisk", "4+ clonus"]]
        }
        this.onButtonClick = this.onButtonClick.bind(this)
        this.addButton = this.addButton.bind(this)
        this.removeButton = this.removeButton.bind(this)
    }

    onButtonClick(event, data) {
        var values = this.context['Physical Exam']
        values.widgets[this.props.type][data.pe_index][data.index] = data.condition 
        this.context.onContextChange("Physical Exam", values)
    }

    addButton() {
        var values = this.context["Physical Exam"]
        values.widgets[this.props.type].push({0: "", 1: "", 2: ""})
        this.context.onContextChange("Physical Exam", values)
    }

    removeButton(event, data) {
        var values = this.context["Physical Exam"]
        values.widgets[this.props.type].splice(data.pe_index, 1)
        this.context.onContextChange("Physical Exam", values)
    }

    addPulse(pe_index) {
        var pe_map = []
        const {pe_types} = this.state
        for (var index = 0; index < pe_types.length; index ++) {
            pe_map.push(
                <div style={{marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10}}>
                    {pe_types[index].map((item) => 
                        <Button 
                            color={this.context['Physical Exam'].widgets[this.props.type][pe_index][index] === item ? 'grey' : ''}
                            key={item}
                            pe_index={pe_index}
                            index={index}
                            condition={item}
                            onClick={this.onButtonClick}
                            style={{marginBottom: 5}}
                        > {item} </Button>
                    )}
                </div>
            )}
            return pe_map
        }

    render = () => {
        var values = this.context['Physical Exam'].widgets[this.props.type]
        var pes = []
        for (var index = 0; index < values.length; index ++) { 
            if (values.length > 0) pes.push(
            <Table collapsing> 
                <Table.Header> 
                    <div style={{float: "right"}}> 
                        <Button basic circular icon='x' size='mini' pe_index={index} onClick={this.removeButton} /> 
                    </div>  
                </Table.Header>
                {this.addPulse(index)} 
            </Table>) 
        } 
        return (
            <div style={{marginTop: 20}} > 
                {pes}
                add abnormal {this.props.type.toLowerCase()} <Button basic circular icon="plus" size='mini' onClick={this.addButton}/>
            </div>
              )
        }
    }
