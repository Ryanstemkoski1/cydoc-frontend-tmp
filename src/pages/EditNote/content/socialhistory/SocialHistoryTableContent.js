import React, { Fragment } from 'react';
import { Table, Accordion, Form, Input, Dropdown, Button, Grid } from 'semantic-ui-react';
import { SocialHistoryTableBodyRow } from './SocialHistoryTableBodyRow'
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
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
    }

    // handles change in table cell - updates context
    handleTableBodyChange(event, data) { 
        let newState = this.props.values;
        newState[this.props.name]["fields"][data.rowindex][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    // makes header row with labels for table 
    makeHeader() {
        return(
            <Table.Row>
                {this.props.tableHeaders.map((header, index) =>
                    <Table.HeaderCell key={index} style={header === '' ? { borderLeft: 0 } : null}>{header}</Table.HeaderCell>)}
            </Table.Row>
        );
    }

    // accordion panels help construct the mobile view of the table
    makeAccordionPanels(nums) {
        const { values, tableBodyPlaceholders, name } = this.props;

        const panels = [];

        for (let i = 0; i < nums.length; i++) {
            let titleContent;
            const contentInputs = [];

            switch(name) {
                case 'Alcohol': {
                    titleContent = (
                        <Form className='inline-form'>
                            <Input transparent className='content-input-surgical content-dropdown medication'>
                                <Dropdown fluid search selection 
                                    options={this.state.drinkOptions}
                                    placeholder={tableBodyPlaceholders[0]}
                                    onChange={this.handleTableBodyChange}
                                    rowindex={i}
                                    value={values[name]["fields"][i][tableBodyPlaceholders[i]]}
                                    className='side-effects'
                                    icon=''
                                    onBlur={event => event.preventDefault()}
                                />
                                <Button style={{marginTop: 5, marginBottom: 5}}
                                    icon='close' 
                                    compact
                                    basic
                                    onClick={this.deleteRow}
                                />
                            </Input>
                        </Form>
                    )
                    break;
                }
                case 'Recreational Drugs': {
                    titleContent = (
                        <Form className='inline-form'>
                            <Input transparent className='content-input-surgical content-dropdown medication'>
                                <Dropdown fluid search selection
                                    options={this.state.drugOptions}
                                    placeholder={tableBodyPlaceholders[0]}
                                    onChange={this.handleTableBodyChange}
                                    rowindex={i}
                                    value={values[name]["fields"][i][tableBodyPlaceholders[i]]}
                                    className='side-effects'
                                    icon=''
                                />
                                <Button style={{marginTop: 5, marginBottom: 5}}
                                    icon='close' 
                                    compact
                                    basic
                                    onClick={this.deleteRow}
                                />
                            </Input>
                        </Form>
                    )
                    break;
                }
            }

            for (let j = 0; j < tableBodyPlaceholders.length; j++) {
                if (tableBodyPlaceholders[j] === 'Drink Type' || tableBodyPlaceholders[j] === 'Drug Name') {
                    continue; // already created by first part of method
                } else if (tableBodyPlaceholders[j] === 'Drink Size') {
                    contentInputs.push(
                        <Input key={j} fluid transparent className='content-input content-dropdown'>
                            <Dropdown
                                fluid
                                search
                                selection
                                icon=''
                                options={this.state.drinkSizes}
                                placeholder={tableBodyPlaceholders[j]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[name]["fields"][tableBodyPlaceholders[j]]}
                                className='side-effects'
                            />
                        </Input>
                    );
                } else if (tableBodyPlaceholders[j] === 'Mode of Delivery') {
                    contentInputs.push(
                        <Input key={j} fluid transparent className='content-input content-dropdown'>
                            <Dropdown
                                fluid
                                search
                                selection
                                multiple
                                icon=''
                                options={this.state.modesOfDelivery}
                                placeholder={tableBodyPlaceholders[j]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[name]["fields"][tableBodyPlaceholders[j]]}
                                className='side-effects'
                            />
                        </Input>
                    );
                } else if (tableBodyPlaceholders[j] === '# Per Week') {
                    contentInputs.push(
                        <Input key={j} fluid transparent 
                            type="number"
                            className='content-input content-dropdown'
                            onChange={this.handleTableBodyChange}
                            placeholder={tableBodyPlaceholders[j]}
                            rowindex={i}
                            value={values[name]["fields"][tableBodyPlaceholders[j]]}
                        />
                    );
                }
            }

            // contentInputs.push(
            //     <Grid style={{ marginTop: 8, marginBottom: 1, marginLeft: 200 }}>
            //         <Button
            //             circular
            //             icon='close' 
            //             compact
            //             basic
            //             onClick={this.deleteRow}
            //         />
            //     </Grid>
            // )

            panels.push({
                key: i,
                title: {
                    content: titleContent,
                },
                content: {
                    content: (
                        <Fragment>
                            {contentInputs}
                        </Fragment>
                    ),
                }
            });
        }
        return panels;
    }

    // add row functionality to add an additional drink, drug, etc. 
    addRow() {
        let values = this.props.values;
        let fields = values[this.props.name]["fields"];
        const last_index = fields.length.toString();
        fields[last_index] = this.props.name === 'Alcohol' ? {'Drink Type': '', 'Drink Size': '', '# Per Week': ''} : {'Drug Name': '', 'Mode of Delivery': '', '# Per Week':''};
        this.context.onContextChange(this.props.category, values);
    }

    deleteRow(_event, data) {
        let values = this.props.values;
        let fields = values[this.props.name]["fields"];
        fields.splice(data.rowindex, 1);
        this.context.onContextChange(this.props.category, values);
    }

    // builds the table out of TableBodyRow component
    makeTableBodyRows(nums){
        return nums.map((rowindex, index) =>
            <SocialHistoryTableBodyRow
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
                handleDelete={this.deleteRow}
            />
        )
    }

    // renders a table with each cell dedicated to specific information for social history
    // used specifically for Alcohol and RecreationalDrugs sections
    render() {
        const headerRow = this.makeHeader();
        const nums = Object.keys(this.props.values[this.props.name]["fields"])
        const rows = this.makeTableBodyRows(nums);

        const content = this.props.mobile ? (
            <div>
                <p>{this.props.prompt}</p>
                <Accordion panels={this.makeAccordionPanels(nums)} exclusive={false} fluid styled />
            </div>
        ) : (
            <div>
                <p>{this.props.prompt}</p>
                <Table celled>
                    <Table.Header content={headerRow} />
                    <Table.Body children={rows} />
                </Table>
            </div>
        );

        return (
            <Fragment>
                {content}
                <AddRowButton
                    onClick={this.addRow}
                    name={this.props.addRow}
                />
            </Fragment>
        );
    }
}

export default SocialHistoryTableContent;