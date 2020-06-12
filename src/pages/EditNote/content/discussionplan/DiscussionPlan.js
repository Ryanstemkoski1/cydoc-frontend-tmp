import React, {Component} from 'react'
import HPIContext from 'contexts/HPIContext.js'
import { 
    Header, 
    Segment,
    Menu,
    Icon,
    Grid,
    Label,
} from 'semantic-ui-react';
import PlanInput from './PlanInput';
import DiagnosisForm from './DiscussionPlanDiagnosis';
import PrescriptionForm from './DiscussionPlanPrescription';
import ReferralForm from './DiscussionPlanReferral';
import ProcedureForm from './DiscussionPlanProcedure';
import { CONDITION_DEFAULT } from './DiscussionPlanDefaults';
import './discussionPlan.css';


class plan extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context);
        this.state = {
            current: 0,
            textInput: "",
            yes_id: 0,
            no_id: 0,
            uncertain_id: 0,
            yes_color: "whitesmoke",
            no_color: "whitesmoke",
            uncertain_color: "whitesmoke",
        }
        this.active_color = "lightslategrey";
        this.nonactive_color = "whitesmoke";
    }

    handleInputChange = (title, value) => {
        // this.setState({textInput: event.target.value})
        const plan = {...this.context["plan"]}
        plan['survey'][title] = value;
        this.context.onContextChange("plan", plan)
    }
    
    handleOnClick = (type, value) => {
        const values = this.context["plan"]
        values['survey'][type] = value;
        this.context.onContextChange("plan", values)
    }

    addCondition = () => {
        const { plan } = this.context;
        const conditions = plan.conditions.concat({ ...JSON.parse(JSON.stringify(CONDITION_DEFAULT)) });
        plan.conditions = conditions;
        this.context.onContextChange('plan', plan);
        this.setState({ current: conditions.length - 1});
    }

    componentDidMount() {
        const plan = { ...this.context.plan };
        if (!('survey' in plan)) {
            plan['survey'] = {'sickness': 0, 'admit_to_hospital': '', 'emergency': ''};
            this.context.onContextChange('plan', plan);   
        }
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
                        <ProcedureForm index={current}/>
                        <ReferralForm index={current}/>
                    </React.Fragment>)}
                <Header as='h4' attached='top'> Help Improve Cydoc </Header>
                <Segment attached>
                    <Grid stackable columns={2}>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <h4> How sick is the patient? </h4>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <label> Healthy </label>
                                <input 
                                    type='range' 
                                    min={0} 
                                    max={10} 
                                    step={1} 
                                    value={plan['survey']['sickness']}
                                    onChange={(e) => this.handleInputChange('sickness', parseInt(e.target.value))} 
                                    />
                                <label> Sick </label>
                                <Label circular>{plan['survey']['sickness']}</Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <h4> Will the patient be sent to the emergency department? </h4>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <button 
                                    className="button_yesno" 
                                    style={{backgroundColor: plan['survey']['emergency'] === 'Yes' ? this.active_color : this.nonactive_color}} 
                                    onClick={() => this.handleOnClick('emergency', 'Yes')}> 
                                    Yes 
                                </button> 
                                <button 
                                    className="button_yesno" 
                                    style={{backgroundColor: plan['survey']['emergency'] === 'No' ? this.active_color : this.nonactive_color}} 
                                    onClick={() => this.handleOnClick('emergency', 'No')}> 
                                    No 
                                </button> 
                                <button 
                                    className="button_yesno" 
                                    style={{backgroundColor: plan['survey']['emergency'] === 'Uncertain' ? this.active_color : this.nonactive_color}} 
                                    onClick={() => this.handleOnClick('emergency', 'Uncertain')}> 
                                    Uncertain 
                                </button> 
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <h4> Will the patient be admitted to the hospital? </h4>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <button 
                                    className="button_yesno" 
                                    style={{backgroundColor: plan['survey']['admit_to_hospital'] === 'Yes' ? this.active_color : this.nonactive_color}} 
                                    onClick={() => this.handleOnClick('admit_to_hospital', 'Yes')}> 
                                    Yes 
                                </button> 
                                <button 
                                    className="button_yesno" 
                                    style={{backgroundColor: plan['survey']['admit_to_hospital'] === 'No' ? this.active_color : this.nonactive_color}} 
                                    onClick={() => this.handleOnClick('admit_to_hospital', 'No')}> 
                                    No 
                                </button> 
                                <button 
                                    className="button_yesno" 
                                    style={{backgroundColor: plan['survey']['admit_to_hospital'] === 'Uncertain' ? this.active_color : this.nonactive_color}} 
                                    onClick={() => this.handleOnClick('admit_to_hospital', 'Uncertain')}> 
                                    Uncertain 
                                </button> 
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}

export default plan