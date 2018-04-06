import strings from 'lang';
import { transformations, formatSeconds } from 'utility';
import { inflictorWithValue } from 'components/Visualizations';

const computeWinRate = row => (row.wins / row.games);

const getTimeRange = (field, metadata) => {
  let lower;
  if (metadata.indexOf(field) !== 0) {
    lower = metadata[metadata.indexOf(field) - 1];
  } else {
    lower = 0;
  }
  return `${formatSeconds(lower)} - ${formatSeconds(field)}`;
};

const getColumns = (f, metadata) => {
  const columns =
{
  itemTimings: [{
    displayName: strings.filter_hero_id,
    field: 'hero_id',
    sortFn: true,
    displayFn: transformations.hero_id,
  }, {
    displayName: strings.time,
    field: 'time',
    sortFn: row => row.time,
    displayFn: (row, col, field) => getTimeRange(field, metadata.timings),
  }, {
    displayName: strings.item,
    field: 'item',
    sortFn: true,
    displayFn: (row, col, field) => inflictorWithValue(field),
  }, {
    displayName: strings.heading_win_rate,
    field: 'wins',
    sortFn: computeWinRate,
    percentBars: true,
  }],

  laneRoles: [{
    displayName: strings.filter_hero_id,
    field: 'hero_id',
    sortFn: true,
    displayFn: transformations.hero_id,
  }, {
    displayName: strings.heading_lane_role,
    field: 'lane_role',
    sortFn: true,
    displayFn: (row, col, field) => strings[`lane_role_${field}`],
  }, {
    displayName: strings.game_duration,
    field: 'time',
    sortFn: true,
    displayFn: (row, col, field) => getTimeRange(field, metadata.gameDurationBucket),
  }, {
    displayName: strings.heading_win_rate,
    field: 'wins',
    sortFn: computeWinRate,
    percentBars: true,
  }],

  misc: [{
    displayName: strings.scenario,
    field: 'scenario',
    sortFn: true,
    displayFn: (row, col, field) => field,
  }, {
    displayName: strings.heading_win_rate,
    field: 'wins',
    sortFn: computeWinRate,
    percentBars: true,
  }],
};

  return columns[f];
};

export default getColumns;
