import React, { Component, Fragment } from 'react';
import GridContent from 'components/tools/GridContent.js';
import FamilyHistoryContentHeader from './FamilyHistoryContentHeader';
import HPIContext from 'contexts/HPIContext.js';
import ConditionInput from 'components/tools/ConditionInput.js';
import { FAMILY_HISTORY_MOBILE_BP } from 'constants/breakpoints.js';
import FamilyHistoryBlock from './FamilyHistoryBlock';
import AddRowButton from 'components/tools/AddRowButton.js';

//TODO: finish the styling for this page
//Component that manages the layout for the Family History page.
export default class FamilyHistoryContent extends Component {
  static contextType = HPIContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
    this.addRow = this.addRow.bind(this);
    this.addSeenCond = this.addSeenCond.bind(this);

    //Checks if all response choices exist and adds new ones
    const { response_choice, isPreview } = this.props;
    if (!isPreview) {
      const values = this.context['Family History'];
      var conditions = [];
      // Creates list of conditions present in Family History
      for (var value in values) {
        conditions.push(values[value]['Condition'].toLowerCase());
      }
      for (var response_index in response_choice) {
        var response = response_choice[response_index];
        var condition_index = conditions.indexOf(response.toLowerCase());
        if (condition_index === -1) {
          var index = Object.keys(values).length.toString();
          values[index] = {
            Condition: response,
            Yes: false,
            No: false,
            'Family Member': [],
            'Cause of Death': [],
            Living: [],
            Comments: [],
          };
        }
      }
      this.state = {
        seenConditions: conditions,
      };
      this.context.onContextChange('Family History', values);
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    let windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

    this.setState({ windowWidth, windowHeight });
  }

  //handles input field events
  handleChange(event, data) {
    let index = data.condition.props.index;
    console.log(this.context['Family History']);
    const values = this.context['Family History'];
    values[index][data.placeholder] = data.value;
    this.context.onContextChange('Family History', values);
  }

  //handles toggle button events
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
  }

  addRow() {
    let values = this.context['Family History'];
    let last_index = Object.keys(values).length.toString();
    console.log('last_index', last_index);
    values[last_index] = {
      Condition: '',
      Yes: false,
      No: false,
      'Family Member': [],
      'Cause of Death': [],
      Living: [],
      Comments: [],
    };
    this.context.onContextChange('Family History', values);
  }

  addSeenCond = (value, index) => {
    const seenConditions = this.state.seenConditions;
    seenConditions[value] = index;
    this.setState({ seenConditions });
  };

  render() {
    const { windowWidth } = this.state;
    const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
    //Create collection of rows
    // Use second OR statement so that the information may be auto-populated in the Family History tab
    var list_values =
      this.props.values ||
      this.props.response_choice ||
      Object.keys(this.context['Family History']);
    var conditions = Object.keys(this.context['Family History']).map(
      (value) => this.context['Family History'][value]['Condition']
    );
    var index_dict = {};
    if (this.props.response_choice) {
      for (var condition_index in list_values) {
        var condition = list_values[condition_index];
        index_dict[condition] = conditions.indexOf(condition);
      }
    }
    const listItems = list_values.map((condition, index) => {
      if (this.props.isPreview) {
        return (
          <FamilyHistoryBlock
            isPreview={this.props.isPreview}
            key={index}
            mobile={mobile}
            onChange={() => {}}
            condition={
              <ConditionInput
                seenConditions={conditions}
                addSeenCondition={this.addSeenCond}
                isPreview={this.props.isPreview}
                condition={condition}
                seenCondition={conditions}
                key={index}
                index={index}
                category={'Family History'}
              />
            }
            familyMember=''
            comments=''
            index={index}
          />
        );
      } else {
        return (
          <FamilyHistoryBlock
            key={condition}
            mobile={mobile}
            onChange={this.handleChange}
            condition={
              <ConditionInput
                seenConditions={conditions}
                addSeenCondition={this.addSeenCond}
                key={condition}
                seenConditions={conditions}
                index={
                  Object.keys(index_dict).length > 0
                    ? index_dict[condition]
                    : index
                }
                category={'Family History'}
              />
            }
            familyMember={
              this.context['Family History'][
                Object.keys(index_dict).length > 0
                  ? index_dict[condition]
                  : index
              ]['Family Member']
            }
            comments={
              this.context['Family History'][
                Object.keys(index_dict).length > 0
                  ? index_dict[condition]
                  : index
              ]['Comments']
            }
            index={
              Object.keys(index_dict).length > 0 ? index_dict[condition] : index
            }
          />
        );
      }
    });

    return mobile ? (
      <>
        <GridContent
          isPreview={this.props.isPreview}
          numColumns={4}
          contentHeader={<FamilyHistoryContentHeader />}
          rows={listItems}
          question_type={this.props.response_choice ? 'hpi' : 'add_row'}
          value_type='Family History'
          conditions={list_values}
          mobile={mobile}
          addRow={this.addRow}
          name={'family history'}
        />
      </>
    ) : (
      <>
        <div style={{ marginTop: 25 }}> </div>
        {listItems}
      </>
    );
  }
}
