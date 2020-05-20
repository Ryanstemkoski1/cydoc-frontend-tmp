import React, { Component } from 'react';
import TableContent from 'components/tools/TableContent/TableContent.js';
import { surgicalHistory } from 'constants/States';
import HPIContext from 'contexts/HPIContext.js';

//Component that manages the content for the  Surgical History tab
export default class SurgicalHistoryContent extends Component {
    render() {
        const category = 'Surgical History';

        return (
            <HPIContext.Consumer>
                {(context) => {
                    return (
                        <TableContent
                            category={category}
                            tableHeaders={surgicalHistory.fields}
                            tableBodyPlaceholders={surgicalHistory.fields}
                            values={context['Surgical History']}
                            onTableBodyChange={context.onContextChange.bind(context, 'Surgical History')}
                            mobile={this.props.mobile}
                            name='surgical history'
                        />
                    );
                }}
            </HPIContext.Consumer>
        );
    }
}