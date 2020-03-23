import {Checkbox, Form, Grid, TextArea, Button} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component, Fragment} from "react";
import PropTypes from 'prop-types';
import { render } from "react-dom";
import FamilyHistoryDropdown from "./FamilyHistoryDropdown";
import HPIContext from "../../contexts/HPIContext"
import FamilyHistoryCauseofDeath from "../discussionplan/FamilyHistoryCauseofDeath";


//Component for a row in the Family History GridContent
export default class FamilyHistoryNoteRow extends Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context)
        this.handlePlusClick = this.handlePlusClick.bind(this)
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

    render = () => {
        const { yesActive, condition, onToggleButtonClick, noActive, CODActive, familyMember, onChange, comments, index } = this.props;
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
                    index = {index}
                    family_index = {step}
                /> )
            cause_of_death_list.push(
                <FamilyHistoryCauseofDeath
                    condition = {condition}
                    index = {index}
                    family_index = {step}
                 /> )
        }
        return (
            <Grid.Row>
                <Grid.Column>
                    {condition}
                </Grid.Column>
                <Grid.Column>
                    <ToggleButton active={yesActive}
                                  condition={condition}
                                  title="Yes"
                                  onToggleButtonClick={onToggleButtonClick}/>
                    <ToggleButton active={noActive}
                                  condition={condition}
                                  title="No"
                                  onToggleButtonClick={onToggleButtonClick}/>
                </Grid.Column>
                <Grid.Column>
                {dropdown_list}
                <Fragment>
                    <Button
                        basic
                        circular
                        icon="plus"
                        size='mini'
                        onClick = {this.handlePlusClick}
                    />
                </Fragment>
                </Grid.Column>
                <Grid.Column>
                    {cause_of_death_list}
                </Grid.Column>
                <Grid.Column>
                    <Form>
                    <TextArea condition={condition} value={comments}
                                  onChange={onChange} placeholder='Comments'/>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        )
    }
    
}

FamilyHistoryNoteRow.propTypes = {
    condition: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
};