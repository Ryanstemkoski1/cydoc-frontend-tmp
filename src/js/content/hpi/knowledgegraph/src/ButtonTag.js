import React from 'react'

class ButtonTag extends React.Component {
    constructor() {
        super()
        this.state = {
            id: 1,
            buttonColor: "whitesmoke"
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
        this.setState({id: this.state.id*-1, tag_color: new_color})
        return this.props.handler(this.props.name, this.state.id)
    }

    render() {
        return (
            <button
                className="button_question"
                style={{
                    display: !this.props.name && "none",
                    backgroundColor: this.state.tag_color
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }

}

export default ButtonTag