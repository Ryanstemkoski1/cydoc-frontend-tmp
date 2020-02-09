import React, { Component } from 'react'
import "../css/App.css"

export default class tabBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            font_weight: "",
            border_bottom: ""
        }
           
    }

    handleClick() {
        this.setState({font_weight: "bold", border_bottom: '3px solid mediumblue'})
    }

    render() {
        return (
            <button
                key={index}
                className="tab"
                onClick={this.handleClick}
                style={{fontWeight: this.state.font_weight, borderBottom: this.state.border_bottom}}
            >    
                {this.props.disease}
            </button>
        )
    }
}