import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
    Icon,
    Accordion,
    Form,
    TextArea,
    AccordionTitleProps,
} from 'semantic-ui-react';
import { setNotesChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { CurrentNoteState } from 'redux/reducers';
import { PatientViewProps } from '../../pages/EditNote/content/hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import { ChiefComplaintsProps } from '../../pages/EditNote/content/hpi/knowledgegraph/HPIContent';
import { FAMILY_HISTORY_MOBILE_BP } from 'constants/breakpoints.js';

const MiscBox = (props: Props) => {
    const { chiefComplaints, patientView } = props;
    const activeThing = '';
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
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
            {!patientView && !mobile && (
                <Accordion
                    className={
                        activeIndex === 0
                            ? 'hpi-text-drop'
                            : 'hpi-text-drop-folded'
                    }
                >
                    <Accordion.Title
                        className='white-important'
                        active={activeIndex === 0}
                        index={0}
                        onClick={miscNotesClick}
                    >
                        <Icon className='white-important' name='dropdown' />
                        Misc Notes&nbsp;&nbsp;&nbsp;&nbsp;
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
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
        // planConditions: selectPlanConditions(state),
        // hpiHeaders: state.hpiHeaders,
        patientView: selectPatientViewState(state),
    };
};
type Props = ChiefComplaintsProps &
    // HpiHeadersProps &
    // HPIContentProps &
    // DispatchProps &
    PatientViewProps;

export default connect(mapStateToProps, null)(MiscBox);
