import heroes from 'dotaconstants/build/heroes.json';
import items from 'dotaconstants/build/items.json';


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

