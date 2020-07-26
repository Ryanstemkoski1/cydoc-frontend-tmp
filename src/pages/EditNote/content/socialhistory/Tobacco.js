import React from 'react';
import SocialHistoryNoteItem from './SocialHistoryNoteItem';
import { SOCIAL_HISTORY } from 'constants/constants';

class Tobacco extends React.Component {

    constructor(props) {
        super(props);
        this.tobaccoFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS.Tobacco;
    }

    render() {
        return (
            <SocialHistoryNoteItem
                onChange={this.props.onChange}
                onToggleButtonClick={this.props.onToggleButtonClick}
                condition={this.tobaccoFields.condition}
                fields={this.tobaccoFields}
                values={this.props.values}
            />
        )
    }

}

export default Tobacco;