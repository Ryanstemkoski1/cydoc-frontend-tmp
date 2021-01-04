import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import SocialHistoryTableContent from './SocialHistoryTableContent';
import { SOCIAL_HISTORY } from 'constants/constants';
import HPIContext from 'contexts/HPIContext';

class Alcohol extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.alcoholFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS.Alcohol;
        this.additionalFields = this.additionalFields.bind(this);
    }

    // if currently uses alcohol or used in past, create the SocialHistoryTableContent so that a user can summarize their drinking
    additionalFields() {
        const condition = this.alcoholFields.condition;
        const fields = this.alcoholFields;
        const values = this.props.values;
        
        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                <SocialHistoryTableContent
                    mobile={this.props.mobile}
                    tableHeaders={[fields.firstField, fields.secondField, fields.thirdField, '']}
                    tableBodyPlaceholders={[fields.firstField, fields.secondField, fields.thirdField, 'delete']}
                    onTableBodyChange={this.context.onContextChange.bind(this.context, 'Social History')}
                    name={condition}
                    values={values}
                    category={'Social History'}
                    addRow='drink type'
                    prompt={values[condition]["In the Past"] ? 'Please summarize what you used to drink:' : 'Please summarize your current drinking habits:'}
                />
            )
        }
    }

    // renders a SocialHistoryNoteItem with information specific to the Alcohol section
    render() {
        return (
            <SocialHistoryNoteItem
                onChange={this.props.onChange}
                onToggleButtonClick={this.props.onToggleButtonClick}
                onInterestedButtonClick={this.props.onInterestedButtonClick}
                onTriedButtonClick={this.props.onTriedButtonClick}
                condition={this.alcoholFields.condition}
                fields={this.alcoholFields}
                values={this.props.values}
                additionalFields={this.additionalFields}
            />
        )
    }

}

export default Alcohol;