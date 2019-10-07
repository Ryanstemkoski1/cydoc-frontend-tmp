import React, {Fragment} from "react";
// import "./Button.css"
import DiseaseTag from "./DiseaseTag";
import {Button, Icon, Label} from "semantic-ui-react";

class ButtonItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disease_array: [],
            diseases_positive: []
        };
        this.handleClick = this.handleClick.bind(this);
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
            <Fragment>
                <Button
                    as='div'
                    labelPosition='left'
                    onClick={this.handleClick}>
                    <Label as='a' basic>
                        {this.props.name}
                    </Label>
                    <Button icon>
                        <Icon name='angle right' />
                    </Button>
                </Button>

                {this.state.disease_array}

                <h1> {this.state.diseases_positive} </h1>
        </Fragment>
        )
    }
}

export default ButtonItem