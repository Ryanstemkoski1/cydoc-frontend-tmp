import React from 'react';
import './BodySystemDropdown';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ToggleButton from 'components/tools/ToggleButton';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import { ChiefComplaintsProps } from '../../HPIContent';

interface ChiefComplaintsButtonProps {
    name: string;
}

class ChiefComplaintsButton extends React.Component<Props> {
    render() {
        const { selectChiefComplaint, name, chiefComplaints } = this.props;
        return (
            <ToggleButton
                className='tag_text'
                active={name in chiefComplaints}
                condition={name}
                title={name}
                onToggleButtonClick={(): SelectChiefComplaintAction =>
                    selectChiefComplaint(name)
                }
            />
        );
    }
}

interface DispatchProps {
    selectChiefComplaint: (disease: string) => SelectChiefComplaintAction;
}

const mapStateToProps = (state: CurrentNoteState): ChiefComplaintsProps => ({
    chiefComplaints: selectChiefComplaintsState(state),
});

type Props = DispatchProps & ChiefComplaintsButtonProps & ChiefComplaintsProps;

const mapDispatchToProps = {
    selectChiefComplaint,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChiefComplaintsButton);
