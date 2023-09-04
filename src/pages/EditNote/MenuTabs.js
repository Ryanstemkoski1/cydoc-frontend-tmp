/* eslint-disable no-console */
import constants from 'constants/constants';
import HPIContext from 'contexts/HPIContext.js';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import './MenuTabs.css';

//Component for the tabs that toggle the different sections of the Create Note editor
class ConnectedMenuTabs extends Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            textInput: 'Untitled',
            isTitleFocused: false,
        };
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
        <div className='doctor-view-container'>
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
export default connect((state) => ({
    patientView: selectPatientViewState(state),
    activeItem: selectActiveItem(state),
}))(MenuTabs);

ConnectedMenuTabs.propTypes = {
    attached: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onTabChange: PropTypes.func,
};
