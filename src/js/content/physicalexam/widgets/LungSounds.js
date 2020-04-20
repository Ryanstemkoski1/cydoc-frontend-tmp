import React, {Component} from 'react'
import { Table} from 'semantic-ui-react'
import LungSoundsButtons from './LungSoundsButtons'
import HPIContext from '../../../contexts/HPIContext'

export default class LungSounds extends Component {

    static contextType = HPIContext 

    render = () => {
        var lung_map = []
        const lung_lobes = Object.keys(this.context["Physical Exam"]["Lungs"])
        for (var lung_index = 0; lung_index < lung_lobes.length/2; lung_index ++) {
            lung_map.push(
                <Table.Row key={lung_lobes[2*lung_index]}>
                    <Table.Cell verticalAlign='top'> <div style={{marginBottom: 5}}> {lung_lobes[2*lung_index]} </div>
                        <LungSoundsButtons key={lung_lobes[2*lung_index]} lung_lobe={lung_lobes[2*lung_index]}/> 
                    </Table.Cell>
                    <Table.Cell verticalAlign='top'> <div style={{marginBottom: 5}}> {lung_lobes[2*lung_index+1]} </div> 
                        <LungSoundsButtons key={lung_lobes[2*lung_index+1]} lung_lobe={lung_lobes[2*lung_index+1]} position={'top right'}/> 
                    </Table.Cell>
                </Table.Row>
            )
        }
        return (
            <Table celled fixed>
              <Table.Body>
                {lung_map}
              </Table.Body>
              </Table>
              )
        }
    }
