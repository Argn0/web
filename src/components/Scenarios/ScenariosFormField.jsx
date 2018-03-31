import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import {itemList, heroList, laneRoleList, miscList} from './FormFieldData';

const autoCompleteRefs = {}
const dataSources= {
  hero_id : heroList,
  item: itemList,
  lane_role: laneRoleList,
  scenario: miscList,
}

const hintText = {
  hero_id : 'Hero ID',
  item: 'Item',
  scenario: 'Scenario',
  lane_role: 'Lane Role',
}


class ScenarioFormField extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    }
    this.resetField = this.resetField.bind(this)
    this.handleUpdateInput = this.handleUpdateInput.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  resetField() {
    this.setState({searchText: ''})
  }

  handleUpdateInput(searchText) {
    this.setState({searchText})
  }

  handleRequest(chosenRequest) {
    const {updateFormFieldState, field} = this.props
    updateFormFieldState({[field]: chosenRequest.value})
  }

  render() {
    const { field, dropDownValue} = this.props
    const {searchText} = this.state
    console.log(this)
    return (
      <div>
      <AutoComplete
      openOnFocus
      listStyle={{ maxHeight: 400, overflow: 'auto' }}
      filter={AutoComplete.caseInsensitiveFilter}
      floatingLabelText={"label"}
      dataSource={dataSources[field]}
      onClick={this.resetField}
      onUpdateInput={this.handleUpdateInput}
      searchText={searchText}
      onNewRequest={this.handleRequest}
    />
    </div>
      )
    }
}



export default ScenarioFormField;