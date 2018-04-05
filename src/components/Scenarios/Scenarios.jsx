import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { getRecords } from 'actions';
import strings from 'lang';
import Table from 'components/Table';
import Heading from 'components/Heading';
import { transformations, formatSeconds, getOrdinal } from 'utility';
// import { IconRadiant, IconDire, IconTrophy } from 'components/Icons';
import Container from 'components/Container';
import TabBar from 'components/TabBar';
import FormField from 'components/Form/FormField';
import { getScenariosItemTimings, getScenariosMisc, getScenariosLaneRoles } from '../../actions/index';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';
import querystring from 'querystring';
import { toggleShowForm } from 'actions/formActions';
import styled from 'styled-components';
import * as data from './FormFieldData';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';
import MenuItem from 'material-ui/MenuItem';
import { DropDownMenu } from 'material-ui/DropDownMenu';
import { itemList, heroList } from './FormFieldData';
import ScenariosFormField from './ScenariosFormField';
import { Link } from 'react-router-dom';
import { columns } from './ScenariosColumns.jsx';

// placeholder, will be replaced by api call
export const metaData = {
  timings: [450, 600, 720, 900, 1200, 1500, 1800],
  gameDurationBucket: [900, 1800, 2700, 3600, 5400],
  itemCost: 2000,
  teamScenariosQueryParams: {
  pos_chat_1min: 'Positivity in chat before 1 minute',
  neg_chat_1min: 'Negativity in chat before 1 minute',
  courier_kill: 'Courier Kill before 3 minutes',
  first_blood: 'First Blood',
}
}

const minSampleSize = x => x.games > 0;

const fields = {
  itemTimings: ['hero_id', 'item'],
  laneRoles: ['hero_id', 'lane_role'],
  misc: ['scenario'],
};

const menuItems = [{
  text: 'Item Timings',
  value: 'itemTimings',
},
{
  text: 'Lane Roles',
  value: 'laneRoles',
},
{
  text: 'Misc',
  value: 'misc',
},
];

const reduceRows = (data) => {
  if (data.length === 0) {
    return data;
  }
  return [data.reduce((a, b) => ({
    ...a,
    games: Number(a.games) + Number(b.games),
    wins: Number(a.wins) + Number(b.wins),
  }))];
};

class Scenarios extends React.Component {
  constructor(props) {
    super(props);
    const dropDownValue = this.props.match.params.info || 'itemTimings';
    const params = querystring.parse(this.props.location.search.substring(1));
    this.state = {
      dropDownValue,
      formFields: { [dropDownValue]: querystring.parse(this.props.location.search.substring(1)) || null },
    };
    this.updateFormFieldStates();
    this.getData = this.getData.bind(this);
  }


  updateQueryParams() {
    const { formFields, dropDownValue } = this.state;
    console.log(formFields);
    this.props.history.push(`${this.props.location.pathname}?${querystring.stringify(formFields[dropDownValue])}`);
  }

  updateFormFieldStates(newFormFieldState) {
    console.log(this.state);
    const { dropDownValue } = this.state;
    this.setState({
      formFields: { ...this.state.formFields, [dropDownValue]: { ...this.state.formFields[dropDownValue], ...newFormFieldState } },
    }, this.updateQueryParams);
  }


  handleChange = (event, index, dropDownValue) => {
    this.setState({ dropDownValue }, this.updateQueryParams);
  }

  getLink(scenario) {
    return <Link to={`/scenarios/${scenario}?${querystring.stringify(this.state.formFields)}`} />;
  }

  getData() {
    const { scenariosDispatch } = this.props;
    const { dropDownValue, formFields } = this.state;
    scenariosDispatch[dropDownValue](formFields[dropDownValue]);
  }

  componentDidMount() {
    const { dropDownValue, formFields } = this.state;
    if (Object.keys(formFields[dropDownValue]).length > 0) {
      this.getData();
    }
  }

  render() {
    const { scenariosState } = this.props;
    const { dropDownValue, formFields } = this.state;
    const data = scenariosState[dropDownValue].data;
    console.log(this.props);
    console.log(data);
    return (
      <div>
        <DropDownMenu value={dropDownValue} onChange={this.handleChange}>
          {menuItems.map(item => (
            <MenuItem value={item.value} primaryText={item.text} containerElement={this.getLink(item.value)} />
          ))}
        </DropDownMenu>
        {fields[dropDownValue].map(field => (
          <ScenariosFormField key={field + dropDownValue} field={field} updateQueryParams={this.updateQueryParams.bind(this)} updateFormFieldState={this.updateFormFieldStates.bind(this)} formFieldState={formFields[dropDownValue] && formFields[dropDownValue][field]} metaData={metaData}/>
          ))}
        <FlatButton
          variant="raised"
          color="primary"
          onClick={this.getData}
        >
          Primary
        </FlatButton>
        <Table
          key={dropDownValue}
          data={data.filter(minSampleSize)}
          columns={columns[dropDownValue]}
          loading={scenariosState[dropDownValue].loading}
          paginated
        />
      </div>
    );
  }
}

Scenarios.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ info: PropTypes.string }),
  }),
};

const mapStateToProps = (state) => {
  const {
    scenariosItemTimings,
    scenariosLaneRoles,
    scenariosMisc,
  } = state.app;

  return {
    scenariosState: {
      itemTimings: {
        data: scenariosItemTimings.data,
        loading: scenariosItemTimings.loading,
        error: scenariosItemTimings.error,
      },
      laneRoles: {
        data: scenariosLaneRoles.data,
        loading: scenariosLaneRoles.loading,
        error: scenariosLaneRoles.error,
      },
      misc: {
        data: reduceRows(scenariosMisc.data),
        loading: scenariosMisc.loading,
        error: scenariosMisc.error,
      },
    },
  };
};

const mapDispatchToProps = dispatch => ({
  scenariosDispatch: {
    itemTimings: params => dispatch(getScenariosItemTimings(params)),
    laneRoles: params => dispatch(getScenariosLaneRoles(params)),
    misc: params => dispatch(getScenariosMisc(params)),
  },
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Scenarios));
