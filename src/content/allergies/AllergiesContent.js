import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import constants from "../../constants"
import PropTypes from 'prop-types';

export default class AllergiesContent extends Component {
    render(){
        const fields = constants.allergies.fields;
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