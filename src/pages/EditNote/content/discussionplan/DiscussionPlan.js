import React, {Component} from 'react'
import HPIContext from 'contexts/HPIContext.js'
import { 
    Menu,
    Icon,
    Dropdown,
    Button,
    Modal,
} from 'semantic-ui-react';
import PlanInput from './PlanInput';
import DiscussionPlanForm from './DiscussionPlanForm';
import DiscussionPlanSurvey from './DiscussionPlanSurvey';
import { CONDITION_DEFAULT, FORM_DEFAULTS } from './DiscussionPlanDefaults';
import { DISCUSSION_PLAN_MENU_BP, DISCUSSION_PLAN_SECTION_BP } from 'constants/breakpoints.js';
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

    addCondition = () => {
        const { plan } = this.context;
        const conditions = plan.conditions.concat({ ...JSON.parse(JSON.stringify(CONDITION_DEFAULT)) });
        plan.conditions = conditions;
        this.context.onContextChange('plan', plan);
        this.setState({ current: conditions.length - 1});
    }

    updateCurrent = (index) => {
        if (index !== 0) {
            this.setState({ current: index - 1});
        } 
    }

    render() {
        const { plan } = this.context;
        const { current, windowWidth } = this.state;
        const collapseTabs = windowWidth < DISCUSSION_PLAN_MENU_BP 
        || plan.conditions.length * 150 > DISCUSSION_PLAN_MENU_BP;
        const mobile = windowWidth < DISCUSSION_PLAN_SECTION_BP;
        
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

        let subsections;
        if (plan.conditions.length > 0) {
            subsections = Object.keys(FORM_DEFAULTS).map((section, i) => (
                <DiscussionPlanForm
                    key={i}
                    index={current}
                    mobile={mobile}
                    type={section}
                />
            ));
        }

        return (
            <div>
                { collapseTabs 
                    ? <CollapsedMenu tabs={dropdownTabs} index={current} updateCurrent={this.updateCurrent}/>
                    : <Menu stackable scrollable tabular>
                        {expandedTabs}
                        {expandedTabs.length > 1
                            &&
                        <Menu.Menu className='delete-btn-wrapper' position='right'>
                            <DeleteCard name={plan['conditions'][current].name} index={current} updateCurrent={this.updateCurrent}/>
                        </Menu.Menu>
                        }
                    </Menu>
                }
                {subsections}
                <DiscussionPlanSurvey plan={plan}/>
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
            {curTab.name !== 'Add Condition'
                && <Menu.Item {...curTab}>
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
            {props.tabs.length > 1
                &&
            <Menu.Menu className='delete-btn-wrapper' position='right'>
                <DeleteCard name={curTab.name} index={curTab.key} updateCurrent={props.updateCurrent}/>
            </Menu.Menu>
            }
        </Menu>
    )
}

class DeleteCard extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
        }
    }

    open = () => this.setState({ openModal: true });
    close = () => this.setState({ openModal: false });
    delete = () => {
        this.props.updateCurrent(this.props.index);
        const plan = {...this.context.plan}
        plan['conditions'].splice(this.props.index, 1);
        this.context.onContextChange('plan', plan);
        this.close();
    }

    render() {
        return (
            <Modal 
                size='mini' 
                open={this.state.openModal} 
                onClose={this.close} 
                trigger={<Icon onClick={this.open} name='trash alternate outline' className='delete-btn'/>}
            >
                <Modal.Content>
                    Are you sure you want you delete the plan for {this.props.name}?
                </Modal.Content>
                <Modal.Content>
                    <Button color='grey' content='Cancel'onClick={this.close} />
                    <Button color='violet' content='Delete'onClick={this.delete} floated='right'/>
                </Modal.Content>
            </Modal>
        )
    }
}