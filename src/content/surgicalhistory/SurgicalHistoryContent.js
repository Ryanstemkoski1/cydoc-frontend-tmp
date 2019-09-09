import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import { surgicalHistory} from "../../StateShapes";
import PropTypes from 'prop-types';
export default class SurgicalHistoryContent extends Component {
    render(){
        return (
            <TableContent
                tableHeaders={surgicalHistory.fields}
                tableBodyPlaceholders={surgicalHistory.fields}
                values={this.props.values}
                onTableBodyChange={this.props.onSurgicalHistoryChange}
            />
        );
    }
}

SurgicalHistoryContent.propTypes = {
  onSurgicalHistoryChange: PropTypes.func.isRequired,
  values: PropTypes.any.isRequired
};