import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Divider } from 'semantic-ui-react';
//Basic Layout and functionality for note tabs that use a grid. Includes support to
// add a row, but likely this state will be lifted in the future
export default class GridContent extends Component {
    constructor(props) {
        super(props);
        this.defaultRows = this.props.rows;
        this.onChange = this.props.onChange;
    }

    render() {
        const { contentHeader, rows, isPreview, value_type } = this.props;
        return (
            <Fragment>
                {contentHeader}
                {this.props.small ? (
                    <Divider
                        style={{
                            width: '100%',
                            margin: 'auto',
                            marginTop: '5px',
                            marginBottom: '5px',
                        }}
                    />
                ) : (
                    <Divider />
                )}
                {rows}
                {!isPreview &&
                !this.props.pop &&
                value_type !== 'Family History' ? (
                    <AddRowButton
                        onClick={this.props.addRow}
                        name={this.props.name}
                    />
                ) : (
                    ''
                )}
            </Fragment>
        );
    }
}

GridContent.propTypes = {
    contentHeader: PropTypes.any.isRequired, //Heading that goes over the divider
    numColumns: PropTypes.number.isRequired, //Number of columns in the grid
    rows: PropTypes.array.isRequired, //The rows that will comprise the body of the note. Array of Grid.Row Components.
};
