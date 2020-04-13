import React, {Component} from 'react'
import { Table} from 'semantic-ui-react'
import LungSoundsButtons from './LungSoundsButtons'

export default class LungSounds extends Component {

    render = () => {
        var lung_map = []
        const lung_lobes = ["Left Upper Lobe", "Right Upper Lobe", "Lingula", "Right Middle Lobe", "Left Lower Lobe", "Right Lower Lobe"]
        for (var lung_index = 0; lung_index < lung_lobes.length/2; lung_index ++) {
            lung_map.push(
                <Table.Row key={lung_lobes[2*lung_index]}>
                    <Table.Cell> {lung_lobes[2*lung_index]}  
                        <LungSoundsButtons key={lung_lobes[2*lung_index]} lung_lobe={lung_lobes[2*lung_index]}/> 
                    </Table.Cell>
                    <Table.Cell> {lung_lobes[2*lung_index+1]}  
                        <LungSoundsButtons key={lung_lobes[2*lung_index+1]} lung_lobe={lung_lobes[2*lung_index+1]}/> 
                    </Table.Cell>
                </Table.Row>
            )
        }
        return (
            <Table celled>
              <Table.Body>
                {lung_map}
              </Table.Body>
              </Table>
              )
        }
    }
