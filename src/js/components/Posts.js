import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import { getData } from "../actions/index";
import {Header, Segment} from "semantic-ui-react";
class Posts extends Component {
    componentDidMount() {
        this.props.getData();
    }
    render() {
        return (
            <Fragment>
                {this.props.articles.map(el => (
                    <Segment>
                        <Header key={el.id}>
                            {el.title}
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
    { getData }
)(Posts);

export default Post;