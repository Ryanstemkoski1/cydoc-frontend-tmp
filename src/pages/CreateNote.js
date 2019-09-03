import React, {Component, Fragment} from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "../components/NotePage";
import NavMenu from "../components/NavMenu";

class CreateNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'Medical History'
        }
    }

    onTabChange = (name) => this.setState({ activeItem: name });

    render() {
                return (
                    <Fragment>
                                    <NavMenu attached="top"/>
                                    <MenuTabs
                                        activeItem={this.state.activeItem}
                                        onTabChange={this.onTabChange}
                                        attached="top"
                                    />
                            <NotePage activeItem={this.state.activeItem}/>
                    </Fragment>
                );
        }
}

export default CreateNote;