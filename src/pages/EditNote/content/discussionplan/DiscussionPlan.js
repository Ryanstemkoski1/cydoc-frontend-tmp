import React, {Component} from 'react'
import NumericInput from "react-numeric-input";
import HPIContext from 'contexts/HPIContext.js'
import { 
    Header, 
    Input, 
    Dropdown,
    Grid,
    Segment,
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
const PROCEDURES_DEFAULT = {
    date: '',
    procedure: '',
    comment: '',
};

function DiagnosisForm(props) {
    return (
        <Grid columns={2} stackable>
            <Grid.Row>
                <Grid.Column>
                    <Input
                        fluid
                        placeholder='Condition'
                    />
                    <Input
                        fluid
                        placeholder='Diagnosis'
                    />
                </Grid.Column>
                <Grid.Column>
                    <div className='ui form'>
                        <textarea placeholder='Comments'/>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

function ProcedureForm(props) {
    const { all_data, updatePlan } = props;
    return (
        <Grid columns={3} stackable>
            {
                all_data.map((info, i) => (
                <Grid.Row>
                    <Grid.Column>
                        <h4>Procedure</h4>
                        <Input
                            fluid
                            type='text'
                            placeholder='Procedure'
                            defaultValue={info.procedure}
                            onChange={(e) => updatePlan(i, 'procedure', e.target.value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <h4>Approximate Date</h4>
                        <Input
                            fluid
                            type='date'
                            defaultValue={info.date}
                            onChange={(e) => updatePlan(i, 'date', e.target.value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <h4>Comments</h4>
                        <div className='ui form'>
                            <textarea value={info.comment} onChange={(e) => updatePlan(i, 'comment', e.target.value)}/>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                ))
            }
        </Grid>
    );
}

function PrescriptionForm(props) {
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
    const { all_prescriptions, updatePlan } = props;
    return (
        <Grid columns={3} stackable>
            {
                all_prescriptions.map((info, i) => (
                <Grid.Row>
                    <Grid.Column>
                        <h4> Recipe (Rx) </h4>
                        <Dropdown
                            fluid
                            selection
                            defaultValue={info.rx_type}
                            options={RX_TYPE_OPTIONS}
                            onChange={(e, data) => updatePlan(i, 'rx_type', data.value)}
                        />
                        <Input
                            fluid
                            type='number'
                            labelPosition='right'
                            min={0}
                            placeholder={0}
                            defaultValue={info.rx_amount}
                            label={<Dropdown 
                                defaultValue={info.rx_unit}
                                options={RX_UNIT_OPTIONS} 
                                onChange={(e, data) => updatePlan(i, 'rx_unit', data.value)}/>}
                            onChange={(e, data) => updatePlan(i, 'rx_amount', data.value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <h4> Signatura (Sig) </h4>
                        <Input
                            fluid
                            type='number'
                            labelPosition='right'
                            min={0}
                            placeholder={0}
                            defaultValue={info.sig_amount}
                            label={<Dropdown 
                                defaultValue={info.sig_unit}
                                options={SIG_UNIT_OPTIONS} 
                                onChange={(e, data) => updatePlan( i, 'sig_unit', data.value)}/>}
                            onChange={(e, data) => updatePlan(i, 'sig_amount', data.value)}
                        />
                        <Input
                            fluid
                            selection
                            placeholder='e.g. 1 pill, everyday, with water'
                            defaultValue={info.sig_type}
                            options={RX_TYPE_OPTIONS}
                            onChange={(e, data) => updatePlan(i, 'sig_comment', data.value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <h4> Comments </h4>
                        <div className='ui form'>
                            <textarea value={info.comment} onChange={(e, data) => updatePlan(i, 'comment', e.target.value)}/>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                ))
            }
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
            procedures: [{...PROCEDURES_DEFAULT}],
            referrals: [{...PROCEDURES_DEFAULT}],
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

    updatePlan = (section, index, type, value) => {
        const values = this.state[section].slice(); 
        const target = values[index];
        target[type] = value;
        this.setState({ [section]: values });
    } 

    render() {
        return (
            <div>
                <Segment>
                    <Header as='h3' dividing> Differential Diagnosis </Header>
                    <DiagnosisForm/>
                    <Header as='h3' dividing> Prescriptions </Header>
                    <PrescriptionForm
                        all_prescriptions={this.state.prescriptions}
                        updatePlan={(i, type, value) => this.updatePlan('prescriptions', i, type, value)}
                    />
                    <AddRowButton 
                        name='prescription'
                        onClick={() => this.setState({ prescriptions: this.state.prescriptions.concat(PRESCRIPTION_DEFAULT) })}
                    />
                    <Header as='h3' dividing> Procedures and Services </Header>
                    <ProcedureForm
                        all_data={this.state.procedures}
                        updatePlan={(i, type, value) => this.updatePlan('procedures', i, type, value)}
                    />
                    <AddRowButton 
                        name='procedure or service'
                        onClick={() => this.setState({ procedures: this.state.procedures.concat(PROCEDURES_DEFAULT) })}
                    />
                    <Header as='h3' dividing> Referrals </Header>
                    <ProcedureForm
                        all_data={this.state.referrals}
                        updatePlan={(i, type, value) => this.updatePlan('referrals', i, type, value)}
                    />
                    <AddRowButton 
                        name='referral'
                        onClick={() => this.setState({ referrals: this.state.referrals.concat(PROCEDURES_DEFAULT) })}
                    />
                </Segment>
                <Header as='h2' attached='top'>
                    Help Improve Cydoc
                </Header>
                <Segment attached>
                    <h4> How sick is the patient on a scale from 1 (healthy) to 10 (critically ill)? </h4>
                    <NumericInput min={0} max={10} onChange={this.handleInputChange} />
                    <h4> Will you be admitting this patient to the hospital? </h4>
                    <button className="button_yesno" style={{backgroundColor: this.state.yes_color}} onClick={this.handleYesClick}> Yes </button> 
                    <button className="button_yesno" style={{backgroundColor: this.state.no_color}} onClick={this.handleNoClick}> No </button>
                    <h4> What other questions did you ask the patient that were not part of the existing questionnaire? </h4> 
                    <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Other Questions", event)} /> </div>
                </Segment>
            </div>
        )
    }
}

export default plan