import normalizeCartoVectors from 'cartobox-promises-utility/utils/normalize-carto-vectors';
import { module, test } from 'qunit';

const plutoSource = {
  id: 'bulk-headlines',
  type: 'cartovector',
  minzoom: 12,
  'source-layers': [
    {
      id: 'pluto',
      sql: 'SELECT the_geom_webmercator, sourceimag, cartodb_id FROM citymap_bulkheadlines_v1',
    },
  ],
};

module('Unit | Utility | normalize-carto-vectors', function(hooks) {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = normalizeCartoVectors([plutoSource]);
    assert.ok(result);
  });
});
