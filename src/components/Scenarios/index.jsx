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
import { Link } from 'react-router-dom';

const ScenariosTable = ({}) => {
  <Table />
}

const fields = {
itemTimings: ['hero_id', 'item'],
laneRoles: ['hero_id', 'lane_role']
}

const columns = 
{itemTimings: [
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
],
laneRoles: [
  {
    displayName: 'hero',
    field: 'hero_id',
    displayFn: transformations.hero_id
  }, {
    displayName: 'lane',
    field: 'lane_role',
    displayFn: (row, col, field) => field
  }, {
    displayName: 'games',
    field: 'games',
    displayFn: (row, col, field) => field
  }, {
    displayName: 'wins',
    field: 'wins',
    displayFn: (row, col, field) => field
  }
],
}

class Scenarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownValue: null,
      formFields : {},
      queryParams: {}
    };
  }

  handleChange = (event, index, dropValue) => this.setState({dropValue});

  updateQueryParams() {
    const {formFields} = this.state
    Object.keys(formFields).forEach((key) => (formFields[key] == null) && delete formFields[key]);
    this.props.history.push(`${this.props.location.pathname}?${querystring.stringify(formFields)}`);
  }

  updateFormFields = (newFieldState) => {
    console.log(newFieldState)
    this.setState({
      ...this.state,
      formFields : {...this.state.formFields, ...newFieldState }
    })
    console.log(this.state.formFields)
    this.updateQueryParams()
  }

  translateData(data) {
    return data.map(row => ({
      ...row,
      item: items[row.item].dname
    }))
  }


  componentWillMount() {
    this.setState({ dropDownValue: this.props.match.params.info || 'itemTimings', 
    formFields: querystring.parse(this.props.location.search.substring(1)) || null});
  }

  render() {
    console.log(this.props)
    console.log(this.state)
    console.log(querystring.parse(this.props.location.search))
    const dropDownValue  = this.state.dropDownValue
    const formFields =  this.state.formFields
    console.log(formFields)
    return (
      <div>
        <DropDownMenu value={dropDownValue} onChange={this.handleChange}>
          <MenuItem value={'itemTimings'} primaryText='Item Timings' containerElement={<Link to={'/scenarios/itemTimings?' + querystring.stringify(formFields)}/>}/>     
          <MenuItem value={'laneRoles'} primaryText="Lane Roles" containerElement={<Link to={'/scenarios/laneRoles?' + querystring.stringify(formFields)}/>}/>
        </DropDownMenu>
        <ScenariosFormField fields={fields[dropDownValue]}  updateFormFields={this.updateFormFields.bind(this)} updateQueryParams={this.updateQueryParams.bind(this)}/>
        <FlatButton
          variant="raised"
          color="primary"
          onClick={() => this.props.scenariosDispatch[dropDownValue](this.state.formFields)}>
          Primary
        </FlatButton>
        <Table
          data={this.props.scenariosState[dropDownValue].data}
          columns={columns[dropDownValue]}
          loading={this.props.scenariosState[dropDownValue].loading}/>
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
    scenariosState: {
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
  }
  };
}

const mapDispatchToProps = dispatch => ({
  scenariosDispatch: {
    itemTimings: (params) => dispatch(getScenariosItemTimings(params)),
    laneRoles: (params) => dispatch(getScenariosLaneRoles(params))
  }
});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Scenarios));