import React, { Component } from 'react';
import { Table, TextArea, TextAreaProps } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { AllergiesState, AllergiesItem } from 'redux/reducers/allergiesReducer';
import { CurrentNoteState } from 'redux/reducers';
import {
    selectAllergiesState,
    selectAllergiesItem,
} from 'redux/selectors/allergiesSelectors';

class AllergiesTableBodyRow extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleCellClick = this.handleCellClick.bind(this);
    }

    handleCellClick = (e: React.MouseEvent) => {
        const innerInput = (e.target as HTMLTableCellElement)
            .lastElementChild as any;
        // Handles clicks outside of the "clickable area" (padding) of the textarea component within a cell
        if (innerInput != null) {
            if (innerInput.type === 'textarea') {
                innerInput.focus();
            }
        }
    };

    render() {
        const { fields, onTableBodyChange, rowIndex } = this.props;
        const { incitingAgent, reaction, comments } = this.props.allergiesItem;

        const tableRows = fields.map(
            (field: keyof AllergiesItem, index: number) => {
                return (
                    <Table.Cell key={index} onClick={this.handleCellClick}>
                        <TextArea
                            rows={3}
                            type={field}
                            onChange={onTableBodyChange}
                            rowIndex={rowIndex}
                            value={eval(field)}
                            className='table-row-text'
                        />
                    </Table.Cell>
                );
            }
        );

        return <Table.Row>{tableRows}</Table.Row>;
    }
}

interface AllergiesProps {
    allergies: AllergiesState;
    allergiesItem: AllergiesItem;
}

interface RowProps {
    fields: (keyof AllergiesItem)[];
    onTableBodyChange: (
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) => void;
    rowIndex: keyof AllergiesState;
    isPreview: boolean;
}

type Props = AllergiesProps & RowProps;

const mapStateToProps = (
    state: CurrentNoteState,
    rowProps: RowProps
): AllergiesProps => {
    return {
        allergies: selectAllergiesState(state),
        allergiesItem: selectAllergiesItem(state, rowProps.rowIndex),
    };
};

export default connect(mapStateToProps)(AllergiesTableBodyRow);
