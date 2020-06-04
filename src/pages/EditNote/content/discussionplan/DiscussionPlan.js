import React, {Component} from 'react'
import NumericInput from "react-numeric-input";
import HPIContext from 'contexts/HPIContext.js'
import { 
    Header, 
    Input, 
    Dropdown,
    Grid,
} from 'semantic-ui-react';
import AddRowButton from '../../../../components/tools/AddRowButton';

const PRESCRIPTION_DEFAULT = {
    rx_type: 'Medication',
    rx_amount: null,
    rx_unit: 'mg',
    sig_amount: null,
    sig_unit: 'day(s)',
    sig_comment: '',
    comment: '',
};


function Prescription(props) {
    const RX_TYPE_OPTIONS = [
        { key: 'Medication', text: 'Medication', value: 'Medication' },
        { key: 'Text Value', text: 'Text Value', value: 'Text Value' },
    ];
    const RX_UNIT_OPTIONS = [
        { key: 'mg', text: 'mg', value: 'mg' },
        { key: 'mL', text: 'mL', value: 'mL' },
    ];
    const SIG_UNIT_OPTIONS = [
        { key: 'day(s)', text: 'day(s)', value: 'day(s)' },
        { key: 'week(s)', text: 'week(s)', value: 'week(s)' },
    ];
    return (
        <Grid columns={3} stackable>
            <Grid.Row>
                <Grid.Column>
                    <h4> Recipe (Rx) </h4>
                    <Dropdown
                        fluid
                        selection
                        defaultValue={props.info.rx_type}
                        options={RX_TYPE_OPTIONS}
                        onChange={(e, data) => props.onChange('rx_type', data.value)}
                    />
                    <Input
                        fluid
                        type='number'
                        labelPosition='right'
                        placeholder={0}
                        defaultValue={props.info.rx_amount}
                        label={<Dropdown 
                            defaultValue={props.info.rx_unit}
                            options={RX_UNIT_OPTIONS} 
                            onChange={(e, data) => props.onChange('rx_unit', data.value)}/>}
                        onChange={(e,data) => props.onChange('rx_amount', data.value)}
                    />
                </Grid.Column>
                <Grid.Column>
                    <h4> Signatura (Sig) </h4>
                    <Input
                        fluid
                        type='number'
                        labelPosition='right'
                        placeholder={0}
                        defaultValue={props.info.sig_amount}
                        label={<Dropdown 
                            defaultValue={props.info.sig_unit}
                            options={SIG_UNIT_OPTIONS} 
                            onChange={(e, data) => props.onChange('sig_unit', data.value)}/>}
                        onChange={(e,data) => props.onChange('sig_amount', data.value)}
                    />
                    <Input
                        fluid
                        selection
                        placeholder='e.g. 1 pill, everyday, with water'
                        defaultValue={props.info.sig_type}
                        options={RX_TYPE_OPTIONS}
                        onChange={(e, data) => props.onChange('sig_comment', data.value)}
                    />
                </Grid.Column>
                <Grid.Column stretched>
                    <h4> Comments </h4>
                    <div className='ui form'>
                        <textarea value={props.info.comment} onChange={(e) => props.onChange('comment', e.target.value)}/>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

class plan extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context)
        this.state = {
            textInput: "",
            yes_id: 0,
            no_id: 0,
            yes_color: "whitesmoke",
            no_color: "whitesmoke",
            prescriptions: [{ ...PRESCRIPTION_DEFAULT }],
        }
        this.handleYesClick = this.handleYesClick.bind(this)
        this.handleNoClick = this.handleNoClick.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange = (title, event) => {
        // this.setState({textInput: event.target.value})
        const values = this.context["plan"]
        values[title] = typeof event === 'object' ? event.target.value : event
        this.context.onContextChange("plan", values)
    }

    handleYesClick() {
        this.setState({yes_color: "lightslategrey", yes_id: 1, no_id: -1, no_color: "whitesmoke"})
        const values = this.context["plan"]
        values["Admitting Patient"] = "Yes"
        this.context.onContextChange("plan", values)
    }

    handleNoClick() {
        this.setState({yes_color: "whitesmoke", yes_id: -1, no_id: 1, no_color: "lightslategrey"})
        const values = this.context["plan"]
        values["Admitting Patient"] = "No"
        this.context.onContextChange("plan", values)
    }

    generatePrescriptions = () => {
        const unit_options = [
            { key: 'mg', text: 'mg', value: 'mg' },
            { key: 'mL', text: 'mL', value: 'mL' },
        ]
        return this.state.prescriptions.map((prescription, i) => (
            <Input
                key={i}
                label={<Dropdown 
                    defaultValue='mg' 
                    options={unit_options} 
                    onChange={(e, data) => this.updatePrescription(i, 'unit', data.value)}/>}
                labelPosition='right'
                placeholder='0'
            />
        ));
    }

    updatePrescription = (index, type, value) => {
        const prescriptions = this.state.prescriptions.slice(); 
        const target = prescriptions[index];
        target[type] = value;
        this.setState({ prescriptions });
    } 

    render() {
        return (
            <div>
                <Header as='h3' dividing> Differential Diagnosis </Header>
                <Header as='h3' dividing> Prescriptions </Header>
                { this.state.prescriptions.map((prescription, i) => (
                    <Prescription
                        info={prescription}
                        onChange={(type, value) => this.updatePrescription(i, type, value)}
                    />
                ))}
                <AddRowButton 
                    name='prescription'
                    onClick={() => this.setState({ prescriptions: this.state.prescriptions.concat(PRESCRIPTION_DEFAULT) })}
                />
                <Header as='h3' dividing> Procedures and Services </Header>
                <Header as='h3' dividing> Referrals </Header>
                

                <h4> Differential Diagnosis </h4>
                <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Differential Diagnosis", event)} /> </div>
                <h4> Plan (Medications) </h4>
                <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Medications Plan", event)} /> </div>
                <h4> Plan (Procedures/Services) </h4>
                <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Procedures Plan", event)} /> </div>
                <h4> Referrals/Consults </h4>
                <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Referrals/Consults", event)} /> </div>
                <h4> How sick is the patient on a scale from 1 (healthy) to 10 (critically ill)? </h4>
                <NumericInput min={0} max={10} onChange={this.handleInputChange} />
                <h4> Will you be admitting this patient to the hospital? </h4>
                <button className="button_yesno" style={{backgroundColor: this.state.yes_color}} onClick={this.handleYesClick}> Yes </button> 
                <button className="button_yesno" style={{backgroundColor: this.state.no_color}} onClick={this.handleNoClick}> No </button>
                <h4> What other questions did you ask the patient that were not part of the existing questionnaire? </h4> 
                <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Other Questions", event)} /> </div>
            </div>
        )
    }
}

export default plan