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

function resetField(field, updateFormFields) {
  autoCompleteRefs[field].setState({searchText: ''}, updateFormFields({[field]: ''}))
  }

function setDefaultText(field, formFieldState) {
  if (formFieldState[field]) {
    return dataSources[field].find(x=>x.value === formFieldState[field]).text
  }
  return ''
}

class ScenarioFormField extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleUpdateInput(field) {
    return (searchText) =>
    this.setState({
      [field]: {
      searchText,
      }
    });
  }
  componentWillMount() {
    this.props.fields.forEach(function(field) {
      if (dataSources[field] && dataSources[field].find(x=>x.value === this.props.formFieldState[field])) {
      this.setState({[field]: {searchText: dataSources[field].find(x=>x.value === this.props.formFieldState[field]).text}})
      }
    }, this)
  }

  render() {
    const {fields, updateFormFields , updateQueryParams, formFieldState} = this.props
    return (
        <div>
          {fields
            .map(function (field) {
              return (<AutoComplete
                key={field}
                hintText={hintText[field]}
                openOnFocus
                dataSource={dataSources[field]}
                ref={(ref) => {
                  autoCompleteRefs[field] = ref;
                return null;
              }}
              listStyle={{ maxHeight: 250, overflow: 'auto' }}
                filter={AutoComplete.fuzzyFilter}
                onNewRequest={chosenRequest => {
                  updateFormFields({[field]: chosenRequest.value}
                  )
              }}
              onUpdateInput={this.handleUpdateInput(field)}
              searchText={this.state[field] && this.state[field].searchText || ''}
                onClick={() =>  resetField(field, updateFormFields)   }  
                onClose={updateQueryParams}
                />)
            }, this)
  }
        </div>
      )
    }
}



export default ScenarioFormField;