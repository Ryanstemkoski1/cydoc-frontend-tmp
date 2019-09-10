import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import { surgicalHistory} from "../../States";
import PropTypes from 'prop-types';

//Component that manages the content for the  Surgical History tab
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