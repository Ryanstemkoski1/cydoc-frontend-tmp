import React, {Component} from 'react';
import '../css/App.css';
import TodoItem from "./TodoItem"
import diseaseData from "./Diseases";

class ToDoApp extends Component {
    constructor() {
        super()
        this.state = {
            diseaseArray: diseaseData
        }
    }
    render() {
        const diseaseComponents = this.state.diseaseArray.map(item => <TodoItem disease_id={item.id} disease={item.name} status={false} />)
        return (
        <div className="App">
            {diseaseComponents}
        </div>
        )
    }
}

export default ToDoApp;
