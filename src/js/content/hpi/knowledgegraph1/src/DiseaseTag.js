import React from "react"
import {Button} from "semantic-ui-react";
import ToggleButton from "../../../../components/ToggleButton";

class DiseaseTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag_color: "rgba(190, 190, 190, 0.85)",
            id: 1
        };
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let new_color;
        if (this.state.id === 1) {
            new_color = "lightslategrey"
        }
        else {
            new_color = "rgba(190, 190, 190, 0.85)"
        }
        this.setState({id: this.state.id*-1, tag_color: new_color})
        return this.props.handler(this.props.name, this.state.id)
    }

    render() {
        return (
            <ToggleButton
                title={this.props.name}
                condition={this.props.name}
                size={"small"}
                onToggleButtonClick={this.handleClick}
                compact={true}
                // className="tag_text"
                style={{
                    display: !this.props.name && "none",
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </ToggleButton>
        )
    }
}

export default DiseaseTag

// function DiseaseTag(props) {
//     return(
//         <button
//             className="tag_text"
//             style={{display: !props.name && "none"}}
//         >
//             {props.name}
//         </button>
//     )
// }


// var colors = ["lightslategrey","rgba(190, 190, 190, 0.85)"];
// var i = 1;
// var selectedColor;
// function button_click() {
//     if (i<0) {
//         selectedColor = colors[i];
//     }
//     else { selectedColor = colors[0] }
//     document.getElementById("box").style.backgroundColor = selectedColor;
//     i*=-1;
// }