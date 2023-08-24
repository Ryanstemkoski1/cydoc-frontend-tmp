import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import NavMenu from '../../components/navigation/NavMenu';
import NotesContext from '../../contexts/NotesContext';
import Records from './Records';
import VerticalMenu from './VerticalMenu';

//Component that manages the layout of the dashboard page
export default class LandingPageOld extends Component {
    static contextType = NotesContext;

    constructor(props) {
        super(props);
        this.state = {
            activeNote: null,
        };
    }

    setActive = (note) => {
        this.setState({ activeNote: note });
    };

    componentDidMount = () => {
        this.context.loadNotes();
    };

    render() {
        return (
            <>
                <div>
                    <NavMenu className='landing-page-nav-menu' />
                </div>
                {
                    <Grid columns={2}>
                        <Grid.Column width={4} style={{ minWidth: '340px' }}>
                            <VerticalMenu setActive={this.setActive} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment basic padded>
                                <Records
                                    activeNote={this.state.activeNote}
                                    setActive={this.setActive}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid>
                }
            </>
        );
    }
}
