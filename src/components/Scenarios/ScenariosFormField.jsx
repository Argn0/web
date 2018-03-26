import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import {itemList, heroList} from './FormFieldData';

const autocomplete = {}
const dataSources= {
  hero_id : heroList,
  item: itemList,
  lane_role: [{text: '1', value: 1}, {text: '2', value: 2}, {text:'3', value: 3}]
}

function resetField(field, resetState) {
    autocomplete[field].setState({searchText: ''})
    resetState()
  }



const ScenarioFormField = ({fields, updateFormFields , updateQueryParams}) => {
  console.log(itemList)
    return (
        <div>
          {fields
            .map(function (field) {
              return (<AutoComplete
                key={field}
                openOnFocus
                dataSource={dataSources[field]}
                ref={(ref) => {
                autocomplete[field] = ref;
                return null;
              }}
                filter={AutoComplete.fuzzyFilter}
                onNewRequest={chosenRequest => {
                  updateFormFields({[field]: chosenRequest.value}
                  )
              }}
                onClick={() =>  resetField(field, () =>  updateFormFields({[field]: null}))   }  
                onClose={updateQueryParams}
                />)
            })
  }
        </div>
      )

}



export default ScenarioFormField;