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
    console.log(props);
    const values = this.context["hpi"]['nodes'][this.props.node]
    const answers = values["response"]
    this.state = {
      val: 0
    }

  }

  handleVal(event){
    if(event.target.value < 0){
      this.setState({val: 0});
    }
    else if (event.target.value > 10){
      this.setState({val: 10});
    }
    else{
      this.setState({val: event.target.value});
    }
    const values = this.context["hpi"]
    values['nodes'][this.props.node]["response"] = this.state.val;
    this.context.onContextChange("hpi", values)
  }

  render(){
    return(
      <div>
      <label> Healthy </label>
      <input
        type='range'
        min={0}
        max={10}
        step={1}
        value = {this.state.num}
        onChange = {e => this.setState({val : e.target.value})}
        />
      <label> Sick </label>
      <input
        min={0}
        max={10}
        step={1}
        type = "number"
        value = {this.state.num}
        onChange = {e => this.handleNumber(e)}
      />
      </div>
  );
};

}

export default ScaleInput;
