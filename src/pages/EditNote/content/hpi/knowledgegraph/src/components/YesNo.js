import React from 'react'
import HPIContext from 'contexts/HPIContext.js';

class YesNo extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        const answers = this.props.am_child ? values['children'][this.props.child_uid]['response'] : values["response"] 
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

    handleYesClick() {
        this.setState({yes_color: "lightslategrey", yes_id: 1, no_id: -1, no_color: "whitesmoke", yes_font: "white", no_font: "black"})
        const values = this.context["hpi"]
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = "Yes"
        else {
            values[this.props.category_code][this.props.uid]["response"] = "Yes"
            if (this.props.has_children) values[this.props.category_code][this.props.uid]["display_children"] = true
        }
        this.context.onContextChange("hpi", values)
    }

    handleNoClick() {
        this.setState({yes_color: "whitesmoke", yes_id: -1, no_id: 1, no_color: "lightslategrey", yes_font: "black", no_font: "white"})
        const values = this.context["hpi"]
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = "No"
        else { 
            values[this.props.category_code][this.props.uid]["display_children"] = false
            values[this.props.category_code][this.props.uid]["response"] = "No"
        }
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