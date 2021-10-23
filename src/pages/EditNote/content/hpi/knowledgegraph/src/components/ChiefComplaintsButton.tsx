import React from 'react';
import './BodySystemDropdown';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ToggleButton from 'components/tools/ToggleButton';
import '../css/DiseaseTag.css';

interface ChiefComplaintsButtonProps {
    name: string;
}

class ChiefComplaintsButton extends React.Component<Props> {
    render() {
        const { chiefComplaints, selectChiefComplaint, name } = this.props;
        return (
            <ToggleButton
                className='tag_text'
                active={chiefComplaints.includes(name)}
                condition={name}
                title={name}
                onToggleButtonClick={(): SelectChiefComplaintAction =>
                    selectChiefComplaint(name)
                }
            />
        );
    }
}

export interface ChiefComplaintsProps {
    chiefComplaints: ChiefComplaintsState;
}

interface DispatchProps {
    selectChiefComplaint: (disease: string) => SelectChiefComplaintAction;
}

const mapStateToProps = (state: CurrentNoteState): ChiefComplaintsProps => ({
    chiefComplaints: state.chiefComplaints,
});

type Props = ChiefComplaintsProps & DispatchProps & ChiefComplaintsButtonProps;

const mapDispatchToProps = {
    selectChiefComplaint,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChiefComplaintsButton);
