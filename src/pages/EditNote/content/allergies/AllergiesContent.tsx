import React, { Component } from 'react';
import {
    Accordion,
    Form,
    Input,
    Table,
    TextAreaProps,
    InputOnChangeData,
    DropdownProps,
    Header,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import Dropdown from 'components/tools/OptimizedDropdown';
import { PATIENT_HISTORY_ALLERGIES_MOBILE_BP } from 'constants/breakpoints';
import allergens from 'constants/allergens';
import allergicReactions from 'constants/allergicReactions';
import AllergiesTableBodyRow from './AllergiesTableBodyRow';
import { connect } from 'react-redux';
import {
    toggleHasAllergies,
    updateIncitingAgent,
    updateReaction,
    updateComments,
    addAllergy,
    deleteAllergy,
    updateId,
} from 'redux/actions/allergiesActions';
import {
    AllergiesElements,
    AllergiesItem,
} from 'redux/reducers/allergiesReducer';
import { CurrentNoteState } from 'redux/reducers';
import {
    selectAllergies,
    selectHasAllergiesState,
} from 'redux/selectors/allergiesSelectors';
import './table.css';
import { OptionMapping } from '_processOptions';
import ToggleButton from 'components/tools/ToggleButton.js';
import { questionContainer, questionTextStyle } from './styles';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';

//Component that manages the layout for the allergies page
class AllergiesContent extends Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            active: new Set(),
            allergensOptions: allergens,
            allergicReactionsOptions: allergicReactions,
        };
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.toggleYesNoButton = this.toggleYesNoButton.bind(this);
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

        this.setState({ windowWidth });
    }

    addRow() {
        this.props.addAllergy();
    }

    deleteRow = (index: string) => {
        this.props.deleteAllergy(index);
    };

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(
        _event:
            | React.FormEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>
            | React.SyntheticEvent
            | null,
        data: TextAreaProps | InputOnChangeData | DropdownProps
    ) {
        const { active } = this.state;
        if (!active.has(data.rowIndex)) {
            active.add(data.rowIndex);
            this.setState({ active });
        }
        const index = data.rowIndex;
        const type = data.type;
        const val =
            (_event?.target as HTMLTextAreaElement)?.value ?? data.value;
        switch (type) {
            case 'incitingAgent':
                this.props.updateIncitingAgent(index, val);
                this.props.updateId(index, val);
                break;
            case 'reaction':
                this.props.updateReaction(index, val);
                break;
            case 'comments':
                this.props.updateComments(index, val);
                break;
            default:
                return;
        }
    }

    //Method to generate the table header row
    makeHeader() {
        const fields = ['Inciting Agent', 'Reaction', 'Comments'];
        return (
            <Table.Row>
                {fields.map((header, index) => (
                    <Table.HeaderCell key={index} className='sticky-header'>
                        {header}
                    </Table.HeaderCell>
                ))}
            </Table.Row>
        );
    }

    toggleAccordion = (idx: string) => {
        const { active } = this.state;
        if (active.has(idx)) {
            active.delete(idx);
        } else {
            active.add(idx);
        }
        this.setState({ active });
    };

    //method to generate an collection of rows
    makeTableBodyRows(nums: string[]) {
        const cellField: (keyof AllergiesItem)[] = [
            'incitingAgent',
            'reaction',
            'comments',
        ];
        return nums.map((rowIndex: string, index: number) => (
            <AllergiesTableBodyRow
                key={index}
                rowIndex={rowIndex as keyof AllergiesElements}
                fields={cellField}
                onTableBodyChange={this.handleTableBodyChange}
                isPreview={this.props.isPreview}
                allergensOptions={this.state.allergensOptions}
                allergicReactionsOptions={this.state.allergicReactionsOptions}
                onAddItem={this.onAddItem}
                deleteRow={this.deleteRow}
            />
        ));
    }

    onAddItem = (_e: any, data: { [key: string]: any }) => {
        const { value } = data;
        this.setState((state, _props) => ({
            allergensOptions: {
                ...state.allergensOptions,
                [value]: { value, label: value },
            },
        }));
        this.setState((state, _props) => ({
            allergicReactionsOptions: {
                ...state.allergicReactionsOptions,
                [value]: { value, label: value },
            },
        }));
    };

    makeAccordionPanels(nums: string[], values: AllergiesElements) {
        const { isPreview } = this.props;

        const panels: Panel[] = [];
        nums.map((i: string) => {
            const titleContent = (
                <Form className='inline-form spacing-x'>
                    <Dropdown
                        fluid
                        search
                        selection
                        clearable
                        transparent
                        allowAdditions
                        aria-label='incitingAgent'
                        placeholder='Inciting Agent'
                        type='incitingAgent'
                        options={this.state.allergensOptions}
                        onAddItem={this.onAddItem}
                        onChange={this.handleTableBodyChange}
                        rowIndex={i}
                        value={isPreview ? '' : values[i].incitingAgent}
                    />
                    <Dropdown
                        fluid
                        search
                        selection
                        clearable
                        transparent
                        allowAdditions
                        aria-label='reaction'
                        placeholder='Reaction'
                        type='reaction'
                        options={this.state.allergicReactionsOptions}
                        onAddItem={this.onAddItem}
                        onChange={this.handleTableBodyChange}
                        rowIndex={i}
                        value={isPreview ? '' : values[i].reaction}
                    />
                </Form>
            );

            const contentInputs = (
                <div id='contents-input-div'>
                    <label
                        className='medications-content-input-label'
                        id='comments-label'
                    >
                        <b>Comments:</b>
                    </label>
                    <div id='contents-input-div-inline'>
                        <Input
                            fluid
                            transparent
                            rowIndex={i}
                            disabled={isPreview}
                            type='comments'
                            placeholder='Comments'
                            onChange={this.handleTableBodyChange}
                            value={isPreview ? '' : values[i].comments}
                            className='content-input'
                            id='placeholder'
                        />
                    </div>
                </div>
            );

            panels.push({
                key: i,
                active: this.state.active.has(i),
                title: {
                    content: titleContent,
                },
                content: {
                    content: <>{contentInputs}</>,
                },
                onTitleClick: (event: React.MouseEvent) => {
                    if ((event.target as HTMLInputElement).type !== 'text') {
                        this.toggleAccordion(i);
                    }
                },
            });
        });
        return panels;
    }

    toggleYesNoButton(state: boolean | null) {
        this.props.toggleHasAllergies(state as boolean);
    }

    render() {
        const values = this.props.allergies;
        const nums = Object.keys(values);
        const { hasAllergies, patientView } = this.props;

        const content = (
            <>
                {this.state.windowWidth <
                PATIENT_HISTORY_ALLERGIES_MOBILE_BP ? (
                    <Accordion
                        panels={this.makeAccordionPanels(nums, values)}
                        exclusive={false}
                        fluid
                        styled
                    />
                ) : (
                    <Table celled className='table-display'>
                        <Table.Header content={this.makeHeader()} />
                        {/* eslint-disable-next-line react/no-children-prop */}
                        <Table.Body children={this.makeTableBodyRows(nums)} />
                    </Table>
                )}
            </>
        );

        return (
            <>
                {patientView && (hasAllergies === null || !nums.length) && (
                    <div style={questionContainer}>
                        <Header
                            as='h2'
                            textAlign='left'
                            content='Do you have any allergies?'
                            style={questionTextStyle}
                        />
                        <ToggleButton
                            className='button_yesno'
                            title='Yes'
                            active={hasAllergies || false}
                            onToggleButtonClick={() =>
                                this.toggleYesNoButton(true)
                            }
                        />
                        <ToggleButton
                            className='button_yesno'
                            title='No'
                            active={hasAllergies !== null && !hasAllergies}
                            onToggleButtonClick={() =>
                                this.toggleYesNoButton(false)
                            }
                        />
                    </div>
                )}
                {nums.length && (hasAllergies || !patientView) ? content : ''}
                {!this.props.isPreview && (hasAllergies || !patientView) && (
                    <AddRowButton onClick={this.addRow} name='allergy' />
                )}
            </>
        );
    }
}

