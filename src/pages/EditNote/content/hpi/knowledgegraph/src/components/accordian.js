import React, {Component} from "react"
import { Accordion, Icon } from 'semantic-ui-react'
import diseaseCodes from '../../../../../../../constants/diseaseCodes'
import '../css/accordian.css';

export default class ChildAccordian extends Component {
    // accordion is collapsed by default
    state = {activeIndex: -1}

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
      const { activeIndex } = this.state 
      var childNode = this.props.childQuestions[0].props.node
      var category = Object.keys(diseaseCodes).find(key => diseaseCodes[key] === childNode.substring(0,3)) 
    return (
        <Accordion className='accordion-container'>
            <Accordion.Title 
              active={activeIndex === 0}
              index={0}
              onClick={this.handleClick}
            >
              <Icon name='dropdown' />
              Answer more questions about {category}
            </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
              {this.props.childQuestions}
              </Accordion.Content>
          </Accordion>
    )
  }
}