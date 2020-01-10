import React from 'react'
import responseContext from "../contexts/responseContext";
import DiseaseForm from "../delete/originalDiseaseForm";

class ButtonTag extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: (this.props.answers !== null && this.props.answers.includes(this.props.name)) ? -1 :  1,
            buttonColor: (this.props.answers !== null && this.props.answers.includes(this.props.name)) ? "lightslategrey": "whitesmoke"
        }
        this.handleClick = this.handleClick.bind(this)
    }

    // Link contextType to class component ButtonTag
    // static contextType = responseContext

    handleClick() {
        let new_color
        if (this.state.id === 1) {
            new_color = "lightslategrey"
        }
        else {
            new_color = "whitesmoke"
        }
        this.setState({id: this.state.id*-1, buttonColor: new_color})

        return this.props.handler(this.props.name, this.state.id, !!this.props.children)
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