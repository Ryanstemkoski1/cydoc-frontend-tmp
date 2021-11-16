import React, { Component, Fragment } from 'react';
import {
    Form,
    Grid,
    Button,
    Header,
    Divider,
    ButtonProps,
} from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton.js';
import FamilyHistoryDropdown from './FamilyHistoryDropdown';
import GridContent from 'components/tools/GridContent.js';
import '../hpi/knowledgegraph/src/css/Button.css';
import '../reviewofsystems/ReviewOfSystems.css';
import './FamilyHistory.css';
import { connect } from 'react-redux';
import {
    toggleConditionOption,
    addFamilyMember,
    deleteFamilyMember,
    updateMember,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateComments,
    addCondition,
} from 'redux/actions/familyHistoryActions';
import {
    selectFamilyHistoryState,
    selectFamilyHistoryConditions,
    selectFamilyHistoryCondition,
    FamilyHistoryConditionFlat,
} from 'redux/selectors/familyHistorySelectors';
import { YesNoResponse } from 'constants/enums';
import {
    FamilyHistoryState,
    FamilyHistoryCondition,
} from 'redux/reducers/familyHistoryReducer';
import { CurrentNoteState } from 'redux/reducers';

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
            data.title.toUpperCase()
        );
    }
    /* eslint-disable-next-line */
    handleDelete(index: string, family_index: string) {
        this.props.deleteFamilyMember(index, family_index);
    }

    render() {
        const { mobile, conditionInp, index, isPreview } = this.props;
        const {
            condition,
            hasAfflictedFamilyMember,
            familyMembers,
        } = this.props.familyHistoryItem;
        // array of dropdowns displayed on Family History Family Member column
        // variable range that changes when the user clicks the + (add member) button
        // we want there to be at least one dropdown
        let dropdownList = [];
        const familyIndexes = Object.keys(familyMembers);
        dropdownList = familyIndexes.map((familyIndex) => (
            <FamilyHistoryDropdown
                condition={condition}
                index={index}
                key={familyIndex}
                family_index={familyIndex}
                mobile={mobile}
                handleDelete={this.handleDelete}
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
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>{conditionInp}</div>
                        <div>
                            <ToggleButton
                                active={yesActive}
                                condition={condition}
                                title='Yes'
                                className='fam-hist-buttons'
                                onToggleButtonClick={handleToggle}
                            />
                            <ToggleButton
                                active={noActive}
                                condition={condition}
                                title='No'
                                className='fam-hist-buttons'
                                onToggleButtonClick={handleToggle}
                            />
                        </div>
                    </Form.Group>
                    <div className='condition-info'>
                        {yesActive ? (
                            <>
                                {dropdownList}
                                <>
                                    <Button
                                        circular
                                        icon='plus'
                                        size='mini'
                                        onClick={this.handlePlusClick}
                                        aria-label='add-family-member'
                                        className='hpi-ph-button'
                                    />
                                    add family member
                                </>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </Form>
            </Grid.Row>
        ) : (
            <div>
                {conditionInp}
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
    addCondition,
};

export default connect(mapStateToProps, mapDispatchToProps)(FamilyHistoryBlock);
