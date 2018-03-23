import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import {itemList, heroList} from './FormFieldData';

const autocomplete = {}
const dataSources= {
  hero_id : heroList,
  item: itemList
}

function resetField(field, resetState) {
    autocomplete[field].setState({searchText: ''})
    resetState()
  }



const ScenarioFormField = ({fields, setState}) => {

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
                setState({[field]: chosenRequest.value})
              }}
                onClick={() => resetField(field, () => setState({[field]: null}))}/>)
            })
  }
        </div>
      )

}



export default ScenarioFormField;