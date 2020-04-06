import React, { Component } from 'react';
import TableContent from "../../components/TableContent";
import { allergies } from "../../constants/States";
import PropTypes from 'prop-types';
import HPIContext from "../../contexts/HPIContext"

//Component that manages the layout for the allergies page
export default class AllergiesContent extends Component {
    render(){
        const category = "Allergies"
        return (
             <HPIContext.Consumer>
            {(context) => {
                return (
                <TableContent
                    category={category}
                    tableHeaders={allergies.fields}
                    tableBodyPlaceholders={allergies.fields}
                    values={context["Allergies"]}
                    onTableBodyChange={context.onContextChange.bind(context, "Allergies")}
                    mobile={this.props.mobile}
                    name="allergy"
                />
                )
            }}
            </HPIContext.Consumer>
        );
    }
}