import Textarea from 'components/Input/Textarea';
import RemoveButton from 'components/tools/RemoveButton/RemoveButton';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import { FamilyOption, familyOptions } from 'constants/familyHistoryRelations';
import HPIContext from 'contexts/HPIContext.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteFamilyMember,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateComments,
    updateMember,
} from 'redux/actions/familyHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import {
    FamilyHistoryMember,
    FamilyHistoryState,
} from 'redux/reducers/familyHistoryReducer';
import {
    selectFamilyHistoryMember,
    selectFamilyHistoryState,
} from 'redux/selectors/familyHistorySelectors';
import { ButtonProps, Dropdown as DropDownSemantic } from 'semantic-ui-react';
import '../hpi/knowledgegraph/src/css/Button.css';
import './FamilyHistory.css';
import style from './FamilyHistoryDropdownV2.module.scss';
class FamilyHistoryDropdownV2 extends Component<Props> {
    static contextType = HPIContext;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCauseOfDeathToggle =
            this.handleCauseOfDeathToggle.bind(this);
        this.handleCommentsChange = this.handleCommentsChange.bind(this);
        this.handleLivingToggle = this.handleLivingToggle.bind(this);
    }

    // handleChange(event: React.SyntheticEvent<HTMLElement, Event>) {
    //     /* eslint-disable-next-line */
    //     const { index, family_index } = this.props;
    //     const value = (event.target as HTMLInputElement)
    //         .textContent as FamilyOption;
    //     this.props.updateMember(index, family_index, value);
    // }

    handleChange(event: React.SyntheticEvent<HTMLElement, Event>) {
        const { index, family_index } = this.props;
        const value = (event.target as HTMLInputElement)
            .textContent as FamilyOption;
        this.props.updateMember(index, family_index, value);
    }

    handleCauseOfDeathToggle(event: React.MouseEvent, data: ButtonProps) {
        /* eslint-disable-next-line */
        const { index, family_index } = this.props;
        this.props.toggleCauseOfDeathOption(
            index,
            family_index,
            data.title.toUpperCase()
        );
        //Cause of death = yes implies not living
        if (data.title.toUpperCase() === 'Yes') {
            this.props.toggleLivingOption(
                index,
                family_index,
                YesNoResponse.No
            );
        }
    }

    handleLivingToggle(event: React.MouseEvent, data: ButtonProps) {
        /* eslint-disable-next-line */
        const { index, family_index } = this.props;
        this.props.toggleLivingOption(
            index,
            family_index,
            data.title.toUpperCase()
        );
    }

    handleCommentsChange(value: string) {
        /* eslint-disable-next-line */
        const { index, family_index } = this.props;
        this.props.updateComments(index, family_index, value);
    }

    render() {
        const {
            condition,
            index,
            /* eslint-disable-next-line */
            family_index,
        } = this.props;
        const { member, causeOfDeath, living, comments } =
            this.props.familyHistoryMember;

        return (
            <>
                <tr>
                    <td>
                        <strong>Family Member</strong>
                        <div className={style.familyHistoryBlock__dropdown}>
                            <DropDownSemantic
                                value={member}
                                search
                                selection
                                fluid
                                options={familyOptions.filter(
                                    (item) => item.text !== ''
                                )}
                                onChange={this.handleChange}
                            />
                        </div>
                    </td>

                    <td>
                        <div className='flex align-center justify-between'>
                            <strong>Cause of Death</strong>
                            <YesAndNo
                                yesButtonActive={
                                    causeOfDeath === YesNoResponse.Yes
                                        ? true
                                        : false
                                }
                                yesButtonCondition={condition}
                                handleYesButtonClick={
                                    this.handleCauseOfDeathToggle
                                }
                                noButtonActive={
                                    causeOfDeath === YesNoResponse.No
                                        ? true
                                        : false
                                }
                                noButtonCondition={condition}
                                handleNoButtonClick={
                                    this.handleCauseOfDeathToggle
                                }
                            />
                        </div>

                        {causeOfDeath === YesNoResponse.Yes ||
                        causeOfDeath === YesNoResponse.None ? (
                            ''
                        ) : (
                            <div
                                className={`${style.familyHistoryBlock__living} flex align-center justify-between`}
                            >
                                Living?
                                <YesAndNo
                                    yesButtonActive={
                                        living === YesNoResponse.Yes
                                            ? true
                                            : false
                                    }
                                    yesButtonCondition={condition}
                                    yesButtonClasses='fam-hist-buttons'
                                    handleYesButtonClick={
                                        this.handleLivingToggle
                                    }
                                    noButtonActive={
                                        living === YesNoResponse.No
                                            ? true
                                            : false
                                    }
                                    noButtonCondition={condition}
                                    handleNoButtonClick={
                                        this.handleLivingToggle
                                    }
                                    noButtonClasses='fam-hist-buttons'
                                />
                            </div>
                        )}
                    </td>

                    <td>
                        <strong>Comment</strong>
                        <form>
                            <Textarea
                                mobileHeight={true}
                                condition={condition}
                                value={comments}
                                onChange={(e: any) =>
                                    this.handleCommentsChange(e.target.value)
                                }
                                placeholder='Comments'
                            />
                        </form>
                    </td>

                    <td>
                        <RemoveButton
                            onClick={() =>
                                this.props.handleDelete(index, family_index)
                            }
                        />
                    </td>
                </tr>

                {causeOfDeath === YesNoResponse.Yes ||
                causeOfDeath === YesNoResponse.None ? (
                    ''
                ) : (
                    <>
                        <tr className={style.familyHistoryBlock__row}>
                            <td>Living?</td>
                            <td colSpan={2}>
                                <YesAndNo
                                    yesButtonActive={
                                        living === YesNoResponse.Yes
                                            ? true
                                            : false
                                    }
                                    yesButtonCondition={condition}
                                    yesButtonClasses='fam-hist-buttons'
                                    handleYesButtonClick={
                                        this.handleLivingToggle
                                    }
                                    noButtonActive={
                                        living === YesNoResponse.No
                                            ? true
                                            : false
                                    }
                                    noButtonCondition={condition}
                                    handleNoButtonClick={
                                        this.handleLivingToggle
                                    }
                                    noButtonClasses='fam-hist-buttons'
                                />
                            </td>
                            <td></td>
                        </tr>
                    </>
                )}
            </>
        );
    }
}

