import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {getRecords} from 'actions';
import strings from 'lang';
import Table from 'components/Table';
import Heading from 'components/Heading';
import {transformations, formatSeconds, getOrdinal} from 'utility';
// import { IconRadiant, IconDire, IconTrophy } from 'components/Icons';
import Container from 'components/Container';
import TabBar from 'components/TabBar';
import FormField from 'components/Form/FormField';
import {getScenariosItemTimings, getScenariosLaneRoles} from '../../actions/index';
import fetch from 'isomorphic-fetch';
import {withRouter} from 'react-router-dom';
import querystring from 'querystring';
import {toggleShowForm} from 'actions/formActions';
import styled from 'styled-components';
import * as data from './FormFieldData';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';
import MenuItem from 'material-ui/MenuItem';
import {DropDownMenu} from 'material-ui/DropDownMenu';
import {itemList, heroList} from './FormFieldData';
import ScenariosFormField from './ScenariosFormField';

const ScenariosTable = ({}) => {
  <Table />
}

const autocomplete = {}
const dataSources= {
  hero_id : heroList,
  item: itemList
}

function getFormField(fields) {
  const self = this
  
  function getAutoComplete(fields) {
    console.log(fields)
    return (
      <div>
        {fields
          .map(function (field) {
            console.log(self)
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
              self.setState({[field]: chosenRequest.value})
            }}
              onClick={() => self.resetField(field, () => self.setState({[field]: null}))}/>)
          })
}
      </div>
    )
  }
  const formFields = {
    itemTimings() {
      return getAutoComplete(['hero_id', 'item'])
    }
  }
  return formFields[this.state.dropValue]()
}

const itemTimingColumns = [
  {
    displayName: 'hero',
    field: 'hero_id',
    displayFn: transformations.hero_id
  }, {
    displayName: 'item',
    field: 'item',
    displayFn: (row, col, field) => <img
        src={`${process.env.REACT_APP_API_HOST}${items[field].img}`}
        alt=""
        height='33px'/>
  }, {
    displayName: 'games',
    field: 'games',
    displayFn: (row, col, field) => field
  }, {
    displayName: 'wins',
    field: 'wins',
    displayFn: (row, col, field) => field
  }
]

class Scenarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropValue: 'itemTimings'
    };
  }

  handleChange = (event, index, dropValue) => this.setState({dropValue});

  resetField(field, resetState) {
    autocomplete[field].setState({searchText: ''})
    resetState()
  }

  translateData(data) {
    return data.map(row => ({
      ...row,
      item: items[row.item].dname
    }))
  }

  

  render() {
    return (
      <div>
        <DropDownMenu value={this.state.dropValue} onChange={this.handleChange}>
          <MenuItem value={'itemTimings'} primaryText="Item Timings"/>
        </DropDownMenu>
        <ScenariosFormField fields={['hero_id', 'item']} resetField={this.resetField.bind(this)} setState={this.setState.bind(this)}/>
        <FlatButton
          variant="raised"
          color="primary"
          onClick={() => this.props.getItemTimings(this.state)}>
          Primary
        </FlatButton>
        {console.log(this.props.itemTimings)}
        <Table
          data={this.props[this.state.dropValue].data}
          columns={itemTimingColumns}
          loading={this.props[this.state.dropValue].loading}/>

      </div>
    );
  }
}

Scenarios.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({info: PropTypes.string})
  })
};

const mapStateToProps = state => {
  const {
    scenariosItemTimings,
    scenariosLaneRoles
  } = state.app

  return {
    itemTimings: {
      data: scenariosItemTimings.data,
      loading: scenariosItemTimings.loading,
      error: scenariosItemTimings.error
    },
    laneRoles: {
      data: scenariosLaneRoles.data,
      loading: scenariosLaneRoles.loading,
      error: scenariosLaneRoles.error
    }
  };
}

const mapDispatchToProps = dispatch => ({
  getItemTimings: (params) => dispatch(getScenariosItemTimings(params)),
  getLaneRoles: (params) => dispatch(getScenariosLaneRoles(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Scenarios);