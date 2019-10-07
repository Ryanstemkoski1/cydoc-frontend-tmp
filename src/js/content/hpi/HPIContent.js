import React, {Component} from 'react';
// import './App.css';
import ButtonItem from "./knowledgegraph1/src/ButtonItem"
import diseaseData from "./knowledgegraph1/src/Diseases";
import PositiveDiseases from "./knowledgegraph1/src/PositiveDiseases";
import {Grid} from "semantic-ui-react";

class HPIContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diseaseArray: diseaseData,
            diseases_positive: []
        };
        this.handler = this.handler.bind(this)
    }

    handler(value, id) {
        let new_array = this.state.diseases_positive;
        if (id === 1) {
            new_array = new_array.concat(value)
        }
        else if (id===-1) {
            new_array.splice(new_array.indexOf(value), 1)
        }
        this.setState({diseases_positive: new_array})
    }

    render() {
        const diseaseComponents = this.createDiseaseComponents();
        const positiveDiseases = this.createPositiveDiseases();
        return (
                <Grid columns={1}>
                    <Grid.Column>
                        <Grid.Row>
                            <div> {positiveDiseases} </div>
                        </Grid.Row>
                            {diseaseComponents}
                    </Grid.Column>
                </Grid>
        )
    }

    createPositiveDiseases() {
        return this.state.diseases_positive.map(disease =>
            <PositiveDiseases
                key={disease}
                name={disease}
            />
        );
    }

    createDiseaseComponents() {
        return this.state.diseaseArray.map(item =>
            <Grid.Row>
                <ButtonItem
                    key={item.id}
                    disease_id={item.id}
                    name={item.name}
                    diseases_list={item.diseases}
                    handler={this.handler}
                />
            </Grid.Row>
        );
    }
}

export default HPIContent;