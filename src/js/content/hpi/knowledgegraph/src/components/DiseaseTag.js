import React from "react"
import "./ButtonItem"

class DiseaseTag extends React.Component {
    constructor() {
        super()
        this.state = {
            tag_color: "white",
            id: 1
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let new_color
        if (this.state.id === 1) {
            new_color = "#E6F1F6"
        }
        else {
            new_color = "white"
        }
        this.setState({id: this.state.id*-1, tag_color: new_color})
        return this.props.handler(this.props.name, this.state.id)
    }

    render() {
        return (
            <button
                className="tag_text"
                style={{
                    display: !this.props.name && "none",
                    backgroundColor: this.state.tag_color
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default DiseaseTag