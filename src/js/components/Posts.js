import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import { getAllRecords } from "../actions/index";
import {Header, Segment} from "semantic-ui-react";
class Posts extends Component {
    componentDidMount() {
        this.props.getData();
    }
    render() {
        return (
            <Fragment>
                {this.props.articles.map(record => (
                    <Segment>
                        <Header key={record._id}>
                            {record.noteName}
                        </Header>
                        <Header as={"h3"}>
                            <pre>{JSON.stringify(record.body, null, 2) }</pre>
                        </Header>
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
const Post = connect(
    mapStateToProps,
    { getData: getAllRecords }
)(Posts);

export default Post;