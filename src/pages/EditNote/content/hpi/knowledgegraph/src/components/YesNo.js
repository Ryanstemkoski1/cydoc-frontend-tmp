import React from 'react'
import HPIContext from 'contexts/HPIContext.js';

class YesNo extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"]['nodes'][this.props.node]
        const answers = values["response"] 
        this.state = {
            yes_id: 0,
            no_id: 0,
            // colors of the yes and no buttons depending on whether either are clicked
            yes_color: (answers !== null && answers === "Yes") ? "lightslategrey": "whitesmoke",
            yes_font: (answers !== null && answers === "Yes") ? "white": "black",
            no_color: (answers !== null && answers === "No") ? "lightslategrey": "whitesmoke",
            no_font: (answers !== null && answers === "No") ? "white": "black"
        }
        this.handleYesClick = this.handleYesClick.bind(this)
        this.handleNoClick = this.handleNoClick.bind(this)
    }
    // eventually combine into one function.

    handleYesClick() {
        this.setState({yes_color: "lightslategrey", yes_id: 1, no_id: -1, no_color: "whitesmoke", yes_font: "white", no_font: "black"})
        const values = this.context["hpi"]
        values['nodes'][this.props.node]["response"] = "Yes"
        this.context.onContextChange("hpi", values)
    }

    handleNoClick() {
        this.setState({yes_color: "whitesmoke", yes_id: -1, no_id: 1, no_color: "lightslategrey", yes_font: "black", no_font: "white"})
        const values = this.context["hpi"]
        values['nodes'][this.props.node]["response"] = "No"
        this.context.onContextChange("hpi", values)
    }

    render() {
        return (
            <div>
                <button
                    className="button_yesno"
                    style={{
                    backgroundColor: this.state.yes_color,
                    color: this.state.yes_font
                }}
                    onClick={this.handleYesClick}
                >
                    Yes
                </button>
                <button
                    className="button_yesno"
                    style={{
                    backgroundColor: this.state.no_color,
                    color: this.state.no_font
                }}
                    onClick={this.handleNoClick}
                >
                    No
                </button>
            </div>
        )
    }

}

export default YesNo