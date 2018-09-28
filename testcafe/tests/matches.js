import {
  Selector,
} from 'testcafe';
import {
  fixtureBeforeHook,
  fixtureBeforeEachHook,
  fixtureAfterHook,
  fixtureRequestHooks,
  host,
} from './../testsUtility';


const paths = [
  '/matches/4080856812/benchmarks',
  '/matches/4080856812/draft',
  '/matches/4080856812/performances',
  '/matches/4080856812/combat',
  '/matches/4080856812/farm',
  '/matches/4080856812/items',
  '/matches/4080856812/graphs',
  '/matches/4080856812/objectives',
  '/matches/4080856812/actions',
  '/matches/4080856812/analysis',
  '/matches/4080856812/cosmetics',
  '/matches/4080856812/fantasy',
  '/matches/4080856812/story',
];

fixture`matches/ paths`
  .requestHooks(fixtureRequestHooks)
  .before(fixtureBeforeHook)
  .beforeEach(fixtureBeforeEachHook)
  .after(fixtureAfterHook);

paths.forEach((p) => {
  test
    .page`${host}${p}`(p, async (t) => {
    await t.hover(Selector('#root'));
  });
});
