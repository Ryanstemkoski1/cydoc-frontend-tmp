import React, { Component } from "react";
import TableContent from "../../components/TableContent";
import PropTypes from 'prop-types';
import { medications } from "../../constants/States";
import HPIContext from "../../contexts/HPIContext";
import "../../../css/content/medicationsContent.css";

//Component that manages content for the Medications page
export default class MedicationsContent extends Component {
    render() {
        const category = "Medications"
        return (
            <HPIContext.Consumer>
            {(context) => {
                return (
                <div>
                    <h5 className="scroll">
                        scroll &rarr;
                    </h5>
                    <TableContent
                        tableHeaders={medications.fields}
                        tableBodyPlaceholders={medications.fields}
                        category = {category}
                        values={context["Medications"]}
                        onTableBodyChange={context.onContextChange.bind(context, "Medications")}
                        pop={true}
                        mobile={this.props.mobile}
                    />
                </div>
                )
            }}
            </HPIContext.Consumer>
            
        );
    }
}