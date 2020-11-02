import React from 'react'
import HPIContext from 'contexts/HPIContext.js';

class ButtonTag extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"]['nodes'][this.props.node]
        const answers = values["response"]
        this.state = {
            id: (answers !== null && answers.includes(this.props.name)) ? -1 :  1,
            buttonColor: (answers !== null && answers.includes(this.props.name)) ? "lightslategrey": "whitesmoke",
            fontColor: (answers !== null && answers.includes(this.props.name)) ? "white": "black",
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let newColor
        let fontColor
        if (this.state.id === 1) {
            newColor = "lightslategrey"
            fontColor = "white"
        }
        else {
            newColor = "whitesmoke"
            fontColor = "black"
        }
        this.setState({id: this.state.id*-1, buttonColor: newColor, fontColor: fontColor})
        const values = this.context["hpi"] 
        values['nodes'][this.props.node]["response"] = values['nodes'][this.props.node]["response"].concat(this.props.name)
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