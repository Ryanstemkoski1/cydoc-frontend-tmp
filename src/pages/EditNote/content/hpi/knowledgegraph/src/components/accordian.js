import React, {Component} from "react";
import { Accordion, Icon } from 'semantic-ui-react';
import '../css/accordian.css';

export default class Accordian extends Component {
    // accordion is collapsed by default
  state = { activeIndex: -1 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
      const { activeIndex } = this.state
      const { current_children } = this.props
      let child_questions = []
      for (var child_node in current_children) {
          let child_question = current_children[child_node]['question']
          child_questions.push(child_question)
        } 
    return (
        <Accordion className='accordion-container'>
            <Accordion.Title 
              active={activeIndex === 0}
              index={0}
              onClick={this.handleClick}
            >
              <Icon name='dropdown' />
              Answer more questions about {this.props.category}
            </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
              {child_questions}
              </Accordion.Content>
          </Accordion>
    )
  }
}