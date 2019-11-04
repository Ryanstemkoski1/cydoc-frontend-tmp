import React from 'react'

class YesNo extends React.Component {
    constructor() {
        super()
        this.state = {
            yes_id: 0,
            no_id: 0,
            yes_color: "whitesmoke",
            no_color: "whitesmoke"
        }
        this.handleYesClick = this.handleYesClick.bind(this)
        this.handleNoClick = this.handleNoClick.bind(this)
    }

    handleYesClick() {
        this.setState({yes_color: "lightslategrey", yes_id: 1, no_id: -1, no_color: "whitesmoke"})
        this.props.handler("No", -1)
        this.props.handler("Yes", 1)
    }

    handleNoClick() {
        this.setState({yes_color: "whitesmoke", yes_id: -1, no_id: 1, no_color: "lightslategrey"})
        this.props.handler("Yes",-1)
        this.props.handler("No", 1)
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