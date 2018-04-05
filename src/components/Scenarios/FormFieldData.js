import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';
import strings from 'lang';

export default function getFormFieldData(metaData) {
  const {teamScenariosQueryParams, itemCost} = metaData

  return {

heroList : Object.keys(heroes).map(id => ({
  text: heroes[id] && heroes[id].localized_name,
  value: id,
})).sort((a, b) => a.text.localeCompare(b.text)),

itemList : Object.keys(items).map(k => [items[k], k]).filter(x => x[0].cost >= itemCost).map(x => ({
  text: x[0].dname,
  value: x[1],
})).sort((a, b) => a.text.localeCompare(b.text)),

laneRoleList : [1, 2, 3, 4].map(role => ({ text: role.toString(), value: role.toString() })),

miscList : Object.keys(teamScenariosQueryParams).map(scenario => ({ text: scenario, value: scenario }))
  }
}
