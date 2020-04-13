import React, {Component} from 'react'
import { Table} from 'semantic-ui-react'
import AbdomenExamButtons from './AbdomenExamButtons'

export default class AbdomenExam extends Component {

    render = () => {
        var ab_map = []
        const ab_quadrants = ["Right Upper Quadrant", "Left Upper Quadrant", "Right Lower Quadrant", "Left Lower Quadrant"]
        for (var ab_index = 0; ab_index < ab_lobes.length/2; ab_index ++) {
            ab_map.push(
                <Table.Row key={ab_quadrants[2*ab_index]}>
                    <Table.Cell> {ab_quadrants[2*ab_index]}  
                        <AbdomenExamButtons key={ab_quadrants[2*ab_index]} lung_lobe={ab_quadrants[2*ab_index]}/> 
                    </Table.Cell>
                    <Table.Cell> {ab_quadrants[2*ab_index+1]}  
                        <AbdomenExamButtons key={ab_quadrants[2*ab_index+1]} lung_lobe={ab_quadrants[2*ab_index+1]}/> 
                    </Table.Cell>
                </Table.Row>
            )
        }
        return (
            <Table celled>
              <Table.Body>
                {ab_map}
              </Table.Body>
              </Table>
              )
        }
    }
