import React, { Component } from 'react'
import { Menu, Container} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {TAB_NAMES} from '../constants'

//Component for the tabs that toggle the different sections of the Create Note editor
export default class MenuTabs extends Component {
    constructor(props) {
        super(props);
        this.handleItemClick =  this.handleItemClick.bind(this)
    }

    //onClick event is handled by parent
    handleItemClick = (e, { name }) => this.props.onTabChange(name);

    render() {
        const {activeItem} = this.props;

        const tabMenuItems = TAB_NAMES.map((name, index) =>
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