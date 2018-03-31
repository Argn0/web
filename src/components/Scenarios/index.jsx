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
import {getScenariosItemTimings, getScenariosLaneRoles, getScenariosMisc} from '../../actions/index';
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
import { columns } from './ScenariosColumns.jsx'



const fields = {
itemTimings: ['hero_id', 'item'],
laneRoles: ['hero_id', 'lane_role'],
misc: ['scenario']
}

const menuItems = [{
    text: 'Item Timings',
    value: 'itemTimings'
  },
  {
    text: 'Lane Roles',
    value: 'laneRoles'
  },
  {
    text: 'misc',
    value: 'misc'
  },
]

class Scenarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownValue: null,
      formFields : {},
      queryParams: {}
    };
  }


  updateQueryParams() {
    const {formFields, dropDownValue} = this.state
    console.log(formFields)
    this.props.history.push(`${this.props.location.pathname}?${querystring.stringify(formFields[dropDownValue])}`);
  }

  updateFormFieldStates(newFormFieldState) {
    console.log(this.state)
    const { dropDownValue } = this.state
    this.setState({
      formFields: {...this.state.formFields, [dropDownValue]: {...this.state.formFields[dropDownValue],  ...newFormFieldState}}
    }, this.updateQueryParams)
  }


  handleChange = (event, index, dropDownValue) => {
    this.setState({dropDownValue}, this.updateQueryParams)
  }

  getLink(scenario) {
    return <Link to={`/scenarios/${scenario}?` + querystring.stringify(this.state.formFields)}/> 
  }

  componentWillMount() {
    const dropDownValue = this.props.match.params.info || 'itemTimings'
    const params = querystring.parse(this.props.location.search.substring(1))
    this.setState({ dropDownValue, 
    formFields: {[dropDownValue] : querystring.parse(this.props.location.search.substring(1)) || null}}, this.updateFormFieldStates);
  }

  render() {
    const dropDownValue  = this.state.dropDownValue
    const formFields =  this.state.formFields
    return (
      <div>
        <DropDownMenu value={dropDownValue} onChange={this.handleChange}>
        {menuItems.map(item => {
          return (
            <MenuItem value={item.value} primaryText={item.text} containerElement={this.getLink(item.value)}/>
          )
        })}
        </DropDownMenu>
        {fields[dropDownValue].map(field => {
          return (
          <ScenariosFormField key={field+dropDownValue} field={field} updateQueryParams={this.updateQueryParams.bind(this)} updateFormFieldState={this.updateFormFieldStates.bind(this)} formFieldState={formFields[dropDownValue] && formFields[dropDownValue][field]}/>
          )
        })}
        <FlatButton
          variant="raised"
          color="primary"
          onClick={() => this.props.scenariosDispatch[dropDownValue](this.state.formFields[dropDownValue])}>
          Primary
        </FlatButton>
        <Table
          key={dropDownValue}
          data={this.props.scenariosState[dropDownValue].data}
          columns={columns[dropDownValue]}
          loading={this.props.scenariosState[dropDownValue].loading}
          paginated/>
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
    scenariosLaneRoles,
    scenariosMisc,
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
    },
    misc: {
      data: scenariosMisc.data,
      loading:scenariosMisc.loading,
      error: scenariosMisc.error
    }
  }
  };
}

const mapDispatchToProps = dispatch => ({
  scenariosDispatch: {
    itemTimings: (params) => dispatch(getScenariosItemTimings(params)),
    laneRoles: (params) => dispatch(getScenariosLaneRoles(params)),
    misc: (params) => dispatch(getScenariosMisc(params)),
  }
});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Scenarios));