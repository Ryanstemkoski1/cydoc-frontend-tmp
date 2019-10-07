import React from "react"
import {Button} from "semantic-ui-react";

function PositiveDiseases(props) {
    return (
        <Button
            // className="tag_text"
            color={'violet'}
            size={"small"}
        >
            {props.name}
        </Button>
    )
}

export default PositiveDiseases