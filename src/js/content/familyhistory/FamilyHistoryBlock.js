import React, {Component, Fragment} from "react";
import {Form, Grid, TextArea, Button, Header} from "semantic-ui-react";
import HPIContext from "../../contexts/HPIContext"
import ToggleButton from "../../components/ToggleButton";
import FamilyHistoryDropdown from "./FamilyHistoryDropdown";
import GridContent from "../../components/GridContent";

export default class FamilyHistoryBlock extends Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context)
        this.handlePlusClick = this.handlePlusClick.bind(this)
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this)
    }

    handlePlusClick() {
        /*
            Allows user to add additional family member for a given condition. If the previous family member dropdown 
            was left blank, the user cannot add an additional family member (until at least the previous dropdown was filled). 
         */
        var values = this.context['Family History']
        var members = values[this.props.index]['Family Member']
        if (members[members.length-1]) values[this.props.index]['Family Member'].push("")
        this.context.onContextChange("Family History", values)
    }

    handleToggleButtonClick(event, data){
        let index = data.condition.props.index
        const values = this.context["Family History"];
        const responses = ["Yes", "No"]
        const prevState = values[index][data.title];
        values[index][data.title] = ! prevState;
        for (var response_index in responses) {
            var response = responses[response_index]
            if (data.title !== response) values[index][response] = false
        }
        this.context.onContextChange("Family History", values);
    }

    render() {
        const { yesActive, condition, noActive, CODActive, familyMember, onChange, comments, index } = this.props;
        // array of dropdowns displayed on Family History Family Member column
        let dropdown_list = []
        // array that lines up with the family history family member column, 
        // indicating whether something is a cause of death or not for a family member 
        let cause_of_death_list = []
        // variable range that changes when the user clicks the + (add member) button 
        var range = this.context["Family History"][index]["Family Member"].length 
        // if the range is 0 then we want there to be at least one dropdown
        range = range > 0 ? range : 1
        for (let step = 0; step < range; step ++) {
            dropdown_list.push(
                <FamilyHistoryDropdown
                    condition = {condition}
                    index = {index}
                    family_index = {step}
                /> )
        }
        const new_content_header = 
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header as="h4" style={{display: 'inline'}}>Family Member</Header>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header as="h4">Cause of Death</Header>
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Header as="h4">Comments</Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        const new_row = 
        <Grid.Row>
                <Grid.Column width={7} style={{marginBottom: 10, marginTop: 30}}>
                    {dropdown_list}
                <Fragment>
                    <Button
                        basic
                        circular
                        icon="plus"
                        size='mini'
                        onClick = {this.handlePlusClick}
                    />
                    add family member
                </Fragment>
                </Grid.Column>
                <Grid.Column width={9}>
                    <Form>
                    <TextArea condition={condition} value={comments}
                                  onChange={onChange} placeholder='Comments'/>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        return (
            <div style={{marginBottom: 30}}> 
            <div> 
                {condition} 
                <ToggleButton active={this.context["Family History"][condition.props.index]["Yes"]}
                            condition={condition}
                            title="Yes"
                            onToggleButtonClick={this.handleToggleButtonClick}/>
                <ToggleButton active={this.context["Family History"][condition.props.index]["No"]}
                            condition={condition}
                            title="No"
                            onToggleButtonClick={this.handleToggleButtonClick}/>
            
            </div> 
                {this.context["Family History"][condition.props.index]["Yes"] ? 
                    <Fragment>
                        <GridContent
                            numColumns={2}
                            contentHeader={new_content_header}
                            rows={new_row}
                            value_type = "Family History"
                        />
                    </Fragment> : ""
                }
            </div>
        )
    }
}