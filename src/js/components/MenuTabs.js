import React, {Component, Fragment} from 'react'
import {Menu, Container} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {TAB_NAMES} from '../constants/constants'
import {connect} from "react-redux";
import {saveNote} from "../actions";
import "../content/hpi/knowledgegraph/src/css/App.css";
import {Input} from "semantic-ui-react";
import HPIContext from '../contexts/HPIContext'

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
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context);
        this.state = {
            textInput: "Untitled",
            isTitleFocused: true
        }
        this.handleItemClick =  this.handleItemClick.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

     myFunction() {
      var x = document.getElementById("myTopnav");
      if (x.className === "topnav") {
          x.className = "ui vertical text menu"
          x.style.cssText = "margin-left: 60px;"
      } else {
        x.className = "topnav";
        x.style.cssText = "margin-left: 0px;"
      }
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
    handleInputChange = (event) => {
        this.setState({textInput: event.target.value}) 
        this.context.onContextChange("title", event.target.value)
    }
    render() {
        const {activeItem} = this.props;

        const tabMenuItems = TAB_NAMES.map((name, index) =>
            <a>
            <Menu.Item
                key={index}
                name={name}
                active={activeItem === name}
                onClick={this.handleItemClick}
                style={{borderColor: "white", fontSize: '13px'}}
                href={"#"+ encodeURI(name)}/> </a>
            );

        return (
            <Fragment>
                <Menu secondary attached borderless style={{border: "white"}}>
                    <Container>
                        <Menu.Item >
                                <Input
                                className={this.state.isTitleFocused === true ? "ui input focus" : "ui input transparent"}
                                type='text'
                                placeholder="Untitled Note"
                                style={{fontSize: 16, marginBottom: 5, outline: 'none'}}
                                onChange={this.handleInputChange}
                                onFocus={()=>{
                                    this.setState({isTitleFocused: true})
                                    if (this.context['title'] == "Untitled Note") {
                                        this.context.onContextChange("title", "")
                                    }
                                }}
                                onBlur={()=>{
                                    this.setState({isTitleFocused: false})
                                    if (this.context['title'] == '') {
                                        this.context.onContextChange("title", "Untitled Note")
                                    }
                                }}
                                value={this.context['title']} 
                                />
                        </Menu.Item>
                    </Container>
                </Menu>
                <Menu tabular attached={this.props.attached}>
                    <div className="topnav" id='myTopnav'>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                    <Container style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                         {tabMenuItems}
                    </Container>
                        <a href="javascript:void(0);" className="icon" onClick={this.myFunction}>
                            <i className="fa fa-bars"></i>
                        </a>
                    </div>
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