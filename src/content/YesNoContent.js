import {Divider, Grid, Header} from "semantic-ui-react";
import React, {Component, Fragment} from 'react';

export default class YesNoContent extends Component {
    render(){
        return(
            <Fragment>
                <br/>
                {this.props.contentHeader}
                <Divider/>
                <Grid columns={this.props.numColumns} verticalAlign='middle' >
                    {this.props.listItems}
                    {this.props.customNoteRow}
                </Grid>
            </Fragment>
        );
    }
}

