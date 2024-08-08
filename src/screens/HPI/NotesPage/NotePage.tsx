import React, { Component } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { processSurveyGraph } from '@redux/actions/userViewActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from '@redux/selectors/userViewSelectors';
import initialQuestions from '../../EditNote/content/patientview/constants/initialQuestions';
import HPIContent from '../HpiContent/HPIContent';
import { NotificationTypeEnum } from '@components/tools/Notification/Notification';
import { OnNextClickParams } from '../Hpi';
import { RootState } from '@redux/store';
import { GraphData } from '@constants/hpiEnums';
import { getFilledForm } from '@modules/filled-form-api';
//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

interface OwnProps {
    notification: {
        setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
        setNotificationType: React.Dispatch<
            React.SetStateAction<NotificationTypeEnum>
        >;
    };
    onNextClick: (args?: OnNextClickParams) => void;
    onPreviousClick: () => void;
}

interface State {
    formContent: GraphData;
    isLoad: boolean;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

class NotePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            formContent: {
                graph: {},
                nodes: {},
                edges: {},
                order: {},
            },
            isLoad: false,
        };
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

        const handleFetchFilledForm = async () => {
            //temp constants for fetchFilledFormToDb
            const getAppointmentId = '660e8400-e29b-41d4-a716-446622444411';
            const getFormCategory = 'diabetes';
            //temp constants for fetchFilledFormToDb

            // Please replace hard-coded constants values to the dynamic values
            try {
                const formData = await getFilledForm(
                    getAppointmentId,
                    getFormCategory
                );

                this.setState({
                    isLoad: true,
                    formContent: formData.data.filled_form.formContent,
                });

                return formData.data.filled_form.formContent;
            } catch (error) {
                this.setState({
                    isLoad: true,
                    formContent: {
                        graph: {},
                        nodes: {},
                        edges: {},
                        order: {},
                    },
                });
                console.error('---Error getting filled_form data---:', error);
            }
        };

        this.state.isLoad == false && handleFetchFilledForm();
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
                // @ts-expect-error - TS doesn't know about style properties?
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
                    continue={this.nextFormClick}
                    back={this.previousFormClick}
                    // NOTE: looks to me like these functions are not used so I'm commenting them out...
                    // nextFormClick={this.nextFormClick}
                    // activeTab={this.props.activeItem}
                    // onTabClick={(_, tabIndex) => {
                    //     this.props.onTabChange(
                    //         Object.keys(this.props.chiefComplaints)[tabIndex]
                    //     );
                    // }}
                    notification={this.props.notification}
                    formContent={this.state.formContent}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
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

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(NotePage);
