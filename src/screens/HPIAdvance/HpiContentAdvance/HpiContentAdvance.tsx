'use client';

import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import { favChiefComplaints } from 'classes/institution.class';
import React, { useCallback, useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    setChiefComplaint,
    setNotesChiefComplaint,
} from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { saveHpiHeader } from '@redux/actions/hpiHeadersActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import getHPIFormData from '@utils/getHPIFormData';
import { hpiHeaders } from '../../EditNote/content/hpi/knowledgegraph/API';
import BodySystemDropdown from '../../EditNote/content/hpi/knowledgegraph/components/BodySystemDropdown';
import DiseaseForm from '../DiseaseFormAdvance/DiseaseFormAdvance';
import { CurrentNoteState } from '@redux/reducers';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from '@redux/selectors/medicationsSelectors';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { selectSurgicalHistoryProcedures } from '@redux/selectors/surgicalHistorySelectors';
import { NotificationTypeEnum } from '@components/tools/Notification/Notification';
import useQuery from '@hooks/useQuery';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { selectProductDefinitions } from '@redux/selectors/productDefinitionSelector';
import MiscBox from '../../EditNote/content/hpi/knowledgegraph/components/MiscBox';
import ButtonSave from '@components/ButtonSave/ButtonSave';
import { postFilledForm } from '@modules/filled-form-api';
import { FormStatus } from '@constants/appointmentTemplatesConstants';
import { toast } from 'react-toastify';
import ToastOptions from '@constants/ToastOptions';
import { addAppointmentNote } from '@modules/appointment-api';
import { CognitoAuth } from 'auth/cognito';
import { ApiResponse } from '@cydoc-ai/types';

interface OwnProps {
    notification: {
        setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
        setNotificationType: React.Dispatch<
            React.SetStateAction<NotificationTypeEnum>
        >;
    };
    step?: number; // does not appear to be passed in from parent component correctly
}

