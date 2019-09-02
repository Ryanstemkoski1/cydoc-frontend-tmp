import React, { Component } from 'react'
import { Menu, Container} from 'semantic-ui-react'

export default class MenuTabs extends Component {
    state = { activeItem: 'Medical History' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu tabular>
                <Container>
                    <Menu.Item
                        name='HPI'
                        active={activeItem === 'HPI'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Medical History'
                        active={activeItem === 'Medical History'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='surgical history'
                        active={activeItem === 'surgical history'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Medication'
                        active={activeItem === 'Medication'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Allergies'
                        active={activeItem === 'Allergies'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Family History'
                        active={activeItem === 'Family History'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Social History'
                        active={activeItem === 'Social History'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Review of Systems'
                        active={activeItem === 'Review of Systems'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Physical Exam'
                        active={activeItem === 'Physical Exam'}
                        onClick={this.handleItemClick}
                    />
                </Container>
            </Menu>
        )
    }
}
