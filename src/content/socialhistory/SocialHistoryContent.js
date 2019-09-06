import React, {Fragment} from "react";
import {Divider, Grid, Header} from "semantic-ui-react";
import SocialHistoryNoteRow from "./SocialHistoryNoteRow";
import SecondarySocialHistoryNoteRow from "./SecondarySocialHistoryNoteRow";

export default class SocialHistoryContent extends React.Component {
    render() {
        return(
            <Fragment>
                <Header as="h4">
                    Substance Use
                </Header>
                <Divider/>
                <Grid columns={5}>
                    <SocialHistoryNoteRow condition="tobacco" firstField="Packs/Day" secondField="Number of Years"/>
                    <SocialHistoryNoteRow condition="alcohol" firstField="Drinks/Week"
                                          secondField="What kind of drinks?"/>
                    <SocialHistoryNoteRow condition="recreational drugs" firstField="Drug Name"
                                          secondField="Mode of Delivery"/>
                </Grid>
                <Divider/>
                <br/>
                <Grid columns={2}>
                    <SecondarySocialHistoryNoteRow label={"living situation"}/>
                    <SecondarySocialHistoryNoteRow label={"employment"}/>
                    <SecondarySocialHistoryNoteRow label={"diet"}/>
                    <SecondarySocialHistoryNoteRow label={"exercise"}/>
                </Grid>
            </Fragment>
        )
    }
}
