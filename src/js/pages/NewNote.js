import React, {Fragment} from 'react'
import NavMenu from "../components/NavMenu";
import NewNoteForm from "../components/NewNoteForm";

export default class NewNote extends React.Component {

    render() {
        return (
            <Fragment>
                <div style={{position: "relative", top: "100px"}}>
                    <NewNoteForm />
                </div>
                <div style={{position: "fixed", top: "0", right: "0", left: "0", boxShadow: "0 3px 4px -6px gray"}}>
                    <NavMenu attached="top"/>
                </div>
            </Fragment>
        );
    }

}