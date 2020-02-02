import React from 'react'
import HPIContext from "../../../../../contexts/HPIContext";

class ButtonTag extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const answers = this.context["hpi"][this.props.category_code][this.props.uid]["response"]
        this.state = {
            id: (answers !== null && answers.includes(this.props.name)) ? -1 :  1,
            buttonColor: (answers !== null && answers.includes(this.props.name)) ? "lightslategrey": "whitesmoke"
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let new_color
        if (this.state.id === 1) {
            new_color = "lightslategrey"
        }
        else {
            new_color = "whitesmoke"
        }
        this.setState({id: this.state.id*-1, buttonColor: new_color})
        const values = this.context["hpi"] 
        values[this.props.category_code][this.props.uid]["response"] = values[this.props.category_code][this.props.uid]["response"].concat(this.props.name)
        values[this.props.category_code][this.props.uid]["display_children"] = this.props.children 
        this.context.onContextChange("hpi", values)
        // return this.props.handler(this.props.name, this.state.id, !!this.props.children)
    }

    render() {
        return (
            <button
                className="button_question"
                style={{
                    display: !this.props.name && "none",
                    backgroundColor: this.state.buttonColor
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
                {/*<div>*/}
                {/*    <responseContext.Provider value={this.state.buttonColor}>*/}
                {/*        <DiseaseForm />*/}
                {/*    </responseContext.Provider>*/}
                {/*</div>*/}
            </button>
        )
    }

}

export default ButtonTag