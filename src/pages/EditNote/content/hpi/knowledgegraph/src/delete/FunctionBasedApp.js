import React from 'react';
import '../css/App.css';
import TodoItem from "./TodoItem"
import diseaseData from "./Diseases";

function FunctionApp() {
    const diseaseComponents = diseaseData.map(item => <TodoItem disease_id={item.id} disease={item.name} status={false} />)
  return (
    <div className="App">
      {diseaseComponents}
    </div>
  );
}

export default FunctionApp;
