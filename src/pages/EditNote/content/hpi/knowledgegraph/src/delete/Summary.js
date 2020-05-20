import React from 'react';
import { Button } from 'semantic-ui-react';

function Summary(props) {
    const {hpi, back} = props
    var array = []
    for (var key in hpi) {
        var qa_array = []
        var category_name = ""
        for (var uid in hpi[key]) {
            category_name = hpi[key][uid]['category_name']
            let question = hpi[key][uid]['question']
            question = question.split(":")[0].concat(" - ")
            var response_string = ""
            for (var ans_index in hpi[key][uid]['response']) {
                var current_response = hpi[key][uid]['response'][ans_index]
                if (current_response === 'date-time') {
                    var date = (hpi[key][uid]['response'][1].toString()).slice(0, -40)
                    response_string += date
                    break
                }
                else response_string += (current_response + ", ")
            }
            response_string = response_string.substring(0, response_string.length-2)
            qa_array.push(<div> {question} <b> {response_string} </b> </div>)
        }
        array.push(
            <div key={key}>
                <h2 style={{marginTop: 35, textAlign: 'center'}}> {category_name} </h2>
                <div> {
                    qa_array.map((item, i) =>
                        <div key={i} style={{marginTop: 23, marginLeft: 70, marginRight: 70}}>
                            {item}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
            <div>
                <h1 style={{textAlign: 'center', marginTop: 23}}> Summary </h1>
                <div> {array} </div>
                <Button
                    circular
                    icon='angle double right'
                    className='next-button'
                    onClick={back}
                />
            </div>
        )
}

export default Summary


