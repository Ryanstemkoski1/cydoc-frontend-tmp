import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import { SOCIAL_HISTORY } from 'constants/constants';
import {Form, Grid, Input, Dropdown} from 'semantic-ui-react';
import tobaccoProducts from 'constants/SocialHistory/tobaccoProducts';
import '../familyhistory/FamilyHistory.css';

class Tobacco extends React.Component {

    constructor(props) {
        super(props);
        this.tobaccoFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS.Tobacco;
        this.additionalFields = this.additionalFields.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
    }

    // handles user click for the dropdown menu (products used)
    handleDropdown(event, data) {
        let newState = this.props.values;
        newState['Tobacco'][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    // asks for packs per day, number of years, and products used
    additionalFields() {

        const condition = this.tobaccoFields.condition;
        const fields = this.tobaccoFields;
        const values = this.props.values;

        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                <Grid stackable>
                    <Grid.Row columns="equal">
                        <Grid.Column>
                            <Form.Field>
                                {fields["firstField"]}
                                <Input
                                    type="number"
                                    field={fields["firstField"]}
                                    condition={condition}
                                    value={values[condition][fields["firstField"]]}
                                    onChange={this.props.onChange}
                                />
                            </Form.Field> 
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                {fields["secondField"]}
                                {/* TODO: require numerical value, type=number might not work on all browsers? */}
                                <Input
                                    type="number"
                                    field={fields["secondField"]}
                                    condition={condition}
                                    value={values[condition][fields["secondField"]]}
                                    onChange={this.props.onChange}
                                />
                            </Form.Field> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {fields["thirdField"]}
                            <Dropdown
                                placeholder={fields["thirdField"]}
                                fluid
                                multiple
                                search
                                selection
                                options={tobaccoProducts}
                                onChange={this.handleDropdown}
                                value={values[condition][fields["thirdField"]]}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }

    // renders a SocialHistoryNoteItem with information specific to the Tobacco section
    render() {
        return (
            <SocialHistoryNoteItem
                onChange={this.props.onChange}
                onToggleButtonClick={this.props.onToggleButtonClick}
                onInterestedButtonClick={this.props.onInterestedButtonClick}
                onTriedButtonClick={this.props.onTriedButtonClick}
                condition={this.tobaccoFields.condition}
                fields={this.tobaccoFields}
                values={this.props.values}
                additionalFields={this.additionalFields}
            />
        )
    }

}

export default Tobacco;