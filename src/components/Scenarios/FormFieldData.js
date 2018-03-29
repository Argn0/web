import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';
import strings from 'lang';


export const heroList = Object.keys(heroes).map(id => ({
    text: heroes[id] && heroes[id].localized_name,
    value: id,
  })).sort((a, b) => a.text.localeCompare(b.text));


export const itemList = Object.keys(items).map(k => [items[k], k]).filter(x => x[0].cost >= 2000).map(function (x) {
  return {
    text: x[0].dname,
    value: x[1]
  }
}).sort((a, b) => a.text.localeCompare(b.text));


export const laneRoleList = [1, 2, 3, 4].map(role=> { return {text: strings[`lane_role_${role}`], value: role.toString()}})

export const miscList = ['pos_chat_1min','neg_chat_1min','courier_kill','first_blood'].map(scenario=> { return {text: scenario, value: scenario}})