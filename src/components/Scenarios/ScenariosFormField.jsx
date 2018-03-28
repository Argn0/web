import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import {itemList, heroList, laneRoleList} from './FormFieldData';

const autocomplete = {}
const dataSources= {
  hero_id : heroList,
  item: itemList,
  lane_role: laneRoleList,
}

function resetField(field, updateFormFields) {
    autocomplete[field].setState({searchText: ''})
    updateFormFields({[field]: null})
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
      ...this.state,
      [field]: {
      searchText,
      }
    });
  }
  componentWillMount() {
    this.props.fields.forEach(function(field) {
      if (dataSources[field]) {
        console.log("dasd")
      this.setState({...this.state, [field]: {searchText: dataSources[field].find(x=>x.value === this.props.formFieldState[field]).text}})
      }
    }, this)
  }

  render() {
    const {fields, updateFormFields , updateQueryParams, formFieldState} = this.props
    console.log(this.state)
    console.log(this)
    console.log(this.state)
    return (
        <div>
          {fields
            .map(function (field) {
              console.log(this)
              console.log(this.state)
              return (<AutoComplete
                key={field}
                openOnFocus
                dataSource={dataSources[field]}
                ref={(ref) => {
                autocomplete[field] = ref;
                return null;
              }}
              listStyle={{ maxHeight: 250, overflow: 'auto' }}
                filter={AutoComplete.fuzzyFilter}
                onNewRequest={chosenRequest => {
                  updateFormFields({[field]: chosenRequest.value}
                  )
              }}
              onUpdateInput={this.handleUpdateInput(field)}
              searchText={this.state[field] && this.state[field].searchText || null}
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