import {
    Dropdown,
    Grid,
    Form,
    Button,
    Header,
    Divider,
    ButtonProps,
    InputProps,
    TextAreaProps,
} from 'semantic-ui-react';
import React, { Component, Fragment } from 'react';
import HPIContext from 'contexts/HPIContext.js';
import { familyOptions, FamilyOption } from 'constants/familyHistoryRelations';
import ToggleButton from 'components/tools/ToggleButton';
import './FamilyHistory.css';
import { connect } from 'react-redux';
import {
    updateMember,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateComments,
    deleteFamilyMember,
} from 'redux/actions/familyHistoryActions';
import {
    selectFamilyHistoryState,
    selectFamilyHistoryMember,
} from 'redux/selectors/familyHistorySelectors';
import { YesNoResponse } from 'constants/enums';
import {
    FamilyHistoryState,
    FamilyHistoryMember,
} from 'redux/reducers/familyHistoryReducer';
import { CurrentNoteState } from 'redux/reducers';
import '../hpi/knowledgegraph/src/css/Button.css';

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
            mobile,
            condition,
            handleDelete,
            index,
            /* eslint-disable-next-line */
            family_index,
        } = this.props;
        const { member, causeOfDeath, living, comments } =
            this.props.familyHistoryMember;

        return mobile ? (
            <div className='dropdown-component-container'>
                <Grid className='family-history-dp'>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid.Row width={14}>
                                <Grid.Column width={6}>
                                    <Header.Subheader className='family-history-header-mobile'>
                                        Family Member with {condition}
                                    </Header.Subheader>
                                    <Dropdown
                                        value={member}
                                        search
                                        selection
                                        fluid
                                        options={familyOptions}
                                        onChange={this.handleChange}
                                        className='dropdown-inline-mobile'
                                        aria-label='family-dropdown'
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={4}>
                                    <Header.Subheader className='family-history-header-mobile'>
                                        Cause of Death?
                                    </Header.Subheader>
                                    <div className='family-history-toggle'>
                                        <ToggleButton
                                            active={
                                                causeOfDeath ===
                                                YesNoResponse.Yes
                                            }
                                            condition={condition}
                                            title='Yes'
                                            onToggleButtonClick={
                                                this.handleCauseOfDeathToggle
                                            }
                                            className='fam-hist-buttons'
                                        />
                                        <ToggleButton
                                            active={
                                                causeOfDeath ===
                                                YesNoResponse.No
                                            }
                                            condition={condition}
                                            title='No'
                                            onToggleButtonClick={
                                                this.handleCauseOfDeathToggle
                                            }
                                            className='fam-hist-buttons'
                                        />
                                    </div>
                                </Grid.Column>
                                {/* <Grid.Column mobile={1} /> */}
                                <Grid.Column width={4}>
                                    {causeOfDeath === YesNoResponse.Yes ||
                                    causeOfDeath === YesNoResponse.None ? (
                                        ''
                                    ) : (
                                        <Fragment>
                                            <Header.Subheader className='family-history-header-mobile'>
                                                Living?
                                            </Header.Subheader>
                                            <div className='family-history-toggle'>
                                                <ToggleButton
                                                    active={
                                                        living ===
                                                        YesNoResponse.Yes
                                                            ? true
                                                            : false
                                                    }
                                                    condition={condition}
                                                    title='Yes'
                                                    onToggleButtonClick={
                                                        this.handleLivingToggle
                                                    }
                                                    className='fam-hist-buttons'
                                                />
                                                <ToggleButton
                                                    active={
                                                        living ===
                                                        YesNoResponse.No
                                                            ? true
                                                            : false
                                                    }
                                                    condition={condition}
                                                    title='No'
                                                    onToggleButtonClick={
                                                        this.handleLivingToggle
                                                    }
                                                    className='fam-hist-buttons'
                                                />
                                            </div>
                                        </Fragment>
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Header.Subheader className='family-history-header-mobile'>
                                    Comments
                                </Header.Subheader>
                                <Form.TextArea
                                    className='text-area comments-box-mobile'
                                    condition={condition}
                                    value={comments}
                                    placeholder='Comments'
                                    onChange={this.handleCommentsChange}
                                    rows={3}
                                />
                            </Grid.Row>
                            <Grid.Row
                                width={4}
                                className='delete-family-member-row-mobile'
                            >
                                <Button
                                    circular
                                    icon='close'
                                    size='mini'
                                    onClick={() =>
                                        this.props.handleDelete(
                                            index,
                                            family_index
                                        )
                                    }
                                    aria-label='delete-family-member'
                                    className='hpi-ph-button'
                                />
                                delete family member
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                </Grid>
            </div>
        ) : (
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
                            <ToggleButton
                                active={
                                    causeOfDeath === YesNoResponse.Yes
                                        ? true
                                        : false
                                }
                                condition={condition}
                                title='Yes'
                                onToggleButtonClick={
                                    this.handleCauseOfDeathToggle
                                }
                                className='fam-hist-buttons'
                            />
                            <ToggleButton
                                active={
                                    causeOfDeath === YesNoResponse.No
                                        ? true
                                        : false
                                }
                                condition={condition}
                                title='No'
                                onToggleButtonClick={
                                    this.handleCauseOfDeathToggle
                                }
                                className='fam-hist-buttons'
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
                                <ToggleButton
                                    active={
                                        living === YesNoResponse.Yes
                                            ? true
                                            : false
                                    }
                                    condition={condition}
                                    title='Yes'
                                    onToggleButtonClick={
                                        this.handleLivingToggle
                                    }
                                    className='fam-hist-buttons'
                                />
                                <ToggleButton
                                    active={
                                        living === YesNoResponse.No
                                            ? true
                                            : false
                                    }
                                    condition={condition}
                                    title='No'
                                    onToggleButtonClick={
                                        this.handleLivingToggle
                                    }
                                    className='fam-hist-buttons'
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
)(FamilyHistoryDropdown);
