import React from "react"
import "./ButtonItem"
import HPIContext from "../../../../../contexts/HPIContext";

class DiseaseTag extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let values = this.context['positivediseases']
        let name_index = values.indexOf(this.props.name)
        if (name_index > -1) {
            values.splice(name_index, 1)
        }
        else {values = values.concat(this.props.name)}
        this.context.onContextChange("positivediseases", values)
        this.context.onContextChange("activeHPI", values[0])
    }

    render() {
        let color = this.context['positivediseases'].indexOf(this.props.name) > -1 ? "#E6F1F6" : "white"
        return (
            <button
                className="tag_text"
                style={{
                    display: !this.props.name && "none",
                    backgroundColor: color 
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default DiseaseTag