import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import {ALLERGIES} from "../../constants"
import PropTypes from 'prop-types';

//Component that manages the layout for the allergies page
export default class AllergiesContent extends Component {
    render(){
        //get the allergies fields from the constants file
        const {fields} = ALLERGIES;
        return (
            <TableContent
                tableHeaders={fields}
                tableBodyPlaceholders={fields}
                onTableBodyChange={this.props.onAllergiesChange}
                values={this.props.values}
            />
        );
    }
}

AllergiesContent.propTypes = {
  onAllergiesChange: PropTypes.func
};