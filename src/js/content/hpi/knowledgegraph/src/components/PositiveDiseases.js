import React, {Component} from "react"
import "./ButtonItem"

class PositiveDiseases extends Component {
    // If you wrap <div> around the button, you can get the buttons to line up under each other.
    constructor(props) {
        super(props)
        // this.handleClick = this.handleClick.bind(this)
    }

    // handleClick(value) {
    //     return this.props.handler(value, 2)
    // }

    render() {
        return (
            <button
                className="tag_text"
                style={{
                    backgroundColor: "#E6F1F6"
                }}
                // onClick={this.handleClick(this.props.name)}
            >
                {this.props.name}
            </button>
        )
    }
}

export default PositiveDiseases