type Panel = {
    key: string;
    active: boolean;
    title: { content: JSX.Element };
    content: { content: JSX.Element };
    onTitleClick: (event: React.MouseEvent) => void;
};

interface DispatchProps {
    updateIncitingAgent: (index: string, newIncitingAgent: string) => void;
    updateReaction: (index: string, newReaction: string) => void;
    updateComments: (index: string, newComment: string) => void;
    updateId: (index: string, id: string) => void;
    addAllergy: () => void;
    deleteAllergy: (index: string) => void;
    toggleHasAllergies: (state: boolean) => void;
}

interface AllergiesProps {
    hasAllergies: boolean | null;
    allergies: AllergiesElements;
    patientView: boolean;
}

interface ContentProps {
    isPreview: boolean;
    mobile: boolean;
}

interface OwnState {
    windowWidth: number;
    active: Set<string>;
    allergensOptions: OptionMapping;
    allergicReactionsOptions: OptionMapping;
}

type Props = AllergiesProps & ContentProps & DispatchProps;

const mapStateToProps = (state: CurrentNoteState): AllergiesProps => {
    return {
        hasAllergies: selectHasAllergiesState(state),
        allergies: selectAllergies(state),
        patientView: selectPatientViewState(state),
    };
};

const mapDispatchToProps = {
    toggleHasAllergies,
    updateIncitingAgent,
    updateReaction,
    updateComments,
    updateId,
    addAllergy,
    deleteAllergy,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllergiesContent);
