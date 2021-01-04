import React, { Component } from 'react';
import { Button, Dropdown, Input, Table, TextArea } from 'semantic-ui-react';

export class SocialHistoryTableBodyRow extends Component {
    constructor(props) {
        super(props);
    }

    handleCellClick = (e) => {
        const innerInput = e.target.lastElementChild
        // Handles clicks outside of the "clickable area" (padding) of the input component within a cell
        if (innerInput != null) {
            if (innerInput.type !== "submit") {
                // will ensure clicks near delete button will not automatically click
                innerInput.click();
            }
        }
    }

    getCell(placeholder) {
        const {
            name,
            drinkOptions,
            drinkSizes,
            values,
            onTableBodyChange,
            rowindex,
            drugOptions,
            modesOfDelivery
        } = this.props

        let cell;

        switch (placeholder) {
            case 'Drink Type': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={drinkOptions}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[name]["fields"][rowindex][placeholder]}
                            className='side-effects'
                        />
                    </Input>
                );  
                break;
            }
            case 'Drink Size': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={drinkSizes}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[name]["fields"][rowindex][placeholder]}
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            // this one is for recreational drugs
            case 'Drug Name': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={drugOptions}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[name]["fields"][rowindex][placeholder]}
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case 'Mode of Delivery': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            options={modesOfDelivery}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[name]["fields"][rowindex][placeholder]}
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case '# Per Week': {
                cell = (
                    <Input
                        fluid
                        type="numberPerWeek"
                        className='content-input-computer content-dropdown'
                        onChange={onTableBodyChange}
                        placeholder={placeholder}
                        rowindex={rowindex}
                        onChange={onTableBodyChange}
                        value={values[name]["fields"][rowindex][placeholder]}
                    />
                );
                break;
            }
            case 'delete': {
                cell = (
                    <Button
                        rowindex={rowindex}
                        circular
                        icon='close'
                        size='mini'
                        type='delete'
                        basic
                        onClick={this.props.handleDelete}
                    />      
                )
                break;
            }
            default: {
                cell = (
                    <TextArea
                        rows={3}
                        type={placeholder}
                        onChange={onTableBodyChange}
                        rowindex={rowindex}
                        value={values[name]["fields"][rowindex][placeholder]}
                        className='table-row-text'
                    />
                );
                break;
            }
        }
        return cell;
    }

    render() {
        const { tableBodyPlaceholders } = this.props;

        const tableRows = tableBodyPlaceholders.map((placeholder, index) => {
            return (
                <Table.Cell 
                    key={index}
                    collapsing={placeholder === 'delete' ? true : false} 
                    style={placeholder === 'delete' ? { borderTop: 0, borderLeft: 0 } : null}
                    onClick={this.handleCellClick}
                >
                    {this.getCell(placeholder)}
                </Table.Cell>
            )
        });

        return (
            <Table.Row>
                {tableRows}
            </Table.Row>
        );
    }
}