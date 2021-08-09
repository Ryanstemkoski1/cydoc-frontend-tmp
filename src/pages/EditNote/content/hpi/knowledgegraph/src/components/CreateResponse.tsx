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
import { ResponseTypes, HpiStateProps, DoctorView } from 'constants/hpiEnums';
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

interface CreateResponseProps {
    node: string;
    category: DoctorView;
}

interface CreateResponseState {
    windowWidth: number;
    windowHeight: number;
    startDate: Date;
    scale: number;
    input: string;
    question: string;
    responseChoice: string[];
}

class CreateResponse extends React.Component<Props, CreateResponseState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            startDate: new Date(),
            scale: 0,
            input: '',
            question: '',
            responseChoice: [],
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        this.cleanQuestionText();
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

    cleanQuestionText = () => {
        /*
        Cleans a question text for any parts not to be seen by the user,
        such as SYMPTOM or DISEASE, which should be replaced by the 
        category name, or CLICK[] or any brackets [] that should not be
        present. 

        One random exception found was that BIP0002 has CLICK with no
        closing bracket "]", so the corresponding changes were made so 
        that the question can still pass through correctly.
        */
        const { node, hpi, category } = this.props;
        const text = hpi.nodes[node].text
            .replace('SYMPTOM', category.toLowerCase())
            .replace('DISEASE', category.toLowerCase());
        const click = text.search('CLICK'),
            select = text.search('\\['),
            endSelect = text.search('\\]'),
            cleanText = select != -1 && endSelect != -1;
        this.setState({
            question: text.slice(
                0,
                click != -1 ? click : cleanText ? select : text.length
            ),
            responseChoice:
                click != -1 || cleanText
                    ? text
                          .slice(
                              select + 1,
                              endSelect != -1 ? endSelect : text.length
                          )
                          .split(',')
                          .map((response) => response.trim())
                    : [],
        });
    };

    renderSwitch = () => {
        const { windowWidth, responseChoice } = this.state;
        const { node, hpi } = this.props;
        const { responseType } = hpi.nodes[node];
        const blankTypes = [
            ResponseTypes.FH_BLANK,
            ResponseTypes.MEDS_BLANK,
            ResponseTypes.PMH_BLANK,
            ResponseTypes.PSH_BLANK,
        ];
        const choices = blankTypes.includes(responseType)
            ? (hpi.nodes[node].response as string[])
            : responseChoice;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
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

            case ResponseTypes.NUMBER:
                return <HandleNumericInput key={node} node={node} max={10} />;

            case ResponseTypes.BODYLOCATION:
                return <BodyLocation key={node} node={node} />;

            case ResponseTypes.MEDS_POP:
            case ResponseTypes.MEDS_BLANK:
                return (
                    <MedicationsContent
                        key={node}
                        isPreview={false}
                        mobile={collapseTabs}
                        values={responseChoice}
                        responseType={responseType}
                        node={node}
                    />
                );

            case ResponseTypes.FH_POP:
            case ResponseTypes.FH_BLANK:
                return (
                    <FamilyHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={choices}
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
                        responseChoice={responseChoice}
                        responseType={responseType}
                        mobile={collapseTabs}
                        currentYear={-1}
                        node={node}
                    />
                );

            case ResponseTypes.PSH_POP:
            case ResponseTypes.PSH_BLANK:
                return (
                    <SurgicalHistoryContent
                        key={node}
                        isPreview={false}
                        responseChoice={responseChoice}
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
                    {this.state.question.trim()}{' '}
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

type Props = HpiStateProps & DispatchProps & CreateResponseProps;

const mapDispatchToProps = {
    addFhPopOptions,
    blankQuestionChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateResponse);
