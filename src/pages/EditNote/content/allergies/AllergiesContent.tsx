import React, { Component } from 'react';
import {
    Accordion,
    Form,
    Input,
    Table,
    TextAreaProps,
    InputOnChangeData,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import AllergiesTableBodyRow from './AllergiesTableBodyRow';
import { connect } from 'react-redux';
import {
    updateIncitingAgent,
    updateReaction,
    updateComments,
    addAllergy,
    deleteAllergy,
} from 'redux/actions/allergiesActions';
import { AllergiesState, AllergiesItem } from 'redux/reducers/allergiesReducer';
import { CurrentNoteState } from 'redux/reducers';
import { selectAllergiesState } from 'redux/selectors/allergiesSelectors';
import './table.css';

//Component that manages the layout for the allergies page
class AllergiesContent extends Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            active: new Set(),
        };
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
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

        this.setState({ windowWidth });
    }

    addRow() {
        this.props.addAllergy();
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(
        _event:
            | React.FormEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>,
        data: TextAreaProps | InputOnChangeData
    ) {
        const { active } = this.state;
        if (!active.has(data.rowIndex)) {
            active.add(data.rowIndex);
            this.setState({ active });
        }
        const index = data.rowIndex;
        const type = data.type;
        const val = (_event.target as HTMLTextAreaElement).value;
        switch (type) {
            case 'incitingAgent':
                this.props.updateIncitingAgent(index, val);
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
        return nums.map((rowindex: string, index: number) => (
            <AllergiesTableBodyRow
                key={index}
                rowIndex={rowindex as keyof AllergiesState}
                fields={cellField}
                onTableBodyChange={this.handleTableBodyChange}
                isPreview={this.props.isPreview}
            />
        ));
    }

    makeAccordionPanels(nums: string[], values: AllergiesState) {
        const { isPreview } = this.props;

        const panels: Panel[] = [];
        nums.map((i: string) => {
            const titleContent = (
                <Form className='inline-form'>
                    <Input
                        transparent
                        placeholder='Inciting Agent'
                        type='incitingAgent'
                        onChange={this.handleTableBodyChange}
                        rowIndex={i}
                        value={isPreview ? '' : values[i].incitingAgent}
                    />
                    {' causes '}
                    <Input
                        transparent
                        placeholder='Reaction'
                        type='reaction'
                        onChange={this.handleTableBodyChange}
                        rowIndex={i}
                        value={isPreview ? '' : values[i].reaction}
                    />
                </Form>
            );

            const contentInputs = (
                <Input
                    fluid
                    transparent
                    rowIndex={i}
                    disabled={isPreview}
                    type='comments'
                    label={{
                        basic: true,
                        content: 'Comments: ',
                        className: 'medications-content-input-label',
                    }}
                    placeholder='Comments'
                    onChange={this.handleTableBodyChange}
                    value={isPreview ? '' : values[i].comments}
                    className='content-input'
                    id='placeholder'
                />
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

    render() {
        const values = this.props.allergies;
        const nums = Object.keys(values);

        const content = (
            <>
                {this.state.windowWidth < 800 ? (
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
                {content}
                {!this.props.isPreview && (
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
    addAllergy: () => void;
    deleteAllergy: (index: string) => void;
}

interface AllergiesProps {
    allergies: AllergiesState;
}

interface ContentProps {
    isPreview: boolean;
    mobile: boolean;
}

interface OwnState {
    windowWidth: number;
    active: Set<string>;
}

type Props = AllergiesProps & ContentProps & DispatchProps;

const mapStateToProps = (state: CurrentNoteState): AllergiesProps => {
    return {
        allergies: selectAllergiesState(state),
    };
};

const mapDispatchToProps = {
    updateIncitingAgent,
    updateReaction,
    updateComments,
    addAllergy,
    deleteAllergy,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllergiesContent);
