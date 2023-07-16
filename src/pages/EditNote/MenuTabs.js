/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import constants from 'constants/constants';
import HPIContext from 'contexts/HPIContext.js';
import './MenuTabs.css';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';

//Component for the tabs that toggle the different sections of the Create Note editor
class ConnectedMenuTabs extends Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            textInput: 'Untitled',
            isTitleFocused: false,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
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
        <div className='patient-view-container'>
            <div className='patient-view-content'>
                {tabMenuItems.map(({ name, active, onClick }, index) => (
                    <>
                        <button
                            key={index}
                            className={`patient-view-button ${
                                active ? 'active' : ''
                            }`}
                            onClick={onClick}
                        >
                            {name}
                        </button>
                        {tabMenuItems.length > index + 1 && <hr></hr>}
                    </>
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
                    <>
                        <button
                            key={name}
                            className={`doctor-view-button ${
                                active ? 'active' : ''
                            }`}
                            onClick={onClick}
                        >
                            {name}
                        </button>
                    </>
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
