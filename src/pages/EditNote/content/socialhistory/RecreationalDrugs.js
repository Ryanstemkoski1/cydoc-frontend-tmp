import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import SocialHistoryTableContent from './SocialHistoryTableContent';
import { SOCIAL_HISTORY } from 'constants/constants';

import HPIContext from 'contexts/HPIContext';

class RecreationalDrugs extends React.Component {
    static contextType = HPIContext;

    constructor(props) {
        super(props);
        this.recreationalDrugsFields =
            SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS['Recreational Drugs'];
        this.additionalFields = this.additionalFields.bind(this);
    }

    // creates a SocialHistoryTableContent where user can enter drug name, mode of delivery, and number per week
    additionalFields() {
        const condition = this.recreationalDrugsFields.condition;
        const fields = this.recreationalDrugsFields;
        const values = this.props.values;

        if (values[condition]['Yes'] || values[condition]['In the Past']) {
            return (
                <SocialHistoryTableContent
                    mobile={this.props.mobile}
                    tableHeaders={[
                        fields.firstField,
                        fields.secondField,
                        fields.thirdField,
                        '',
                    ]}
                    tableBodyPlaceholders={[
                        fields.firstField,
                        fields.secondField,
                        fields.thirdField,
                        'delete',
                    ]}
                    onTableBodyChange={this.context.onContextChange.bind(
                        this.context,
                        'Social History'
                    )}
                    name={condition}
                    values={values}
                    category={'Social History'}
                    addRow='drug'
                    prompt={
                        values[condition]['In the Past']
                            ? 'Please summarize what recreational drugs you previously used:'
                            : 'Please summarize your current drug use:'
                    }
                />
            );
        }
    }

    // renders a SocialHistoryNoteItem with information specific to RecreationalDrugs
    render() {
        return (
            <SocialHistoryNoteItem
                onChange={this.props.onChange}
                onToggleButtonClick={this.props.onToggleButtonClick}
                onInterestedButtonClick={this.props.onInterestedButtonClick}
                onTriedButtonClick={this.props.onTriedButtonClick}
                condition={this.recreationalDrugsFields.condition}
                fields={this.recreationalDrugsFields}
                values={this.props.values}
                additionalFields={this.additionalFields}
            />
        );
    }
}

export default RecreationalDrugs;
