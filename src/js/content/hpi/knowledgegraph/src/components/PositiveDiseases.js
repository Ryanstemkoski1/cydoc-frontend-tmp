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
                backgroundColor: "lightslategrey"
            }}

        >
            {props.name}
        </button>
    )
}

export default PositiveDiseases