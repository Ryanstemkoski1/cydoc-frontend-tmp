import React, { Component } from "react";
import TableContent from "../../components/TableContent";
import PropTypes from 'prop-types';
import { medications } from "../../constants/States";
import HPIContext from "../../contexts/HPIContext"

//Component that manages content for the Medications page
export default class MedicationsContent extends Component {
    render() {
        return (
            <HPIContext.Consumer>
            {(context) => {
                console.log(context["Medications"])
                console.log(context.onContextChange.bind(context, "Medications"))
                return (
                <TableContent
                    tableHeaders={medications.fields}
                    tableBodyPlaceholders={medications.fields}
                    values={context["Medications"]}
                    onTableBodyChange={context.onContextChange.bind(context, "Medications")}
                    pop={true}
                />
                )
            }}
            </HPIContext.Consumer>
            
        );
    }
}