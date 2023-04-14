import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Image } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { initialState } from 'redux/reducers';
import _ from 'lodash';

import { deleteNote } from '../../redux/actions/currentNoteActions';
import NavMenu from '../../components/navigation/NavMenu';

import { LANDING_PAGE_MOBLE_BP } from 'constants/breakpoints.js';
import './LandingPage.css';
import Feedback from '../../assets/cydoc-feedback.svg';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';

//Component that manages the layout of the dashboard page
class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 1000,
            windowHeight: 0,
            redirect: '',
        };
        this.updateDimensions = this.updateDimensions.bind(this);

        this.handleNewHPIClick = this.handleNewHPIClick.bind(this);
        this.handleEditHPIClick = this.handleEditHPIClick.bind(this);
        this.checkExistingNote = this.checkExistingNote.bind(this);
    }

    componentDidMount = () => {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    handleEditNoteClick = () => {
        this.setState({
            redirect: 'NEW_NOTE',
        });
    };

    handleAcidTestClick = () => {
        this.setState({
            redirect: 'ACID_TEST',
        });
    };

    // switches to new note under user's confirmation if prompt is true
    handleNewNoteClick = (prompt) => {
        const toDelete =
            !prompt || window.confirm('Delete current note and make a new one');
        if (toDelete) {
            this.props.deleteNote();
            this.handleEditNoteClick();
        }
    };

    handleNewHPIClick() {
        this.setState({
            redirect: 'NEW_HPI',
        });
    }

    handleEditHPIClick() {
        this.setState({
            redirect: 'EDIT_HPI',
        });
    }

    handleNewInpatientPlanClick() {
        this.setState({
            redirect: 'NEW_INPATIENT_PLAN',
        });
    }

    checkExistingNote() {
        return !_.isEqual(initialState, this.props.currentNote);
    }

    render() {
        const { windowWidth } = this.state;
        const { patientView } = this.props;
        const stack = windowWidth < LANDING_PAGE_MOBLE_BP;
        const noteExists = this.checkExistingNote();
        const desktopNoteButtons = noteExists ? (
            <div className='landing-col multiple'>
                {patientView ? (
                    ''
                ) : (
                    <div
                        className='landing-box top'
                        onClick={() => this.handleNewNoteClick(true)}
                    >
                        <Icon
                            name='file alternate outline'
                            size='large'
                            class='icons'
                        />
                        <h3 className='text'>Create New Blank Note</h3>
                    </div>
                )}
                <div
                    className='landing-box bottom'
                    onClick={() => this.handleEditNoteClick()}
                >
                    <Icon name='file outline' size='large' class='icons' />
                    <h3 className='text'>
                        {patientView
                            ? 'Click here to begin your visit'
                            : 'Return to Active Note'}
                    </h3>
                </div>
                {patientView ? (
                    ''
                ) : (
                    <>
                        <div
                            className='landing-box bottom'
                            onClick={() => this.handleAcidTestClick()}
                        >
                            <Icon name='flask' size='large' className='icons' />
                            <h3 className='text'>
                                Create New Acid Base Analysis
                            </h3>
                        </div>
                        <div
                            className='landing-box bottom'
                            onClick={() => this.handleNewInpatientPlanClick()}
                        >
                            <Icon name='tasks' size='large' className='icons' />
                            <h3 className='text'>Create New Inpatient Plan</h3>
                        </div>
                    </>
                )}
            </div>
        ) : (
            <Fragment>
                <div
                    className='landing-box landing-col'
                    onClick={() => this.handleNewNoteClick(false)}
                >
                    <Icon
                        name='file alternate outline'
                        size='huge'
                        className='icons'
                    />
                    <h3 className='text'>
                        {patientView
                            ? 'Click here to begin your visit'
                            : 'Create New Note'}
                    </h3>
                </div>
                {patientView ? (
                    ''
                ) : (
                    <>
                        <div
                            className='landing-box landing-col'
                            onClick={() => this.handleNewInpatientPlanClick()}
                        >
                            <Icon name='tasks' size='huge' className='icons' />
                            <h3 className='text'>Create New Inpatient Plan</h3>
                            <br />
                            <p className='smaller-text'>
                                Generate a plan from labratory values
                            </p>
                        </div>
                        <div
                            className='landing-box landing-col'
                            onClick={() => this.handleAcidTestClick()}
                        >
                            <Icon name='flask' size='huge' className='icons' />
                            <h3 className='text'>
                                Create New Acid Base Analysis
                            </h3>
                            <br />
                            <p className='smaller-text'>
                                Generate analysis from laboratory values
                            </p>
                        </div>
                    </>
                )}
            </Fragment>
        );

        const existingNoteMobileButton = noteExists && (
            <div
                onClick={this.handleEditNoteClick}
                className='ui animated fade button landing'
                tabIndex='0'
            >
                <div className='visible content' size='massive'>
                    <Button size='big'>Return to an Active Note</Button>
                </div>
                <div className='hidden content'>
                    <Icon
                        name='file alternate outline'
                        size='large'
                        className='icons'
                    ></Icon>
                </div>
            </div>
        );

        const newNoteMobileButton = (
            <div
                onClick={() => this.handleNewNoteClick(noteExists)}
                className='ui animated fade button landing'
                tabIndex='0'
            >
                <div className='visible content' size='massive'>
                    <Button size='big'> Create New Blank Note</Button>
                </div>
                <div className='hidden content'>
                    <Icon
                        name={`file outline ${!noteExists ? 'alternate' : ''}`}
                        size='large'
                        className='icons'
                    ></Icon>
                </div>
            </div>
        );

        const newAcidBaseAnalysisMobileButton = (
            <div
                onClick={() => this.handleAcidTestClick()}
                className='ui animated fade button landing'
                tabIndex='0'
            >
                <div className='visible content' size='massive'>
                    <Button size='big'>Create New Acid Base Analysis</Button>
                </div>
                <div className='hidden content'>
                    <Icon name='flask' size='large' className='icons'></Icon>
                </div>
            </div>
        );

        const newInpatientPlanMobileButton = (
            <div
                onClick={() => this.handleNewInpatientPlanClick()}
                className='ui animated fade button landing'
                tabIndex='0'
            >
                <div className='visible content' size='massive'>
                    <Button size='big'>Create New Inpatient Plan</Button>
                </div>
                <div className='hidden content'>
                    <Icon name='tasks' size='large' className='icons'></Icon>
                </div>
            </div>
        );

        switch (this.state.redirect) {
            case 'NEW_NOTE':
                return <Redirect to='/editnote' />;

            case 'NEW_HPI':
                return <Redirect to='/templates/new' />;

            case 'EDIT_HPI':
                return <Redirect to='/templates/old' />;

            case 'NEW_INPATIENT_PLAN':
                return <Redirect to='/generateinpatientplan' />;

            case 'ACID_TEST':
                return <Redirect to='/acid-test' />;

            default:
                return (
                    <>
                        <div>
                            <NavMenu className='landing-page-nav-menu' />
                        </div>
                        {!patientView ? (
                            <div className='landing-feedback'>
                                <Image src={Feedback} />
                            </div>
                        ) : (
                            ''
                        )}
                        <div
                            className={`landing-boxes ${
                                stack ? 'rows' : 'columns'
                            }`}
                        >
                            {stack ? (
                                <>
                                    {existingNoteMobileButton}
                                    {newNoteMobileButton}
                                    {newInpatientPlanMobileButton}
                                    {newAcidBaseAnalysisMobileButton}
                                </>
                            ) : (
                                <>{desktopNoteButtons}</>
                            )}
                        </div>
                    </>
                );
        }
    }
}
const mapStatetoProps = (state) => ({
    currentNote: state,
    patientView: selectPatientViewState(state),
});

const mapDispatchToProps = {
    deleteNote,
};

export default connect(mapStatetoProps, mapDispatchToProps)(LandingPage);
