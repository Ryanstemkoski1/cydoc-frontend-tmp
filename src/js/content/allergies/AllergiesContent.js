import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import { allergies } from "../../constants/States";
import PropTypes from 'prop-types';
import HPIContext from "../../contexts/HPIContext"

//Component that manages the layout for the allergies page
export default class AllergiesContent extends Component {
    render(){
        return (
             <HPIContext.Consumer>
            {(context) => {
                console.log(context["Allergies"])
                console.log(context.onContextChange.bind(context, "Allergies"))
                return (
                <TableContent
                    tableHeaders={allergies.fields}
                    tableBodyPlaceholders={allergies.fields}
                    values={context["Allergies"]}
                    onTableBodyChange={context.onContextChange.bind(context, "Allergies")}
                />
                )
            }}
            </HPIContext.Consumer>
        );
    }
}

AllergiesContent.propTypes = {
  onAllergiesChange: PropTypes.func
};