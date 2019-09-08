import React, { Component } from 'react'
import { Menu, Container} from 'semantic-ui-react'
import PropTypes from 'prop-types'

export default class MenuTabs extends Component {
    constructor(props) {
        super(props);
        this.handleItemClick =  this.handleItemClick.bind(this)
    }

    handleItemClick = (e, { name }) => this.props.onTabChange(name);

    render() {
        const activeItem = this.props.activeItem;
        const tabNames = ["HPI", "Medical History", "Surgical History", "Medications", "Allergies", "Family History",
            "Social History", "Review of Systems", "Physical Exam"];

        const tabMenuItems = tabNames.map((name, index) =>
            <Menu.Item
                key={index}
                name={name}
                active={activeItem === name}
                onClick={this.handleItemClick}
                style={{borderColor: "white"}}
                href={"#"+ encodeURI(name)}/>
            );

        return (
            <Menu tabular style={{borderColor: "white"}} attached={this.props.attached}>
                <Container >
                    {tabMenuItems}
                </Container>
            </Menu>
        )
    }
}

MenuTabs.propTypes = {
  activeItem: PropTypes.string,
  attached: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
  ]),
  onTabChange: PropTypes.func
};