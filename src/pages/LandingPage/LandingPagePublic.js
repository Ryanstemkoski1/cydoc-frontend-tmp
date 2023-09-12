import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { initialState } from 'redux/reducers';
import { Icon, Image } from 'semantic-ui-react';

import { deleteNote } from '../../redux/actions/currentNoteActions';

import { changeUserView } from 'redux/actions/userViewActions';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import Feedback from '../../assets/cydoc-feedback.svg';
import './LandingPage.css';

//Component that manages the layout of the dashboard page
class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: '',
        };

        this.handleNewHPIClick = this.handleNewHPIClick.bind(this);
        this.handleEditHPIClick = this.handleEditHPIClick.bind(this);
        this.checkExistingNote = this.checkExistingNote.bind(this);
    }

    handleEditNoteClick = () => {
        this.setState({
            redirect: 'NEW_NOTE',
        });
    };

    // switches to new note under user's confirmation if prompt is true
    handleNewNoteClick = (prompt) => {
        const toDelete =
            !prompt || window.confirm('Delete current note and make a new one');
        if (toDelete) {
            this.props.deleteNote();
            const doctorView = !this.props.patientView;
            this.props.changeUserView(
                doctorView ? 'Doctor View' : 'Patient View'
            );
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

    checkExistingNote() {
        return !_.isEqual(
            {
                ...initialState,
                userView: {
                    ...initialState.userView,
                    patientView: this.props.patientView,
                    doctorView: !this.props.patientView,
                },
            },
            this.props.currentNote
        );
    }

    render() {
        const { patientView } = this.props;
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
                            className='icons'
                        />
                        <h3 className='textt'>Create New Blank Note</h3>
                    </div>
                )}
                <div
                    className='landing-box bottom'
                    onClick={() => this.handleEditNoteClick()}
                >
                    <Icon name='file outline' size='large' className='icons' />
                    <h3 className='textt'>
                        {patientView
                            ? 'Click here to begin your visit'
                            : 'Return to Active Note'}
                    </h3>
                </div>
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
                    <h3 className='textt'>
                        {patientView
                            ? 'Click here to begin your visit'
                            : 'Create New Note'}
                    </h3>
                </div>
            </Fragment>
        );

        switch (this.state.redirect) {
            case 'NEW_NOTE':
                return <Redirect to='/editnote' push={true} />;

            case 'NEW_HPI':
                return <Redirect to='/templates/new' />;

            case 'EDIT_HPI':
                return <Redirect to='/templates/old' />;

            default:
                return (
                    <>
                        {!patientView ? (
                            <div className='landing-feedback'>
                                <Image src={Feedback} />
                            </div>
                        ) : (
                            ''
                        )}
                        <div className={`landing-boxes columns`}>
                            {<>{desktopNoteButtons}</>}
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
    changeUserView,
};

export default connect(mapStatetoProps, mapDispatchToProps)(LandingPage);
