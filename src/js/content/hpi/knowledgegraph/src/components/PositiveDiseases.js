import React from "react"
import "./ButtonItem"

function PositiveDiseases(props) {
    // If you wrap <div> around the button, you can get the buttons to line up under each other.

    function handleClick() {
        return props.positiveHandler(props.name, false)
    }

    return (
        <button
            className="tag_text"
            style={{
                backgroundColor: "#E6F1F6"
            }}

        >
            {props.name}
        </button>
    )
}

export default PositiveDiseases