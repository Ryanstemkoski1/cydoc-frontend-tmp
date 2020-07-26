import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import { SOCIAL_HISTORY } from 'constants/constants';

class Alcohol extends React.Component {

    constructor(props) {
        super(props);
        this.alcoholFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS.Alcohol;
    }

    render() {
        return (
            <SocialHistoryNoteItem
                onChange={this.props.onChange}
                onToggleButtonClick={this.props.onToggleButtonClick}
                condition={this.alcoholFields.condition}
                fields={this.alcoholFields}
                values={this.props.values}
            />
        )
    }

}

export default Alcohol;