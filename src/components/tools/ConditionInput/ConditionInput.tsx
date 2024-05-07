import Input from 'components/Input/Input';
import { standardizeDiseaseNamesOnBlur } from 'constants/standardizeDiseaseNames';
import { SeenCondition } from 'pages/EditNote/content/medicalhistory/MedicalHistoryContent';
import React from 'react';
import { connect } from 'react-redux';
import { updateCondition } from '@redux/actions/familyHistoryActions';
import { updateConditionName } from '@redux/actions/medicalHistoryActions';
import { CurrentNoteState } from '@redux/reducers';
import { FamilyHistoryState } from '@redux/reducers/familyHistoryReducer';
import { MedicalHistoryState } from '@redux/reducers/medicalHistoryReducer';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import style from './ConditionInput.module.scss';

class ConditionInput extends React.Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        let isTitleFocused = false;
        if (!this.props.isPreview) {
            const condition = this.props.condition;
            isTitleFocused = condition
                ? condition.length === 0
                : this.props.condition.length === 0;
        }
        this.state = {
            textInput: '',
            isRepeat: false,
            isTitleFocused,
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.editInput(event.target.value);
    };

    editInput = (val: string) => {
        this.setState({
            textInput: val,
        });
        if (this.props.category === 'Medical History') {
            this.props.updateMedicalHistoryCondition(this.props.index, val);
        }
        if (this.props.category === 'Family History') {
            this.props.updateFamilyHistoryCondition(this.props.index, val);
        }
    };

    handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ isTitleFocused: false });
        const val = standardizeDiseaseNamesOnBlur(e.target.value);
        this.editInput(val);
        if (
            val in this.props.seenConditions &&
            this.props.index !== this.props.seenConditions[val]
        ) {
            this.setState({ isRepeat: true });
        } else {
            this.setState({ isRepeat: false });
            this.props.addSeenCondition(val, this.props.index);
        }
    };

    render() {
        return (
            <>
                {this.props.category === 'Medical History' ||
                this.props.category === 'Family History' ? (
                    <Input
                        type='text'
                        appearanceSimple={true}
                        placeholder='Condition'
                        onChange={this.handleInputChange}
                        onFocus={() => {
                            this.setState({ isTitleFocused: true });
                        }}
                        onBlur={this.handleOnBlur}
                        value={this.props.isPreview ? '' : this.props.condition}
                    />
                ) : (
                    <p>{this.props.condition}</p>
                )}
                {this.state.isRepeat && (
                    <div className={style.conditionBlock__error}>
                        <img src={'/images/info.svg'} alt='I' />
                        Condition already included
                    </div>
                )}
            </>
        );
    }
}

interface OwnState {
    textInput: string;
    isRepeat: boolean;
    isTitleFocused: boolean;
}

interface DispatchProps {
    updateMedicalHistoryCondition: (index: string, newName: string) => void;
    updateFamilyHistoryCondition: (
        conditionIndex: string,
        newCondition: string
    ) => void;
}

interface MedicalHistoryProps {
    medicalHistory: MedicalHistoryState;
}

interface FamilyHistoryProps {
    familyHistory: FamilyHistoryState;
}

interface InputProps {
    key: number;
    index: string;
    category: string;
    isPreview: boolean;
    seenConditions: SeenCondition;
    addSeenCondition: (value: string, index: string) => void;
    condition: string;
    standardizeName: (name: string) => string;
    style?: React.CSSProperties;
}

type Props = DispatchProps &
    MedicalHistoryProps &
    FamilyHistoryProps &
    InputProps;

const mapStateToProps = (state: CurrentNoteState) => {
    return {
        medicalHistory: selectMedicalHistoryState(state),
        familyHistory: selectFamilyHistoryState(state),
    };
};

const mapDispatchToProps = {
    updateMedicalHistoryCondition: updateConditionName,
    updateFamilyHistoryCondition: updateCondition,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionInput);
