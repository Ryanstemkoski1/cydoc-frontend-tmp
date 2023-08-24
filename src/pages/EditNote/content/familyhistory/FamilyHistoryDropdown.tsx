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
import {
    Button,
    ButtonProps,
    Dropdown,
    Form,
    Grid,
    Header,
    InputProps,
    TextAreaProps,
} from 'semantic-ui-react';
import '../hpi/knowledgegraph/src/css/Button.css';
import './FamilyHistory.css';
class FamilyHistoryDropdown extends Component<Props> {
    static contextType = HPIContext;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCauseOfDeathToggle =
            this.handleCauseOfDeathToggle.bind(this);
        this.handleCommentsChange = this.handleCommentsChange.bind(this);
        this.handleLivingToggle = this.handleLivingToggle.bind(this);
    }

    handleChange(event: React.SyntheticEvent<HTMLElement, Event>) {
        /* eslint-disable-next-line */
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

    handleCommentsChange(
        event: React.FormEvent,
        data: InputProps | TextAreaProps
    ) {
        /* eslint-disable-next-line */
        const { index, family_index } = this.props;
        this.props.updateComments(index, family_index, data.value);
    }

    render() {
        const {
            condition,
            handleDelete,
            index,
            /* eslint-disable-next-line */
            family_index,
        } = this.props;
        const { member, causeOfDeath, living, comments } =
            this.props.familyHistoryMember;

        return (
            <div className='dropdown-component-container'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={1}>
                            <Button
                                circular
                                icon='close'
                                size='mini'
                                onClick={() =>
                                    this.props.handleDelete(index, family_index)
                                }
                                aria-label='delete-button'
                                className='hpi-ph-button'
                            />
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Dropdown
                                value={member}
                                search
                                selection
                                fluid
                                options={familyOptions}
                                onChange={this.handleChange}
                                className='dropdown-inline'
                            />
                        </Grid.Column>

                        <Grid.Column width={3}>
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
                        </Grid.Column>

                        <Grid.Column width={9}>
                            <Form>
                                <Form.TextArea
                                    rows={1}
                                    condition={condition}
                                    value={comments}
                                    onChange={this.handleCommentsChange}
                                    placeholder='Comments'
                                />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    {causeOfDeath === YesNoResponse.Yes ||
                    causeOfDeath === YesNoResponse.None ? (
                        ''
                    ) : (
                        <Grid.Row className='living-toggle-row'>
                            <Grid.Column width={4} />

                            <Grid.Column width={3}>
                                <Grid.Column width={2}>
                                    <Header.Subheader className='living-toggle-title'>
                                        Living?
                                    </Header.Subheader>
                                </Grid.Column>
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
                            </Grid.Column>
                        </Grid.Row>
                    )}
                </Grid>
            </div>
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
)(FamilyHistoryDropdown);
