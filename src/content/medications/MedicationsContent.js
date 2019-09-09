import React, { Component } from "react";
import TableContent from "../../components/TableContent";
import PropTypes from 'prop-types';
import { medications } from "../../States";

//Component that manages content for the Medications page
export default class MedicationsContent extends Component {
    render() {
        return(
            <TableContent
                tableHeaders={medications.fields}
                tableBodyPlaceholders={medications.fields}
                values={this.props.values}
                onTableBodyChange={this.props.onMedicationsChange}
            />
        );
    }
}

MedicationsContent.propTypes = {
  onMedicationsChange: PropTypes.func.isRequired,
  values: PropTypes.any.isRequired
};