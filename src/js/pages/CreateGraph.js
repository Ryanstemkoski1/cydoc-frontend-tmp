import React, {Fragment} from 'react';
import NavMenu from "../components/NavMenu";
import NewTemplateForm from "../components/NewTemplateForm";

export default class CreateGraph extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Fragment>
                <div style={{position: "relative", top: "100px"}}>
                    <NewTemplateForm />
                </div>
                <div style={{position: "fixed", top: "0", right: "0", left: "0", boxShadow: "0 3px 4px -6px gray"}}>
                    <NavMenu attached="top"/>
                </div>
            </Fragment>
        );
    }

}