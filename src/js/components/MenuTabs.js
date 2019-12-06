import React, {Component, Fragment} from 'react'
import {Menu, Container, Button} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {TAB_NAMES} from '../constants/constants'
import {connect} from "react-redux";
import {saveNote} from "../actions";

const mapStateToProps = state => {
    return {
        currentNote: state.currentNote
    };
};

function mapDispatchToProps(dispatch){
    return {
        saveNote: note => dispatch(saveNote(note))
    };
}
//Component for the tabs that toggle the different sections of the Create Note editor
class ConnectedMenuTabs extends Component {
    constructor(props) {
        super(props);
        this.handleItemClick =  this.handleItemClick.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    //onClick event is handled by parent
    handleItemClick = (e, { name }) => this.props.onTabChange(name);
    handleSave(){
        this.props.saveNote({
            noteName:"note",
            body:
                [
                    {dogs:["terriers","corgis","dalmations"]},
                    {fish:["goldfish", "beta"]}
                ],
            doctorID:"5d696a7dbf476c61064fd58d"
        });
    }
    render() {
        const {activeItem} = this.props;

        const tabMenuItems = TAB_NAMES.map((name, index) =>
            <Menu.Item
                key={index}
                name={name}
                active={activeItem === name}
                onClick={this.handleItemClick}
                style={{borderColor: "white", fontSize: '13px'}}
                href={"#"+ encodeURI(name)}/>
            );

        return (
            <Fragment>
                <Menu secondary attached borderless style={{border: "white"}}>
                    <Container>
                        <Menu.Item>{this.props.currentNote}</Menu.Item>
                        <Menu.Item>
                            <Button basic onClick={this.handleSave}>Save</Button>
                        </Menu.Item>
                    </Container>
                </Menu>
                <Menu tabular style={{borderColor: "white"}} attached={this.props.attached}>
                    <Container >
                        {tabMenuItems}
                    </Container>
                </Menu>
            </Fragment>

        )
    }
}

ConnectedMenuTabs.propTypes = {
  activeItem: PropTypes.string,
  attached: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
  ]),
  onTabChange: PropTypes.func
};

const MenuTabs = connect(mapStateToProps, mapDispatchToProps)(ConnectedMenuTabs);
export default MenuTabs;