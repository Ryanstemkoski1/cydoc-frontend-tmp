import React from 'react'
import HPIContext from "../../../../../contexts/HPIContext";

class YesNo extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const answers = this.context["hpi"][this.props.category_code][this.props.uid]["response"]
        this.state = {
            yes_id: 0,
            no_id: 0,
            yes_color: (answers !== null && answers[0] === "Yes") ? "lightslategrey": "whitesmoke",
            no_color: (answers !== null && answers[0] === "No") ? "lightslategrey": "whitesmoke",
            children: false
        }
        this.handleYesClick = this.handleYesClick.bind(this)
        this.handleNoClick = this.handleNoClick.bind(this)
    }

    handleYesClick() {
        this.setState({yes_color: "lightslategrey", yes_id: 1, no_id: -1, no_color: "whitesmoke"})
        // this.props.handler("No", -1)
        // this.props.handler("Yes", 1, !!this.props.children)
        const values = this.context["hpi"]
        values[this.props.category_code][this.props.uid]["response"] = "Yes"
        values[this.props.category_code][this.props.uid]["display_children"] = this.props.children 
        this.context.onContextChange("hpi", values)
    }

    handleNoClick() {
        this.setState({yes_color: "whitesmoke", yes_id: -1, no_id: 1, no_color: "lightslategrey"})
        // this.props.handler("Yes",-1)
        // this.props.handler("No", 1)
        const values = this.context["hpi"]
        values[this.props.category_code][this.props.uid]["display_children"] = false
        values[this.props.category_code][this.props.uid]["response"] = "No"
        this.context.onContextChange("hpi", values)
    }

    render() {
        return (
            <div>
                <button
                    className="button_yesno"
                    style={{
                    backgroundColor: this.state.yes_color
                }}
                    onClick={this.handleYesClick}
                >
                    Yes
                </button>
                <button
                    className="button_yesno"
                    style={{
                    backgroundColor: this.state.no_color
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