import constants from '@constants/constants.json';
import React, { Component, Fragment } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectPatientViewState } from '@redux/selectors/userViewSelectors';
import './MenuTabs.css';

interface OwnProps {
    onTabChange: (name: string) => void;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

interface State {}

// Component for the tabs that toggle the different sections of the Create Note editor
class ConnectedMenuTabs extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    // onClick event is handled by parent
    handleItemClick = (e, { name }) => this.props.onTabChange(name);

    render() {
        const { activeItem, patientView } = this.props;

        const tabs = patientView
            ? constants.PATIENT_VIEW_TAB_NAMES
            : constants.TAB_NAMES;

        const tabMenuItems = tabs.map((name, index) => ({
            name: patientView ? '' + (index + 1) : name,
            active: activeItem === name,
            onClick: (e) => this.handleItemClick(e, { name }),
        }));

        return patientView ? (
            <PatientViewMenu tabMenuItems={tabMenuItems} />
        ) : (
            <DoctorViewMenu tabMenuItems={tabMenuItems} />
        );
    }
}

function PatientViewMenu({ tabMenuItems }) {
    return (
        <div className='patient-view-container stepper-block'>
            <div className='patient-view-content'>
                {tabMenuItems.map(({ name, active, onClick }, index) => (
                    <Fragment key={index}>
                        <button
                            className={`patient-view-button ${
                                active ? 'active' : ''
                            }`}
                            onClick={onClick}
                        >
                            {name}
                        </button>
                        {tabMenuItems.length > index + 1 && <hr></hr>}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

function DoctorViewMenu({ tabMenuItems }) {
    return (
        <div className='doctor-view-container sticky-sub-nav'>
            <div className='doctor-view-content'>
                {tabMenuItems.map(({ name, active, onClick }) => (
                    <button
                        key={name}
                        className={`doctor-view-button ${
                            active ? 'active' : ''
                        }`}
                        onClick={onClick}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
}

const MenuTabs = ConnectedMenuTabs;

const mapStateToProps = (state) => ({
    patientView: selectPatientViewState(state),
    activeItem: selectActiveItem(state),
});

const connector = connect(mapStateToProps);

export default connector(MenuTabs);
