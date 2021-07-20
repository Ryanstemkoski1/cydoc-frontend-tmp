import React from 'react';
import '../css/Button.css';
import MultipleChoice from './responseComponents/MultipleChoice';
import YesNo from './responseComponents/YesNo';
import HandleInput from './responseComponents/HandleInput';
import HandleNumericInput from './responseComponents/HandleNumericInput';
import TimeInput from './responseComponents/TimeInput';
import BodyLocation from './responseComponents/BodyLocation';
import FamilyHistoryContent from '../../../../familyhistory/FamilyHistoryContent';
import MedicalHistoryContent from '../../../../medicalhistory/MedicalHistoryContent';
import MedicationsContent from '../../../../medications/MedicationsContent';
import SurgicalHistoryContent from '../../../../surgicalhistory/SurgicalHistoryContent';
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';
import ListText from './responseComponents/ListText';
import { ResponseTypes, HpiStateProps } from 'constants/hpiEnums';
import {
    addFhPopOptions,
    AddFhPopOptionsAction,
} from 'redux/actions/familyHistoryActions';
import {
    blankQuestionChange,
    BlankQuestionChangeAction,
} from 'redux/actions/hpiActions';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import { isStringArray } from 'redux/reducers/hpiReducer';

interface QuestionAnswerProps {
    responseType: ResponseTypes;
    node: string;
    responseChoice: string[];
    question: string;
}

interface QuestionAnswerState {
    windowWidth: number;
    windowHeight: number;
    startDate: Date;
    scale: number;
    input: string;
}

class QuestionAnswer extends React.Component<Props, QuestionAnswerState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            startDate: new Date(),
            scale: 0,
            input: '',
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    renderSwitch = () => {
        const { windowWidth } = this.state;
        const { responseType, node, responseChoice } = this.props;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
        const response = this.props.hpi.nodes[node].response;
        switch (responseType) {
            case ResponseTypes.YES_NO:
            case ResponseTypes.NO_YES:
                return <YesNo key={node} node={node} />;

            case ResponseTypes.SHORT_TEXT:
                return <HandleInput key={node} node={node} />;

            case ResponseTypes.TIME3DAYS:
                return <TimeInput key={node} node={node} />;

            case ResponseTypes.LIST_TEXT:
                return <ListText key={node} node={node} />;

            case ResponseTypes.CLICK_BOXES:
                return responseChoice.map((item: string) => (
                    <MultipleChoice key={item} name={item} node={node} />
                ));

            case ResponseTypes.MEDS_POP:
                return <MedicationsContent 
                    key={node}
                    isPreview={false}
                    mobile={collapseTabs}
                    values={responseChoice}
                    responseType={responseType}
                    node={node}
                    />
                // return responseChoice.map((item: string) => (
                //     <MultipleChoice key={item} name={item} node={node} />
                // ));

            case ResponseTypes.NUMBER:
                return <HandleNumericInput key={node} node={node} max={10} />;

            case ResponseTypes.BODYLOCATION:
                return <BodyLocation key={node} node={node} />;

            case ResponseTypes.FH_POP:
            case ResponseTypes.FH_BLANK:
                return (
                    <FamilyHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={
                            responseType == ResponseTypes.FH_POP
                                ? responseChoice
                                : isStringArray(response)
                                ? response
                                : []
                        }
                        responseType={responseType}
                        node={node}
                    />
                );

            case ResponseTypes.PMH_POP:
            case ResponseTypes.PMH_BLANK:
                return (
                    <MedicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={
                            responseType == ResponseTypes.PMH_POP
                                ? responseChoice
                                : isStringArray(response)
                                ? response
                                : []
                        }
                        responseType={responseType}
                        mobile={collapseTabs}
                        currentYear={-1}
                        node={node}
                    />
                );

            case ResponseTypes.MEDS_BLANK:
                return <MedicationsContent key={node} mobile={collapseTabs} />;

            case ResponseTypes.PSH_POP:
            case ResponseTypes.PSH_BLANK:
                return (
                    <SurgicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={
                            responseType == ResponseTypes.PSH_POP
                                ? responseChoice
                                : isStringArray(response)
                                ? response
                                : []
                        }
                        responseType={responseType}
                        mobile={collapseTabs}
                        node={node}
                    />
                );

            default:
                return;
        }
    };

    render() {
        return (
            <div className='qa-div'>
                <div>
                    {' '}
                    {this.props.question}{' '}
                    <div className='qa-button'>{this.renderSwitch()}</div>{' '}
                </div>
            </div>
        );
    }
}
interface DispatchProps {
    addFhPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddFhPopOptionsAction;
    blankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & QuestionAnswerProps;

const mapDispatchToProps = {
    addFhPopOptions,
    blankQuestionChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAnswer);
