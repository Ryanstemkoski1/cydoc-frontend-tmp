import React, { Fragment } from 'react';
import { Table } from 'semantic-ui-react';
import { TableBodyRow } from './TableContent/TableBodyRow';
import AddRowButton from 'components/tools/AddRowButton.js'
import HPIContext from 'contexts/HPIContext.js';
import drinkTypes from 'constants/SocialHistory/drinkTypes';
import drinkSizes from 'constants/SocialHistory/drinkSizes';
import drugNames from 'constants/SocialHistory/drugNames';
import modesOfDelviery from 'constants/SocialHistory/modesOfDelivery';

class SocialHistoryTableContent extends React.Component {

    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            drinkOptions: drinkTypes,
            drinkSizes: drinkSizes,
            drugOptions: drugNames,
            modesOfDelivery: modesOfDelviery
        }
        this.makeHeader = this.makeHeader.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    handleTableBodyChange(event, data){ 
        let newState = this.props.values;
        console.log(data.rowindex);
        console.log(newState[this.props.name]["fields"][data.rowindex]);
        newState[this.props.name]["fields"][data.rowindex][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
        console.log(this.props.values);
    }

    makeHeader(){
        return(
            <Table.Row>
                {this.props.tableHeaders.map((header, index) =>
                    <Table.HeaderCell key={index}>{header}</Table.HeaderCell>)}
            </Table.Row>
        );
    }

    // addRow() {
    //     let values = this.context[this.props.category];
    //     const last_index = values.length.toString();
    //     values[last_index] = {Procedure: '', Date: '', Comments: ''}
    //     this.context.onContextChange(this.props.category, values);
    // }

    addRow() {
        let values = this.props.values;
        let fields = values[this.props.name]["fields"];
        const last_index = fields.length.toString();
        fields[last_index] = this.props.name === 'Alcohol' ? {'Drink Type': '', 'Drink Size': '', '# Per Week': ''} : {'Drug Name': '', 'Mode of Delivery': '', '# Per Week':''};
        this.context.onContextChange(this.props.category, values);
        // console.log(this.context);
    }

    makeTableBodyRows(nums){
        return nums.map((rowindex, index) =>
            <TableBodyRow
                key={index}
                rowindex={parseInt(rowindex)}
                tableBodyPlaceholders={this.props.tableBodyPlaceholders}
                onTableBodyChange={this.handleTableBodyChange}
                values={this.props.values}
                name={this.props.name}
                category={this.props.category}
                drinkOptions={this.state.drinkOptions}
                drinkSizes={this.state.drinkSizes}
                drugOptions={this.state.drugOptions}
                modesOfDelivery={this.state.modesOfDelivery}
            />
        )
    }

    render() {
        const headerRow = this.makeHeader();
        const nums = Object.keys(this.props.values[this.props.name]["fields"])
        const rows = this.makeTableBodyRows(nums);

        return (
            <div>
                <p>{this.props.prompt}</p>
                <Table celled className='table-display'>
                    <Table.Header content={headerRow} />
                    <Table.Body children={rows} />
                </Table>
                <AddRowButton
                    onClick={this.addRow}
                    name={this.props.addRow}
                />
            </div>
        )
    }
}

export default SocialHistoryTableContent;