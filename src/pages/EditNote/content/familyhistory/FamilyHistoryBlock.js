import React, { Component, Fragment } from 'react';
import {
  Form,
  Grid,
  TextArea,
  Button,
  Header,
  Divider,
} from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';
import ToggleButton from 'components/tools/ToggleButton.js';
import FamilyHistoryDropdown from './FamilyHistoryDropdown';
import GridContent from 'components/tools/GridContent.js';
import './FamilyHistory.css';
import '../reviewofsystems/ReviewOfSystems.css';

export default class FamilyHistoryBlock extends Component {
  static contextType = HPIContext;

  constructor(props, context) {
    super(props, context);
    this.handlePlusClick = this.handlePlusClick.bind(this);
    this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handlePlusClick() {
    /*
            Allows user to add additional family member for a given condition. If the previous family member dropdown 
            was left blank, the user cannot add an additional family member (until at least the previous dropdown was filled). 
         */
    var values = this.context['Family History'];
    var members = values[this.props.index]['Family Member'];
    if (members[members.length - 1])
      values[this.props.index]['Family Member'].push('');
    this.context.onContextChange('Family History', values);
  }

  handleDelete(index, family_index) {
    var values = this.context['Family History'];
    values[index]['Family Member'].splice(family_index, 1);
    values[index]['Cause of Death'].splice(family_index, 1);
    values[index]['Comments'].splice(family_index, 1);
    values[index]['Living'].splice(family_index, 1);
    this.context.onContextChange('Family History', values);
  }

  handleToggleButtonClick(event, data) {
    let index = data.condition.props.index;
    const values = this.context['Family History'];
    const responses = ['Yes', 'No'];
    const prevState = values[index][data.title];
    values[index][data.title] = !prevState;
    for (var response_index in responses) {
      var response = responses[response_index];
      if (data.title !== response) values[index][response] = false;
    }
    this.context.onContextChange('Family History', values);
    console.log('called');
  }

  render() {
    const {
      mobile,
      condition,
      comments,
      index,
      familyMember,
      isPreview,
    } = this.props;
    // array of dropdowns displayed on Family History Family Member column
    let dropdown_list = [];
    // variable range that changes when the user clicks the + (add member) button
    // we want there to be at least one dropdown
    let range = this.context['Family History'][index]['Family Member'].length
      ? this.context['Family History'][index]['Family Member'].length
      : 1;
    for (let step = 0; step < range; step++) {
      dropdown_list.push(
        <FamilyHistoryDropdown
          key={index}
          condition={condition}
          index={index}
          family_index={step}
          mobile={mobile}
          comments={comments}
          familyMember={familyMember}
          handleDelete={this.handleDelete}
        />
      );
    }
    const new_content_header = (
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column width={1}></Grid.Column>
          <Grid.Column width={3}>
            <Header.Subheader className='family-member-header'>
              Family Member
            </Header.Subheader>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header.Subheader>Cause of Death</Header.Subheader>
          </Grid.Column>
          <Grid.Column width={9}>
            <Header.Subheader>Comments</Header.Subheader>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
    const new_row = (
      <Grid.Row>
        <Grid.Column width={16} className='dropdown-container'>
          {dropdown_list}
          <Fragment>
            <Button
              basic
              circular
              icon='plus'
              size='mini'
              onClick={this.handlePlusClick}
            />
            add family member
          </Fragment>
        </Grid.Column>
      </Grid.Row>
    );
    let handleToggle = this.handleToggleButtonClick;
    let yesActive = this.context['Family History'][condition.props.index][
      'Yes'
    ];
    let noActive = this.context['Family History'][condition.props.index]['No'];
    if (isPreview) {
      handleToggle = () => {};
      yesActive = false;
      noActive = false;
    }
    return mobile ? (
      <Grid.Row>
        <Form className='family-hx-note-item'>
          <Form.Group inline className='condition-header'>
            <div className='condition-name'>{condition}</div>
            <div>
              <ToggleButton
                active={yesActive}
                condition={condition}
                title='Yes'
                onToggleButtonClick={handleToggle}
              />
              <ToggleButton
                active={noActive}
                condition={condition}
                title='No'
                onToggleButtonClick={handleToggle}
              />
            </div>
          </Form.Group>
          <div className='condition-info'>
            {this.context['Family History'][condition.props.index]['Yes'] ? (
              <Fragment>
                {dropdown_list}
                <Fragment>
                  <Button
                    basic
                    circular
                    icon='plus'
                    size='mini'
                    onClick={this.handlePlusClick}
                  />
                  add family member
                </Fragment>
              </Fragment>
            ) : (
              ''
            )}
          </div>
        </Form>
      </Grid.Row>
    ) : (
      <div>
        {condition}
        <ToggleButton
          active={yesActive}
          condition={condition}
          title='Yes'
          onToggleButtonClick={handleToggle}
        />
        <ToggleButton
          active={noActive}
          condition={condition}
          title='No'
          onToggleButtonClick={handleToggle}
        />

        <div className='condition-info-container'>
          {this.context['Family History'][condition.props.index]['Yes'] ? (
            <Fragment>
              <GridContent
                numColumns={2}
                contentHeader={new_content_header}
                rows={new_row}
                value_type='Family History'
                small={true}
              />
            </Fragment>
          ) : (
            ''
          )}
          <Divider className='divider-style' />
        </div>
      </div>
    );
  }
}
