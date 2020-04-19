import React, { Component } from 'react';
import TableContent from '../../components/TableContent';
import { medications } from '../../constants/States';
import HPIContext from '../../contexts/HPIContext';
import drug_names from '../../constants/drugNames';

//Component that manages content for the Medications page
export default class MedicationsContent extends Component {
    render() {
        const category = 'Medications';
        const placeholders = medications.fields;
        
        return (
            <HPIContext.Consumer>
                {(context) => {
                    return (
                        <TableContent
                            tableHeaders={medications.fields}
                            tableBodyPlaceholders={placeholders}
                            category = {category}
                            values={context['Medications']}
                            onTableBodyChange={context.onContextChange.bind(context, 'Medications')}
                            pop={true}
                            mobile={this.props.mobile}
                            name='medication'
                            dropdown={true}
                            options={drug_names}
                            dropdown_placeholder='Drug Name'
                        />
                    );
                }}
            </HPIContext.Consumer>  
        );
    }
}