import React, { Component } from "react";
import TableContent from "../../components/TableContent";
import { medications } from "../../constants/States";
import HPIContext from "../../contexts/HPIContext";
import "../../../css/content/medicationsContent.css";
import drug_names from '../../constants/drugNames'
import '../../constants/drugNames'

//Component that manages content for the Medications page
export default class MedicationsContent extends Component {
    constructor(context) {
        super(context) 
        this.state = {
            top_drugs: []
        }
    }
    componentDidMount() {

    }

    render() {
        const category = "Medications";
        const placeholders = this.props.mobile ? [medications.fields[0], medications.fields[4], medications.fields[5]] : medications.fields;
        
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
                        tableBodyPlaceholders={placeholders}
                        category = {category}
                        values={context["Medications"]}
                        onTableBodyChange={context.onContextChange.bind(context, "Medications")}
                        pop={true}
                        mobile={this.props.mobile}
                        name={"medication"}
                        dropdown={true}
                        options={drug_names}
                        dropdown_placeholder={"Drug Name"}
                    />
                </div>
                )
            }}
            </HPIContext.Consumer>
            
        );
    }
}