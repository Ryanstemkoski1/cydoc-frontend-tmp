import React, {Fragment} from 'react';
import NavMenu from "../components/NavMenu";
import NewTemplateForm from "../components/NewTemplateForm";
import "../../css/components/navMenu.css";
import "../../css/components/newTemplateForm.css";

export default class CreateGraph extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Fragment>
                <div class="nav-menu-container">
                    <NavMenu />
                </div>
                <div class="new-template-form-container">
                    <NewTemplateForm />
                </div>
            </Fragment>
        );
    }

}