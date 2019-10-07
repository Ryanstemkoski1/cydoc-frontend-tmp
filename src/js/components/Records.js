import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import { getAllRecords } from "../actions/index";
import {Accordion, Header, Icon, Segment} from "semantic-ui-react";

class ConnectedRecords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: ''
        }
    }

    handleClick = (e, titleProps) => {
        console.log(titleProps)
        const { id: id } = titleProps;
        const { activeId: activeId } = this.state;
        const newIndex = activeId === id ? "" : id;

        this.setState({ activeId: newIndex })
    };

    componentDidMount() {
        this.props.getData();
    }
    render() {
        const { activeId } = this.state;
        return (
            <Fragment>
                {this.props.articles.map(record => (
                    <Segment key={record._id}>
                        <Accordion>
                            <Accordion.Title
                                active={activeId === record._id}
                                id={record._id}
                                onClick={this.handleClick}
                            >
                                {record.noteName}
                                <Icon name='dropdown' />
                            </Accordion.Title>
                            <Accordion.Content active={activeId === record._id}>
                                <Header as={"h3"}>
                                     <pre>{JSON.stringify(record.body, null, 2) }</pre>
                                </Header>
                            </Accordion.Content>
                        </Accordion>
                    </Segment>

                ))}
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        articles: state.remoteRecords.slice(0, 10)
    };
}
const Records = connect(
    mapStateToProps,
    { getData: getAllRecords }
)(ConnectedRecords);

export default Records;