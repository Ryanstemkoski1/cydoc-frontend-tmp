import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import React from 'react';
import { connect } from 'react-redux';
import {
    UpdateAdditionalSurveyAction,
    updateAdditionalSurveyDetails,
} from 'redux/actions/additionalSurveyActions';
import { CurrentNoteState } from 'redux/reducers';
import { additionalSurvey } from 'redux/reducers/additionalSurveyReducer';
import DetailsPage from '../../EditNote/content/patientview/AdditionalSurvey';

interface InitialSurveyState {
    tempLegalFirstName: string;
    tempLegalLastName: string;
    tempLegalMiddleName: string;
    tempSocialSecurityNumber: string;
    tempDateOfBirth: string;
}

interface InitialSurveyComponentProps {
    continue: (e: any) => void;
    setErrorMessage: (message: string) => void;
}

class InitialSurveyHPI extends React.Component<Props, InitialSurveyState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tempLegalFirstName: '',
            tempLegalLastName: '',
            tempLegalMiddleName: '',
            tempSocialSecurityNumber: '',
            tempDateOfBirth: '',
        };
    }

    continue = (e: any) => this.props.continue(e);

    onNextClick = (e: any) => {
        if (new Date() < new Date(this.state.tempDateOfBirth)) {
            this.props.setErrorMessage(
                'Date of birth should be before current date'
            );
            return;
        }

        if (
            this.state.tempLegalFirstName.trim() === '' ||
            this.state.tempLegalLastName.trim() == '' ||
            this.state.tempDateOfBirth.trim() === ''
        ) {
            this.props.setErrorMessage(
                'Please fill in all details to continue'
            );
            return;
        }

        if (
            this.state.tempSocialSecurityNumber.trim() &&
            this.state.tempSocialSecurityNumber.length !== 4
        ) {
            this.props.setErrorMessage(
                'Social security number should consist of 4 numbers'
            );
            return;
        }

        this.props.updateAdditionalSurveyDetails(
            this.state.tempLegalFirstName,
            this.state.tempLegalLastName,
            this.state.tempLegalMiddleName,
            this.state.tempSocialSecurityNumber,
            this.state.tempDateOfBirth,
            0
        );
        this.continue(e);
        return;
    };

    setTempAdditionalDetails = (
        tempLegalFirstName: string,
        tempLegalLastName: string,
        tempLegalMiddleName: string,
        tempSocialSecurityNumber: string,
        tempDateOfBirth: string
    ) => {
        this.setState({
            tempLegalFirstName: tempLegalFirstName.trim(),
            tempLegalLastName: tempLegalLastName.trim(),
            tempLegalMiddleName: tempLegalMiddleName.trim(),
            tempSocialSecurityNumber: tempSocialSecurityNumber.trim(),
            tempDateOfBirth: tempDateOfBirth,
        });
        this.props.updateAdditionalSurveyDetails(
            tempLegalFirstName.trim(),
            tempLegalLastName.trim(),
            tempLegalMiddleName.trim(),
            tempSocialSecurityNumber.trim(),
            tempDateOfBirth,
            0
        );
    };

    render() {
        return (
            <>
                <DetailsPage
                    key={0}
                    legalFirstName={this.props.additionalSurvey.legalFirstName}
                    legalLastName={this.props.additionalSurvey.legalLastName}
                    legalMiddleName={
                        this.props.additionalSurvey.legalMiddleName
                    }
                    socialSecurityNumber={
                        this.props.additionalSurvey.socialSecurityNumber
                    }
                    dateOfBirth={this.props.additionalSurvey.dateOfBirth}
                    setTempAdditionalDetails={this.setTempAdditionalDetails}
                />

                <NavigationButton nextClick={this.onNextClick} />
            </>
        );
    }
}

export interface AdditionalSurveyProps {
    additionalSurvey: additionalSurvey;
}

const mapStateToProps = (state: CurrentNoteState): AdditionalSurveyProps => {
    return {
        additionalSurvey: state.additionalSurvey,
    };
};

interface DispatchProps {
    updateAdditionalSurveyDetails: (
        legalFirstName: string,
        legalLastName: string,
        legalMiddleName: string,
        socialSecurityNumber: string,
        dateOfBirth: string,
        initialSurveyState: number
    ) => UpdateAdditionalSurveyAction;
}

type Props = DispatchProps &
    AdditionalSurveyProps &
    InitialSurveyComponentProps;

const mapDispatchToProps = {
    updateAdditionalSurveyDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialSurveyHPI);