interface State {
    searchVal: string;
    activeIndex: number;
    loading: boolean;
    institutionId: string;
    appointmentId: string;
    appointmentDate: string;
    appointmentTemplateId: string;
    templateStepId: string;
    patientId: string;
    formCategory: string;
    saveFormLoading: boolean;
    timer: NodeJS.Timeout | undefined;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

const AUTO_SAVE_FORM_INTERVAL = 2 * 60 * 1000; // 2 minutes

class HPIContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const search = window.location.search;
        const query = new URLSearchParams(search);
        this.state = {
            searchVal: '',
            activeIndex: 0, //misc notes box active
            loading: false,
            institutionId: query.get('institution_id')!,
            appointmentId: query.get('appointment_id')!,
            appointmentTemplateId: query.get('appointment_template_id')!,
            templateStepId: query.get('template_step_id')!,
            appointmentDate: query.get('appointment_date')!,
            patientId: query.get('patient_id')!,
            formCategory: query.get('form_category')!,
            saveFormLoading: false,
            timer: undefined,
        };
    }

    componentDidMount() {
        // Loads Cydoc knowledge graph to populate HPI,
        // organizes parent nodes by their category code (medical condition) and body system
        if (
            !(
                Object.keys(this.props.hpiHeaders.bodySystems || {}).length &&
                Object.keys(this.props.hpiHeaders.parentNodes || {}).length
            )
        ) {
            const data = hpiHeaders;
            data.then((res) => this.props.saveHpiHeader(res.data));
        }

        this.handleOnSave(FormStatus.In_Progress, true);
    }

    shouldShowNextButton = () => {
        const selectChiefComplaints = Object.keys(this.props.chiefComplaints);
        const currentActiveItem = this.props.activeItem;
        let result = true;

        selectChiefComplaints.forEach((item, index) => {
            if (
                item === currentActiveItem &&
                index === selectChiefComplaints.length - 1
            ) {
                result = false;
            }
        });
        return result;
    };

    handleOnSave = async (status = FormStatus.In_Progress, silent = false) => {
        const formContent = this.props.hpi;
        // Save filled_form to Database
        this.setState({
            saveFormLoading: true,
        });

        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }

        try {
            await postFilledForm({
                appointmentId: this.state.appointmentId,
                appointmentTemplateStepId: this.state.templateStepId!,
                formCategory: this.state.formCategory,
                formContent,
                status,
            });
            !silent && toast.success('Form saved!', ToastOptions.success);

            const timer = setTimeout(() => {
                this.handleOnSave(FormStatus.In_Progress, true);
            }, AUTO_SAVE_FORM_INTERVAL);

            this.setState({
                timer,
            });
        } catch (error) {
            !silent &&
                toast.error('Opps! Something went wrong!', ToastOptions.error);
        }
        this.setState({
            saveFormLoading: false,
        });
    };

    onSubmit = async (_query: ReadonlyURLSearchParams) => {
        this.setState({ loading: true });
        const user = await CognitoAuth.currentAuthenticatedUser();

        const hpiData = getHPIFormData(
            this.props.additionalSurvey,
            this.props.userSurveyState,
            {
                hpi: this.props.hpi,
                chiefComplaints: this.props.chiefComplaints,
                familyHistory: this.props.familyHistoryState,
                medications: this.props.medicationsState,
                medicalHistory: this.props.medicalHistoryState,
                patientInformation: this.props.patientInformationState,
                surgicalHistory: this.props.surgicalHistory,
                userSurvey: this.props.userSurveyState,
            }
        );

        try {
            const created = await addAppointmentNote(
                this.state.institutionId,
                this.state.appointmentId,
                hpiData.hpi_text,
                user
            );

            if (!created || (created as ApiResponse).errorMessage) {
                toast.error(
                    (created as ApiResponse).errorMessage ||
                        'Something went wrong.',
                    ToastOptions.error
                );
            } else {
                this.handleOnSave(FormStatus.Finished);
                const url = `/submission-advance-successful?${HPIPatientQueryParams.INSTITUTION_ID}=${this.state.institutionId}`;

                // Should use router?
                window.location.href = url;
            }
        } catch (error) {
            toast.error(
                'Something went wrong, please try again',
                ToastOptions.error
            );
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { hpiHeaders, productDefinition } = this.props;
        const { bodySystems, parentNodes } = hpiHeaders;
        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        /* Creates list of body system buttons to add in the front page. 
           Loops through state variable, bodySystems, saved from the API */

        const diseaseComponents = Object.entries(bodySystems).map(
            ([bodySystem, diseasesList]) => (
                <BodySystemDropdown
                    key={bodySystem} // name of body system
                    name={bodySystem}
                    diseasesList={diseasesList.sort()} // list of categories (diseases) associated with current body system
                />
            )
        );

        // component for ChiefComplaintsHeader
        const favoritesDiseaseComponent = (
            <BodySystemDropdown
                key={'Favorites'}
                name={'Favorites'}
                diseasesList={favChiefComplaints}
            />
        );

        // ensure that 'Favorites' ChiefComplaintsHeader appears as the first component displayed
        diseaseComponents.unshift(favoritesDiseaseComponent);

        const shouldShowNextButton = this.shouldShowNextButton();

        // if API data is loaded, render the DiseaseForm
        if (
            Object.keys(bodySystems || {}).length &&
            Object.keys(parentNodes || {}).length
        ) {
            return (
                <>
                    {productDefinition?.showMiscNotesBox && (
                        <MiscBox activeThing={this.props.activeItem} step={0} />
                    )}
                    {this.props.activeItem in parentNodes && (
                        <DiseaseForm
                            key={
                                Object.keys(
                                    parentNodes[this.props.activeItem]
                                )[0]
                            }
                            category={this.props.activeItem}
                        />
                    )}
                    <ButtonSave
                        text='Save'
                        handleOnSave={() =>
                            this.handleOnSave(FormStatus.In_Progress)
                        }
                        loading={this.state.saveFormLoading}
                    />
                    <NextSubmitButton
                        loading={this.state.loading}
                        onSubmit={this.onSubmit}
                        shouldShowNextButton={shouldShowNextButton}
                    />
                </>
            );
        }
        // if API data is not yet loaded, show loading screen
        else {
            return <h1 style={{ textAlign: 'center' }}> Loading... </h1>;
        }
    }
}

interface NextSubmitButtonProps {
    loading: boolean;
    onSubmit: (query: ReadonlyURLSearchParams) => void;
    shouldShowNextButton: boolean;
}

function NextSubmitButton({
    loading,
    onSubmit,
    shouldShowNextButton,
}: NextSubmitButtonProps) {
    const query = useQuery();

    const nextClick = useCallback(() => {
        onSubmit(query);
    }, [onSubmit, query, shouldShowNextButton]);

    return (
        <NavigationButton
            nextClick={nextClick}
            loading={loading}
            secondButtonLabel={shouldShowNextButton ? 'Next' : 'Submit'}
        />
    );
}

const mapStateToProps = (state: CurrentNoteState) => {
    return {
        activeItem: selectActiveItem(state),
        additionalSurvey: selectAdditionalSurvey(state),
        chiefComplaints: state.chiefComplaints,
        familyHistoryState: selectFamilyHistoryState(state),
        hpi: selectHpiState(state),
        hpiHeaders: state.hpiHeaders,
        patientInformationState: selectPatientInformationState(state),
        medicationsState: selectMedicationsState(state),
        medicalHistoryState: selectMedicalHistoryState(state),
        surgicalHistory: selectSurgicalHistoryProcedures(state),
        userSurveyState: selectInitialPatientSurvey(state),
        productDefinition: selectProductDefinitions(state),
    };
};

const mapDispatchToProps = {
    processKnowledgeGraph,
    saveHpiHeader,
    setChiefComplaint,
    setNotesChiefComplaint,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(HPIContent);
