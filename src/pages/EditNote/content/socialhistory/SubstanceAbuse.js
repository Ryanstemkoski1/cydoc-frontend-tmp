import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import { SOCIAL_HISTORY } from 'constants/constants';

class SubstanceAbuse extends React.Component {

    constructor(props) {
        super(props);
        this.substanceAbuseFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS["Substance Abuse"];
    }

    render() {
        return (
            <SocialHistoryNoteItem
                onChange={this.props.onChange}
                onToggleButtonClick={this.props.onToggleButtonClick}
                condition={this.substanceAbuseFields.condition}
                fields={this.substanceAbuseFields}
                values={this.props.values}
            />
        )
    }

}

export default SubstanceAbuse;