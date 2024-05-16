import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { processSurveyGraph } from '@redux/actions/userViewActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from '@redux/selectors/userViewSelectors';
import initialQuestions from '../../EditNote/content/patientview/constants/initialQuestions';
import HPIContent from '../HpiContent/HPIContent';
//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

class NotePage extends Component {
    constructor(props) {
        super(props);
        //initialize state
    }

    componentDidMount() {
        const { userSurveyState, processSurveyGraph } = this.props;
        if (
            !Object.keys(userSurveyState?.graph).length &&
            !Object.keys(userSurveyState?.nodes).length &&
            !Object.keys(userSurveyState?.order).length
        ) {
            processSurveyGraph(initialQuestions);
        }
    }

    setStickyHeaders() {
        const stickyHeaders = document.getElementsByClassName('sticky-header');
        const patientHistoryMenu = document.getElementById(
            'patient-history-menu'
        );
        if (
            stickyHeaders != null &&
            stickyHeaders.length != 0 &&
            patientHistoryMenu != null
        ) {
            for (let i = 0; i < stickyHeaders.length; i++) {
                stickyHeaders[i].style.top = `${
                    parseInt(patientHistoryMenu.style.top) +
                    patientHistoryMenu.offsetHeight
                }px`;
            }
        }
    }

    nextFormClick = () => {
        this.props.onNextClick();
    };

    previousFormClick = () => {
        this.props.onPreviousClick();
    };

    render() {
        return (
            <div>
                <HPIContent
                    nextFormClick={this.nextFormClick}
                    continue={this.nextFormClick}
                    back={this.previousFormClick}
                    activeTab={this.props.activeItem}
                    onTabClick={(_, tabIndex) => {
                        this.props.onTabChange(
                            Object.keys(this.props.chiefComplaints)[tabIndex]
                        );
                    }}
                    notification={this.props.notification}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        chiefComplaints: state.chiefComplaints,
        patientView: selectPatientViewState(state),
        activeItem: selectActiveItem(state),
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

const mapDispatchToProps = {
    updateActiveItem,
    processSurveyGraph,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
