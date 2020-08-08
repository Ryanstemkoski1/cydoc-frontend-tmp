import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import { SOCIAL_HISTORY } from 'constants/constants';
import {Form, Grid, Input, Dropdown} from 'semantic-ui-react';
import tobaccoProducts from 'constants/SocialHistory/tobaccoProducts';


class Tobacco extends React.Component {

    constructor(props) {
        super(props);
        this.tobaccoFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS.Tobacco;
        this.additionalFields = this.additionalFields.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
    }

    handleDropdown(event, data) {
        let newState = this.props.values;
        newState['Tobacco'][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    additionalFields() {

        const condition = this.tobaccoFields.condition;
        const fields = this.tobaccoFields;
        const values = this.props.values;

        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                <div>
                    <Grid stackable columns="equal">
                        {Object.keys(fields).map(key => (
                            key !== "condition" && key !== "quitYear" && key !== "thirdField" ?
                            <Grid.Column computer={5} tablet={8} mobile={16}>
                                <Form.Field>
                                    <label>{fields[key]}</label>
                                    <Input
                                        field={fields[key]}
                                        condition={condition}
                                        value={values[condition][fields[key]]}
                                        onChange={this.props.onChange}
                                    />
                                </Form.Field> 
                            </Grid.Column> : fields[key] === "Products Used" ? 
                            <Grid.Column>
                                <label>{fields[key]}</label>
                                <Dropdown
                                    placeholder={fields[key]}
                                    fluid
                                    multiple
                                    search
                                    selection
                                    options={tobaccoProducts}
                                    onChange={this.handleDropdown}
                                    // value={values[condition][key]} how to do value when array??
                                />
                            </Grid.Column> : null
                        ))}
                    </Grid>
                </div>
            )
        }
    }

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