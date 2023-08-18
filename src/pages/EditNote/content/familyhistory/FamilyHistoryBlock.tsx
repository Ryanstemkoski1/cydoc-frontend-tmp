import GridContentV2 from 'components/tools/GridContentV2/GridContentV2';
import { ButtonProps } from 'components/tools/ToggleButton/ToggleButton';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    addFamilyMember,
    deleteFamilyMember,
    toggleCauseOfDeathOption,
    toggleConditionOption,
    toggleLivingOption,
    updateComments,
    updateMember,
} from 'redux/actions/familyHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import {
    FamilyHistoryCondition,
    FamilyHistoryState,
} from 'redux/reducers/familyHistoryReducer';
import {
    FamilyHistoryConditionFlat,
    selectFamilyHistoryCondition,
    selectFamilyHistoryConditions,
    selectFamilyHistoryState,
} from 'redux/selectors/familyHistorySelectors';
import { Grid, Header } from 'semantic-ui-react';
import DeleleIcon from '../../../../assets/images/delete.svg';
import '../hpi/knowledgegraph/src/css/Button.css';
import '../reviewofsystems/ReviewOfSystems.css';
import './FamilyHistory.css';
import style from './FamilyHistoryBlock.module.scss';
import FamilyHistoryDropdownV2 from './FamilyHistoryDropdownV2';

class FamilyHistoryBlock extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handlePlusClick = this.handlePlusClick.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handlePlusClick() {
        this.props.addFamilyMember(this.props.index);
    }

    handleToggleButtonClick(event: React.MouseEvent, data: ButtonProps) {
        this.props.toggleConditionOption(
            this.props.index,
            data.title.toUpperCase() as YesNoResponse
        );
    }
    /* eslint-disable-next-line */
    handleDelete(index: string, family_index: string) {
        this.props.deleteFamilyMember(index, family_index);
    }

    render() {
        const { mobile, conditionInp, index, isPreview } = this.props;
        const { condition, hasAfflictedFamilyMember, familyMembers } =
            this.props.familyHistoryItem;
        // array of dropdowns displayed on Family History Family Member column
        // variable range that changes when the user clicks the + (add member) button
        // we want there to be at least one dropdown
        let dropdownList = [];
        const familyIndexes = Object.keys(familyMembers);
        dropdownList = familyIndexes.map((familyIndex, listIndex, array) => (
            <FamilyHistoryDropdownV2
                condition={condition}
                index={index}
                key={familyIndex}
                family_index={familyIndex}
                mobile={mobile}
                // if is the first family dropdown then handleDelete will act as deleteRow.
                handleDelete={
                    listIndex === 0 && array.length === 1
                        ? () => this.props.deleteRow(this.props.index)
                        : this.handleDelete
                }
            />
        ));
        const newContentHeader = (
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column width={1}></Grid.Column>
                    <Grid.Column width={3}>
                        <Header.Subheader className='family-member-header'>
                            Family Member
                        </Header.Subheader>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header.Subheader>Cause of Death</Header.Subheader>
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Header.Subheader>Comments</Header.Subheader>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
        let handleToggle = this.handleToggleButtonClick;
        let yesActive = hasAfflictedFamilyMember === YesNoResponse.Yes;
        let noActive = hasAfflictedFamilyMember === YesNoResponse.No;
        if (isPreview) {
            /* eslint-disable-next-line */
            handleToggle = () => {};
            yesActive = false;
            noActive = false;
        }
        const familyBlockHeaders = [
            {
                title: 'Family Member',
                col: 3,
            },
            {
                title: 'Cause of Death',
                col: 3,
            },
            {
                title: 'Comments',
                col: 9,
            },
            {
                title: '',
                col: 9,
            },
        ];
        return (
            <>
                <div
                    className={`${style.historyBlock__response} flex align-center`}
                >
                    <div className={style.historyBlock__input}>
                        {conditionInp}
                    </div>
                    <div
                        className={`${style.historyBlock__action} flex align-center`}
                    >
                        <YesAndNo
                            yesButtonActive={yesActive}
                            yesButtonCondition={'Yes'}
                            handleYesButtonClick={handleToggle}
                            noButtonActive={noActive}
                            noButtonCondition={'No'}
                            handleNoButtonClick={handleToggle}
                        />
                        <div
                            className={style.historyBlock__remove}
                            onClick={() => {
                                this.props.deleteRow(this.props.index);
                            }}
                        >
                            <img src={DeleleIcon} alt='Remove' />
                        </div>
                    </div>
                </div>
                {yesActive && (
                    <>
                        <GridContentV2
                            header_titles={familyBlockHeaders}
                            rows={dropdownList}
                            name='Family Member'
                            onAddRow={this.handlePlusClick}
                        />
                    </>
                )}
            </>
        );
    }
}

interface FamilyHistoryProps {
    familyHistory: FamilyHistoryState;
    familyHistoryConditions: FamilyHistoryConditionFlat[];
    familyHistoryItem: FamilyHistoryCondition;
}

interface BlockProps {
    index: string;
    mobile: boolean;
    isPreview?: boolean;
    conditionInp: JSX.Element;
    pop: boolean;
    node?: string;
    deleteRow: (index: string) => void;
}

interface DispatchProps {
    addFamilyMember: (conditionIndex: string) => void;
    deleteFamilyMember: (
        conditionIndex: string,
        familyMemberIndex: string
    ) => void;
    toggleConditionOption: (
        conditionIndex: string,
        optionSelected: YesNoResponse
    ) => void;
}

type Props = FamilyHistoryProps & BlockProps & DispatchProps;

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: BlockProps
): FamilyHistoryProps => {
    return {
        familyHistory: selectFamilyHistoryState(state),
        familyHistoryConditions: selectFamilyHistoryConditions(state),
        familyHistoryItem: selectFamilyHistoryCondition(state, ownProps.index),
    };
};

const mapDispatchToProps = {
    toggleConditionOption,
    addFamilyMember,
    deleteFamilyMember,
    updateMember,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateComments,
};

export default connect(mapStateToProps, mapDispatchToProps)(FamilyHistoryBlock);
