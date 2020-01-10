import React from 'react'
import "../css/App.css"

class TabButton extends React.Component {
    constructor() {
        super()
        this.state = {
            id: 1,
            buttonColor: "inherit"
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let new_color
        if (this.state.id == 1) {
            new_color = '#ccc'
        } else {
            new_color = "inherit"
        }
        this.setState({id: this.state.id * -1, tag_color: new_color})
        return this.props.tabHandler(this.props.name, this.props.index)
    }

    render() {
        return (
            <button
                className="tab"
                style={{backgroundColor: this.state.tag_color}}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default TabButton

{/*<TabButton*/}
        {/*    key = {index}*/}
        {/*    name = {disease}*/}
        {/*    index = {index}*/}
        {/*    tabHandler = {this.tabHandler}*/}
        {/*/>*/}