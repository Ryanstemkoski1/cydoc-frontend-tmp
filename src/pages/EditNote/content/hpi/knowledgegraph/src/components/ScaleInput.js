import React from 'react';
import HPIContext from 'contexts/HPIContext.js';

/*
TODO:
Make custom labels besides healthy and sick
Can that be passed down from props?

The props are key and pop

*/
class ScaleInput extends React.Component{
  static contextType = HPIContext
  constructor(props, context) {
    super(props, context)
    const values = this.context["hpi"]['nodes'][this.props.node]
    const answers = values["response"]
    this.state = {
      val: 0
    }

  }

  handleVal(event){
    /*if(event.target.value < 1){
      this.setState({val: 1});
    }
    else if (event.target.value > 10){
      this.setState({val: 10});
    }
    else{
      this.setState({val: event.target.value});
    }*/
    const values = this.context["hpi"]
    values['nodes'][this.props.node]["response"] = this.state.val;
    this.context.onContextChange("hpi", values)
    console.log(this.context.hpi)
  }

  handleClear(e){
    e.preventDefault();
    this.setState()
  }

  render(){
    return(
      <div>
      <label> 1 </label>
      <input
        type='range'
        min="1"
        max="10"
        step="1"
        value = {this.state.val}
        onChange = {e => this.setState({val: e.target.value}, e => this.handleVal(e))}
        />
      <label> 10 </label>
      <input
        min="1"
        max="10"
        step="1"
        type = "number"
        value = {this.state.val}
        onChange = {e => this.setState({val: e.target.value}, e => this.handleVal(e))}
      />
      <button
        className = "ui basic button"
        onSubmit = {e => this.handleClear(e)}>
        Clear
      </button>
      </div>
  );
};

}

export default ScaleInput;
