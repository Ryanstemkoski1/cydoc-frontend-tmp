import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
    SetNotesChiefComplaintAction,
    setNotesChiefComplaint,
} from 'redux/actions/chiefComplaintsActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import {
    Accordion,
    AccordionTitleProps,
    Form,
    Icon,
    TextArea,
} from 'semantic-ui-react';
import { ChiefComplaintsProps } from '../../HPIContent';
import { PatientViewProps } from './ChiefComplaintsButton';

const MiscBox = (props: Props) => {
    const {
        activeThing,
        chiefComplaints,
        patientView,
        setNotesChiefComplaint,
        step,
    } = props;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const miscNotesClick = (
        _e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        titleProps: AccordionTitleProps
    ) => {
        const newIndex =
            activeIndex === titleProps.index
                ? -1
                : (titleProps.index as number);
        setActiveIndex(newIndex);
    };
    return (
        <>
            {!patientView && (
                <Accordion
                    className={
                        activeIndex !== 0
                            ? 'hpi-text-drop'
                            : 'hpi-text-drop-folded'
                    }
                >
                    <Accordion.Title
                        active={activeIndex !== 0}
                        index={0}
                        onClick={miscNotesClick}
                    >
                        <Icon name='dropdown' />
                        Misc Notes: &nbsp;{Object.keys(chiefComplaints)[step]}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex !== 0}>
                        <Form>
                            <TextArea
                                className='misc-box'
                                rows={3}
                                onChange={(_e, { value }) => {
                                    setNotesChiefComplaint(
                                        activeThing as string,
                                        value
                                    );
                                }}
                                value={chiefComplaints[activeThing]}
                            />
                        </Form>
                    </Accordion.Content>
                </Accordion>
            )}
        </>
    );
};
const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps & PatientViewProps => {
    return {
        chiefComplaints: state.chiefComplaints,
        patientView: selectPatientViewState(state),
    };
};
const mapDispatchToProps = {
    setNotesChiefComplaint,
};
interface DispatchProps {
    setNotesChiefComplaint: (
        disease: string,
        notes: string | number | undefined
    ) => SetNotesChiefComplaintAction;
}
interface IProps {
    activeThing: string;
    step: number;
}
type Props = ChiefComplaintsProps & PatientViewProps & DispatchProps & IProps;

export default connect(mapStateToProps, mapDispatchToProps)(MiscBox);
