import React, {Component} from 'react'
import HPIContext from 'contexts/HPIContext.js'
import { 
    Header, 
    Segment,
    Menu,
    Icon,
    Grid,
    Label,
    Dropdown,
} from 'semantic-ui-react';
import PlanInput from './PlanInput';
import DiagnosisForm from './DiscussionPlanDiagnosis';
import PrescriptionForm from './DiscussionPlanPrescription';
import ReferralForm from './DiscussionPlanReferral';
import ProcedureForm from './DiscussionPlanProcedure';
import { CONDITION_DEFAULT } from './DiscussionPlanDefaults';
import { DISCUSSION_PLAN_MENU_BP } from 'constants/breakpoints.js';
import './discussionPlan.css';


class plan extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context);
        this.state = {
            current: 0,
            yes_color: "whitesmoke",
            no_color: "whitesmoke",
            uncertain_color: "whitesmoke",
            windowWidth: 0,
            windowHeight: 0,
            dropdownOpen: false,
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.active_color = "lightslategrey";
        this.nonactive_color = "whitesmoke";
    }

    componentWillMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        this.setState({ windowHeight, windowWidth });
    }

    handleInputChange = (title, value) => {
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

    render() {
        const { plan } = this.context;
        const { current, windowWidth } = this.state;
        const mobile = windowWidth < DISCUSSION_PLAN_MENU_BP;
        const collapseTabs = mobile || plan.conditions.length * 150 > DISCUSSION_PLAN_MENU_BP;
        
        const expandedTabs = [];
        const dropdownTabs = [];
        this.context.plan.conditions.forEach((condition, i) => {
            expandedTabs.push(
                <Menu.Item onClick={() =>this.setState({current: i})} active={this.state.current === i}>
                    <PlanInput index={i} name={condition.name} />
                </Menu.Item>
            );
            dropdownTabs.push({
                key: i,
                name: condition.name,
                text: condition.name,
                value: condition.name,
                active: this.state.current === i,
                onClick: () => this.setState({current: i}),
            });
        });

        expandedTabs.push(
            <Menu.Item onClick={this.addCondition}>
                <Icon name='plus'/>
            </Menu.Item>);
        dropdownTabs.push({
            key: dropdownTabs.length,
            name: 'Add Condition',
            text: 'Add Condition',
            value: 'Add Condition',
            active: this.state.current === dropdownTabs.length,
            onClick: this.addCondition,
        });


        return (
            <div>
                { collapseTabs 
                    ? <CollapsedMenu tabs={dropdownTabs} index={current}/>
                    : <Menu stackable scrollable tabular items={expandedTabs}/>
                }
                { plan.conditions.length > 0 
                    && 
                (<React.Fragment>
                    <DiagnosisForm index={current} mobile={mobile}/>
                    <PrescriptionForm index={current} mobile={mobile}/>
                    <ProcedureForm index={current} mobile={mobile}/>
                    <ReferralForm index={current} mobile={mobile}/>
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

export default plan;

function CollapsedMenu(props) {
    const curTab = props.tabs[props.index];
    const dropdownTabs = props.tabs.map((tab) => {
        if (tab.name === 'Add Condition') {
            return (
                <Menu.Item onClick={tab.onClick}>
                    <Icon name='plus'/>
                </Menu.Item>
            );
        }
        return <Menu.Item {...tab} />
    });
    return (
        <Menu tabular>
            {curTab.name === 'Add Condition'
                ? <Menu.Item onClick={curTab.onClick}>
                    <Icon name='plus'/>
                </Menu.Item>
                : <Menu.Item {...curTab}>
                    <PlanInput name={curTab.name} index={curTab.key}/>
                </Menu.Item>
            }
            <Menu.Item>
                <Dropdown
                    value=''
                    icon='ellipsis horizontal'
                    options={dropdownTabs}
                />
            </Menu.Item>
        </Menu>
    )
}