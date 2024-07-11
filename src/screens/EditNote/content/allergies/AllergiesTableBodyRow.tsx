import { OptionMapping } from '../../../../_processOptions';
import Dropdown from '@components/tools/OptimizedDropdown';
import RemoveButton from '@components/tools/RemoveButton/RemoveButton';
import React, { Component } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import {
    AllergiesElements,
    AllergiesItem,
} from '@redux/reducers/allergiesReducer';
import { selectAllergiesItem } from '@redux/selectors/allergiesSelectors';
import { Table, TextArea, TextAreaProps } from 'semantic-ui-react';
import './table.css';

interface OwnProps {
    fields: (keyof AllergiesItem)[];
    onTableBodyChange: (
        event:
            | React.FormEvent<HTMLTextAreaElement>
            | React.SyntheticEvent
            | null,
        data: TextAreaProps
    ) => void;
    rowIndex: keyof AllergiesElements;
    allergensOptions: OptionMapping;
    allergicReactionsOptions: OptionMapping;
    onAddItem: (_e: any, data: { [key: string]: any }) => void;
    deleteRow: (index: string) => void;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

class AllergiesTableBodyRow extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleCellClick = this.handleCellClick.bind(this);
    }

    handleCellClick = (e: React.MouseEvent) => {
        const innerInput = (e.target as HTMLTableCellElement)
            .lastElementChild as any;
        // Handles clicks outside of the 'clickable area' (padding) of the textarea component within a cell
        if (innerInput != null) {
            if (innerInput.type === 'textarea') {
                innerInput.focus();
            }
        }
    };

    render() {
        const {
            allergensOptions,
            allergicReactionsOptions,
            fields,
            onTableBodyChange,
            onAddItem,
            rowIndex,
        } = this.props;
        const {
            incitingAgent,
            reaction,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            comments /* NOTE: if you remove this field, "comments" verify that corresponding tests for this file aren't failing  */,
        } = this.props.allergiesItem;

        const tableRows = fields.map(
            (field: keyof AllergiesItem, index: number) => {
                if (field === 'incitingAgent') {
                    return (
                        <Table.Cell key={index}>
                            <label>Inciting Agent</label>
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
                                options={allergensOptions}
                                onAddItem={onAddItem}
                                onChange={onTableBodyChange}
                                rowIndex={rowIndex}
                                value={incitingAgent}
                            />
                        </Table.Cell>
                    );
                } else if (field === 'reaction') {
                    return (
                        <Table.Cell key={index}>
                            <label>Reaction</label>
                            <Dropdown
                                fluid
                                search
                                selection
                                clearable
                                transparent
                                allowAdditions
                                aria-label='reaction'
                                placeholder='Allergic Reaction'
                                type='reaction'
                                options={allergicReactionsOptions}
                                onAddItem={onAddItem}
                                onChange={onTableBodyChange}
                                rowIndex={rowIndex}
                                value={reaction}
                            />
                        </Table.Cell>
                    );
                } else {
                    return (
                        <Table.Cell key={index} onClick={this.handleCellClick}>
                            <label>Comments</label>
                            <div className='ui form'>
                                <TextArea
                                    rows={3}
                                    type={field}
                                    onChange={onTableBodyChange}
                                    rowIndex={rowIndex}
                                    value={eval(field)}
                                    className='table-row-text'
                                    id='row'
                                />
                            </div>
                        </Table.Cell>
                    );
                }
            }
        );

        return (
            <Table.Row>
                {tableRows}
                <td>
                    <RemoveButton
                        onClick={() => {
                            this.props.deleteRow(rowIndex as string);
                        }}
                    />
                </td>
            </Table.Row>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState, rowProps: OwnProps) => {
    return {
        allergiesItem: selectAllergiesItem(state, rowProps.rowIndex),
    };
};

const connector = connect(mapStateToProps);

export default connector(AllergiesTableBodyRow);
