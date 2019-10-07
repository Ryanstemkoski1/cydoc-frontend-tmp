import React, {Component, Fragment} from 'react';
import GridContent from "../../components/GridContent";
import FamilyHistoryContentHeader from "./FamilyHistoryContentHeader";
import {Input} from "semantic-ui-react";
import FamilyHistoryNoteRow from "./FamilyHistoryNoteRow";
import {CONDITIONS} from '../../constants/constants'

//TODO: finish the styling for this page
//Component that manages the layout for the Family History page.
export default class FamilyHistoryContent extends Component {
    render(){
        //Create collection of rows
        const listItems = CONDITIONS.map((condition) => <FamilyHistoryNoteRow condition={condition} />);
        //Create the row to be added with addRow button
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<FamilyHistoryNoteRow condition={inputField}/>);

        return(
            <Fragment>
                <GridContent
                    numColumns={5}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    customNoteRow={customNoteRow} />
            </Fragment>
        )
    }
}