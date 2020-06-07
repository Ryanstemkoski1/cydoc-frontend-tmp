import React, {Component} from 'react'
import NumericInput from "react-numeric-input";
import HPIContext from 'contexts/HPIContext.js'
import { 
    Header, 
    Segment,
    Menu,
    Icon,
} from 'semantic-ui-react';
import PlanInput from './PlanInput';
import DiagnosisForm from './DiscussionPlanDiagnosis';
import PrescriptionForm from './DiscussionPlanPrescription';
import GeneralForm from './DiscussionPlanForm';
import { CONDITION_DEFAULT, PROCEDURES_DEFAULT, REFERRAL_DEFAULT } from './DiscussionPlanDefaults';
import procedures from 'constants/procedures';
import constants from 'constants/registration-constants.json';
import './discussionPlan.css';

const specialtyOptions = constants.specialties.map((specialty) => ({ key: specialty, text: specialty, value: specialty }));

class plan extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context);
        this.state = {
            current: 0,
            textInput: "",
            yes_id: 0,
            no_id: 0,
            yes_color: "whitesmoke",
            no_color: "whitesmoke",
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

    addCondition = () => {
        const { plan } = this.context;
        const conditions = plan.conditions.concat({ ...JSON.parse(JSON.stringify(CONDITION_DEFAULT)) });
        plan.conditions = conditions;
        this.context.onContextChange('plan', plan);
        this.setState({ current: conditions.length - 1});
    }

    render() {
        const { plan } = this.context;
        const { current } = this.state;

        const plans = this.context.plan.conditions.map((condition, i) => 
            <Menu.Item onClick={() => this.setState({current: i})} active={this.state.current === i}>
                <PlanInput index={i} name={condition.name} />
            </Menu.Item>
        );
        plans.push(
            <Menu.Item onClick={this.addCondition}>
                <Icon name='plus'/>
            </Menu.Item>);
        return (
            <div>
                <Menu stackable tabular items={plans}/>
                    { plan.conditions.length > 0 
                        && 
                    (<React.Fragment>
                        <DiagnosisForm index={current}/>
                        <PrescriptionForm index={current}/>
                        <GeneralForm
                            type='procedure'
                            header='Procedures and Services'
                            subheader='procedure'
                            placeholder='Procedure'
                            addRowName='procedure or service'
                            options={procedures}
                            default={PROCEDURES_DEFAULT}
                            index={current}
                        />
                        <GeneralForm
                            type='referral'
                            header='Referrals'
                            subheader='Refer to'
                            placeholder='Department'
                            addRowName='referral'
                            options={specialtyOptions}
                            default={REFERRAL_DEFAULT}
                            index={current}
                        />
                    </React.Fragment>)}
                <Header as='h4' attached='top'>
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