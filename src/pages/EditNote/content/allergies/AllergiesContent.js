import React, { Component } from 'react';
import TableContent from 'components/tools/TableContent/TableContent.js';
import { allergies } from 'constants/States';
import HPIContext from 'contexts/HPIContext.js';

//Component that manages the layout for the allergies page
export default class AllergiesContent extends Component {
    render() {
        const category = 'Allergies';

        return (
            <HPIContext.Consumer>
                {(context) => {
                    return (
                        <TableContent
                            category={category}
                            tableHeaders={allergies.fields}
                            tableBodyPlaceholders={allergies.fields}
                            values={context['Allergies']}
                            onTableBodyChange={context.onContextChange.bind(context, 'Allergies')}
                            mobile={this.props.mobile}
                            name='allergy'
                        />
                    )
                }}
            </HPIContext.Consumer>
        );
    }
}