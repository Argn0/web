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
import {getScenariosItemTimings} from '../../actions/index';
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
import { itemList, heroList } from './FormFieldData';

const autocomplete = {}

function getAutoComplete(self, fields) {
  return (
  <div>
  { fields.map(function(field) {
    console.log(field)
return (
    <AutoComplete 
    key={field}
    openOnFocus
    dataSource={[1, 2, 3]}
    ref={(ref) => { autocomplete[field] = ref; return null;}}
    filter={AutoComplete.fuzzyFilter}
    onNewRequest={chosenRequest => {
      self.setState({field: chosenRequest.value})
    }}
    onClick={() => self.resetField(field, () => self.setState({field: null}))}
    />
  )
  })
  }
  </div>
  )
}

function getFormField() {
  const formFields = {
    itemTimings() {
      return getAutoComplete(this, ['hero_id', 'items']) 
    }
  }
  return formFields[this.state.dropValue].call(this)
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
        {getFormField.call(this)}
        <FlatButton
          variant="raised"
          color="primary"
          onClick={() => this.props.getItemTimings(this.state)}>
          Primary
        </FlatButton>
        {console.log(this.props.itemTimings)}
        <Table
          data={this.props.itemTimings.data}
          columns={itemTimingColumns}
          loading={this.props.itemTimings.loading}/>

      </div>
    );
  }
}

Scenarios.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({info: PropTypes.string})
  })
};

const mapStateToProps = state => ({
  itemTimings: {
    data: state.app.scenariosItemTimings.data,
    loading: state.app.scenariosItemTimings.loading,
    error: state.app.scenariosItemTimings.error
  }
});

const mapDispatchToProps = dispatch => ({
  getItemTimings: (params) => dispatch(getScenariosItemTimings(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Scenarios);