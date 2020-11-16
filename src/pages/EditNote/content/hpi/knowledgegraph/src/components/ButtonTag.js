import React from 'react'
import HPIContext from 'contexts/HPIContext.js';

class ButtonTag extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        const answers = this.props.am_child ? values['children'][this.props.child_uid]['response'] : values["response"]
        this.state = {
            id: (answers !== null && answers.includes(this.props.name)) ? -1 :  1,
            buttonColor: (answers !== null && answers.includes(this.props.name)) ? "lightslategrey": "whitesmoke",
            fontColor: (answers !== null && answers.includes(this.props.name)) ? "white": "black",
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let new_color
        let font_color
        if (this.state.id === 1) {
            new_color = "lightslategrey"
            font_color = "white"
        }
        else {
            new_color = "whitesmoke"
            font_color = "black"
        }
        this.setState({id: this.state.id*-1, buttonColor: new_color, fontColor: font_color})
        const values = this.context["hpi"] 
        if (this.props.am_child) {
            values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = 
            values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'].concat(this.props.name) 
        }
        else {
            values[this.props.category_code][this.props.uid]["response"] = values[this.props.category_code][this.props.uid]["response"].concat(this.props.name)
            values[this.props.category_code][this.props.uid]["display_children"] = this.props.children 
        }
        this.context.onContextChange("hpi", values) 
    }

    render() {
        return (
            <button
                className="button_question"
                style={{
                    display: !this.props.name && "none",
                    backgroundColor: this.state.buttonColor,
                    color: this.state.fontColor
                }}
                onClick={this.handleClick}
            >
                {this.props.name} 
            </button>
        )
    }

}

export default ButtonTag