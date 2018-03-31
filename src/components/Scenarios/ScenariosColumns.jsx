import React from 'react';
import PropTypes from 'prop-types';
import {
  connect
} from 'react-redux';
import Helmet from 'react-helmet';
import {
  getRecords
} from 'actions';
import strings from 'lang';
import Table from 'components/Table';
import Heading from 'components/Heading';
import {
  transformations,
  formatSeconds,
  getOrdinal
} from 'utility';
// import { IconRadiant, IconDire, IconTrophy } from 'components/Icons';
import Container from 'components/Container';
import TabBar from 'components/TabBar';
import FormField from 'components/Form/FormField';
import {
  getScenariosItemTimings,
  getScenariosLaneRoles,
  getScenariosMisc
} from '../../actions/index';
import fetch from 'isomorphic-fetch';
import {
  withRouter
} from 'react-router-dom';
import querystring from 'querystring';
import {
  toggleShowForm
} from 'actions/formActions';
import styled from 'styled-components';
import * as data from './FormFieldData';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';
import MenuItem from 'material-ui/MenuItem';
import {
  DropDownMenu
} from 'material-ui/DropDownMenu';
import {
  itemList,
  heroList
} from './FormFieldData';
import ScenariosFormField from './ScenariosFormField';
import {
  Link
} from 'react-router-dom';
import {
  inflictorWithValue
} from 'components/Visualizations';


const computeWinRate = row => (row.wins / row.games * 100).toFixed(2)

export const columns = {
  itemTimings: [{
    displayName: 'hero',
    field: 'hero_id',
    sortFn: true,
    displayFn: transformations.hero_id
  }, {
    displayName: 'time',
    field: 'time',
    sortFn: true,
    displayFn: (row, col, field) => formatSeconds(field)
  }, {
    displayName: 'item',
    field: 'item',
    sortFn: true,
    displayFn: (row, col, field) => inflictorWithValue(field)
  }, {
    displayName: 'wr%',
    sortFn: computeWinRate
  }],

  laneRoles: [{
    displayName: 'hero',
    field: 'hero_id',
    sortFn: true,
    displayFn: transformations.hero_id
  }, {
    displayName: 'lane',
    field: 'lane_role',
    sortFn: true,
    displayFn: (row, col, field) => strings[`lane_role_${field}`]
  }, {
    displayName: 'gameduriation',
    field: 'time',
    sortFn: true,
    displayFn: (row, col, field) => formatSeconds(field)
  },   {
    displayName: 'wr%',
    sortFn: computeWinRate
  }],

  misc: [{
    displayName: 'scenario',
    field: 'scenario',
    sortFn: true,
    displayFn: (row, col, field) => field
  }, {
    displayName: 'region',
    field: 'region',
    sortFn: true,
    displayFn: (row, col, field) => field
  }, {
    displayName: 'is_radiant',
    field: 'is_radiant',
    sortFn: true,
    displayFn: (row, col, field) => field ? 'Radiant' : 'Dire'
  },  {
    displayName: 'wr%',
    sortFn: computeWinRate
  }],
}
