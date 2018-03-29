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




export const columns = 
{itemTimings: [
  {
    displayName: 'hero',
    field: 'hero_id',
    displayFn: transformations.hero_id
  },
  {
    displayName: 'time',
    field: 'time',
    displayFn: (row, col, field) => field
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
  },  
  
  {
    displayName: 'lane',
    field: 'lane_role',
    displayFn: (row, col, field) => strings[`lane_role_${field}`]
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
misc: [
  {
    displayName: 'scenario',
    field: 'scenario',
    displayFn: (row, col, field) => field
  },  
  
  {
    displayName: 'region',
    field: 'region',
    displayFn:  (row, col, field) => field
  }, {
    displayName: 'is_radiant',
    field: 'is_radiant',
    displayFn: (row, col, field) => field
  },
   {
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