interface FamilyHistoryProps {
    familyHistory: FamilyHistoryState;
    familyHistoryMember: FamilyHistoryMember;
}

interface DispatchProps {
    updateMember: (
        conditionIndex: string,
        familyMemberIndex: string,
        newMember: FamilyOption
    ) => void;
    toggleCauseOfDeathOption: (
        conditionIndex: string,
        familyMemberIndex: string,
        optionSelected: YesNoResponse
    ) => void;
    toggleLivingOption: (
        conditionIndex: string,
        familyMemberIndex: string,
        optionSelected: YesNoResponse
    ) => void;
    updateComments: (
        conditionIndex: string,
        familyMemberIndex: string,
        newComments: string
    ) => void;
    deleteFamilyMember: (
        conditionIndex: string,
        familyMemberIndex: string
    ) => void;
}

interface DropdownProps {
    index: string;
    family_index: string;
    mobile: boolean;
    condition: string;
    /* eslint-disable-next-line */
    handleDelete: (index: string, family_index: string) => void;
}

type Props = FamilyHistoryProps & DispatchProps & DropdownProps;

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: DropdownProps
): FamilyHistoryProps => {
    return {
        familyHistory: selectFamilyHistoryState(state),
        familyHistoryMember: selectFamilyHistoryMember(
            state,
            ownProps.index,
            ownProps.family_index
        ),
    };
};

const mapDispatchToProps = {
    updateComments,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateMember,
    deleteFamilyMember,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FamilyHistoryDropdownV2);
