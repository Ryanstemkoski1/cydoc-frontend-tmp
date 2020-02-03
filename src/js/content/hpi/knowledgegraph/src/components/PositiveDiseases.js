import React, {Component} from "react"
import "./ButtonItem"

class PositiveDiseases extends Component {
    // If you wrap <div> around the button, you can get the buttons to line up under each other.
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        return this.props.handler(this.props.name, -1)
    }

    render() {
        return (
            <button
                className="tag_text"
                style={{
                    backgroundColor: "#E6F1F6"
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default PositiveDiseases