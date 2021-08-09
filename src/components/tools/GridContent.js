import { Divider, Grid } from 'semantic-ui-react';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AddRowButton from 'components/tools/AddRowButton';

//Basic Layout and functionality for note tabs that use a grid. Includes support to
// add a row, but likely this state will be lifted in the future
export default class GridContent extends Component {
    constructor(props) {
        super(props);
        this.defaultRows = this.props.rows;
        this.onChange = this.props.onChange;
    }

    render() {
        const {
            numColumns,
            contentHeader,
            rows,
            mobile,
            isPreview,
            value_type,
        } = this.props;
        return mobile ? (
            <Fragment>
                <br />
                <Grid columns={1} verticalAlign='middle' divided='vertically'>
                    {rows}
                </Grid>
                <Divider />
                {!isPreview && !this.props.pop ? (
                    <AddRowButton
                        onClick={this.props.addRow}
                        name={this.props.name}
                    />
                ) : (
                    ''
                )}
            </Fragment>
        ) : (
            <Fragment>
                <br />
                {contentHeader}
                {this.props.small ? (
                    <Divider
                        style={{
                            width: '90%',
                            margin: 'auto',
                            marginTop: '5px',
                            marginBottom: '5px',
                        }}
                    />
                ) : (
                    <Divider />
                )}
                <Grid columns={numColumns} verticalAlign='middle'>
                    {rows}
                </Grid>
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
