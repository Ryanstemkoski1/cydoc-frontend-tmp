import GridContent from 'components/tools/GridContent.js';
import ToggleButton, { ButtonProps } from 'components/tools/ToggleButton';
import { YesNoResponse } from 'constants/enums';
import React, { Component, Fragment } from 'react';
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
import { Button, Divider, Form, Grid, Header, Image } from 'semantic-ui-react';
import '../hpi/knowledgegraph/src/css/Button.css';
import '../reviewofsystems/ReviewOfSystems.css';
import './FamilyHistory.css';
import FamilyHistoryDropdown from './FamilyHistoryDropdown';
import Delete from '../../../../assets/delete.svg';
import Add from '../../../../assets/add.svg';

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
        dropdownList = familyIndexes.map((familyIndex, listIndex) => (
            <FamilyHistoryDropdown
                condition={condition}
                index={index}
                key={familyIndex}
                family_index={familyIndex}
                mobile={mobile}
                // if is the first family dropdown then handleDelete will act as deleteRow.
                handleDelete={
                    listIndex === 0
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
        const newRow = (
            <Grid.Row>
                <Grid.Column width={16} className='dropdown-container'>
                    {dropdownList}
                    <Fragment>
                        <Button
                            circular
                            icon='plus'
                            size='mini'
                            onClick={this.handlePlusClick}
                            aria-label='add-family-member'
                            className='hpi-ph-button'
                        />
                        add family member
                    </Fragment>
                </Grid.Column>
            </Grid.Row>
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
        return mobile ? (
            <Grid.Row className='family-hisory-note-mobile'>
                <Form className='family-hx-note-item family-hx-note'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>{conditionInp}</div>
                        <div className='family-buttons'>
                            <button
                                title='Yes'
                                className={`yes-button ${
                                    yesActive ? 'active' : ''
                                }`}
                                type='button'
                                onClick={(event) =>
                                    handleToggle(event, { title: 'Yes' })
                                }
                            >
                                YES
                            </button>
                            <button
                                title='No'
                                className={`no-button ${
                                    noActive ? 'active' : ''
                                }`}
                                type='button'
                                onClick={(event) =>
                                    handleToggle(event, { title: 'No' })
                                }
                            >
                                NO
                            </button>
                            <button
                                className='delete-button'
                                onClick={() => {
                                    this.props.deleteRow(this.props.index);
                                }}
                            >
                                <Image src={Delete} />
                            </button>
                        </div>
                    </Form.Group>
                    {yesActive ? (
                        <div className='condition-info'>
                            {dropdownList}
                            <div className='add-icon'>
                                <Image
                                    onClick={this.handlePlusClick}
                                    src={Add}
                                />
                                Add family member
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </Form>
            </Grid.Row>
        ) : (
            <div className='family-hisory-block'>
                <div className='row-wrap'>
                    {conditionInp}
                    <div className='btn-wrap'>
                        <ToggleButton
                            active={yesActive}
                            condition={condition}
                            className='fam-hist-buttons'
                            title='Yes'
                            onToggleButtonClick={handleToggle}
                        />
                        <ToggleButton
                            active={noActive}
                            condition={condition}
                            className='fam-hist-buttons'
                            title='No'
                            onToggleButtonClick={handleToggle}
                        />
                    </div>

                    <Button
                        circular
                        icon='close'
                        onClick={() => {
                            this.props.deleteRow(this.props.index);
                        }}
                        aria-label='delete-condition'
                        className='hpi-ph-button'
                    />
                </div>
                <div className='condition-info-container'>
                    {yesActive ? (
                        /*
                        this.props.pop will always be true. This is 
                        because the family history component already
                        has a built in Add Row component, so when it
                        uses the GridContent component, there are 2 
                        Add buttons.
                        */
                        <>
                            <GridContent
                                numColumns={2}
                                contentHeader={newContentHeader}
                                rows={newRow}
                                name='Family History'
                                small={true}
                                pop={this.props.pop}
                            />
                        </>
                    ) : (
                        ''
                    )}

                    <Divider className='divider-style' />
                </div>
            </div>
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
