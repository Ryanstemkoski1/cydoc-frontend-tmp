import React, { Component } from 'react'
import { Menu, Container} from 'semantic-ui-react'

export default class MenuTabs extends Component {
    state = { activeItem: 'Medical History' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        const tabNames = ["HPI", "Medical History", "Surgical History", "Medications", "Allergies", "Family History",
            "Social History", "Review of Systems", "Physical Exam"];

        const tabMenuItems = tabNames.map((name) =>
            <Menu.Item
            name={name}
            active={activeItem === name}
            onClick={this.handleItemClick}/>);

        return (
            <Menu tabular>
                <Container>
                    {tabMenuItems}
                </Container>
            </Menu>
        )
    }
}
