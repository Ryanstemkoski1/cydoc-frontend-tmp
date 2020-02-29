import React, {Component} from "react"
import "./ButtonItem"
import HPIContext from "../../../../../contexts/HPIContext";

class PositiveDiseases extends Component {
    // If you wrap <div> around the button, you can get the buttons to line up under each other.
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.handleClick = this.handleClick.bind(this) 
    }

    handleClick() {
        let values = this.context['positivediseases']
        if (values.indexOf(this.props.name) > -1) {
            values.splice(values.indexOf(this.props.name), 1)
        }
        this.context.onContextChange("positivediseases", values)
    }

    render() {
        return (
            <button
                className="tag_text"
                style={{
                    backgroundColor: "lightslategrey",
                    color: "white"
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default PositiveDiseases