import React, {Component} from 'react'
import { Table} from 'semantic-ui-react'
import AbdomenExamButtons from './AbdomenExamButtons'
import HPIContext from '../../../contexts/HPIContext'

export default class AbdomenExam extends Component {

    static contextType = HPIContext 

    render = () => {
        var ab_map = []
        const ab_quadrants = Object.keys(this.context["Physical Exam"].widgets["Abdomen"])
        for (var ab_index = 0; ab_index < ab_quadrants.length/2; ab_index ++) {
            ab_map.push(
                <Table.Row key={ab_quadrants[2*ab_index]}>
                    <Table.Cell> <div style={{marginBottom: 5}}> {ab_quadrants[2*ab_index]} </div>
                        <AbdomenExamButtons key={ab_quadrants[2*ab_index]} ab_quadrant={ab_quadrants[2*ab_index]}/> 
                    </Table.Cell>
                    <Table.Cell> <div style={{marginBottom: 5}}> {ab_quadrants[2*ab_index+1]}  </div>
                        <AbdomenExamButtons key={ab_quadrants[2*ab_index+1]} ab_quadrant={ab_quadrants[2*ab_index+1]}/> 
                    </Table.Cell>
                </Table.Row>
            )
        }
        return (
            <Table celled collapsing>
              <Table.Body>
                {ab_map}
              </Table.Body>
              </Table>
              )
        }
    }
