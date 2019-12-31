import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import { surgicalHistory } from "../../constants/States";
import PropTypes from 'prop-types';
import HPIContext from "../../contexts/HPIContext"

//Component that manages the content for the  Surgical History tab
export default class SurgicalHistoryContent extends Component {
    render(){
        return (
            <HPIContext.Consumer>
            {(context) => {
                console.log(context["Surgical History"])
                console.log(context.onContextChange.bind(context, "Surgical History"))
                return (
                <TableContent
                    tableHeaders={surgicalHistory.fields}
                    tableBodyPlaceholders={surgicalHistory.fields}
                    values={context["Surgical History"]}
                    onTableBodyChange={context.onContextChange.bind(context, "Surgical History")}
                />
                )
            }}
            </HPIContext.Consumer>
        );
    }
}

SurgicalHistoryContent.propTypes = {
  onSurgicalHistoryChange: PropTypes.func.isRequired,
  values: PropTypes.any.isRequired
};