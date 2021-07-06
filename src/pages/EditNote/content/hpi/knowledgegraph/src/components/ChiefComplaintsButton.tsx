import React from 'react';
import './BodySystemDropdown';
import { DoctorView } from 'constants/hpiEnums';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { ChiefComplaintsState } from 'redux/reducers/chiefComplaintsReducer';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';

interface ChiefComplaintsButtonProps {
    name: DoctorView;
}

class ChiefComplaintsButton extends React.Component<Props> {
    render() {
        const { chiefComplaints, selectChiefComplaint, name } = this.props;
        const selected = chiefComplaints.includes(name);
        return (
            <button
                className='tag_text'
                style={{
                    backgroundColor: selected ? 'lightslategrey' : 'whitesmoke',
                    color: selected ? 'white' : 'black',
                }}
                onClick={(): SelectChiefComplaintAction =>
                    selectChiefComplaint(name)
                }
            >
                {name}
            </button>
        );
    }
}

export interface ChiefComplaintsProps {
    chiefComplaints: ChiefComplaintsState;
}

interface DispatchProps {
    selectChiefComplaint: (disease: DoctorView) => SelectChiefComplaintAction;
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
