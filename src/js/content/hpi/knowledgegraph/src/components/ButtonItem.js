import React from "react";
import "../css/Button.css"
import DiseaseTag from "./DiseaseTag";

class ButtonItem extends React.Component {
    constructor() {
        super()
        this.state = {
            disease_array: [],
            diseases_positive: []
        }
        this.handleClick = this.handleClick.bind(this)
        this.handler = this.handler.bind(this)
    }

    handler(value, id) {
        return this.props.handler(value, id)
    }

    handleClick() {
        this.setState({disease_array: this.props.diseases_list.map(disease =>
                <DiseaseTag
                    key={disease}
                    name={disease}
                    handler = {this.handler}
                />)})
    }

    render() {
        return (
            <div className="button-item" align="left">
            <header className="rectangle_text"> {this.props.name} </header>
            <button
                className="button" onClick={this.handleClick}> &#8250; </button>
            {this.state.disease_array}
            <h1> {this.state.diseases_positive} </h1>
        </div>
        )
    }
}

export default ButtonItem