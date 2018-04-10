import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:mapbox-gl-layer', 'Unit | Transform | mapbox gl layer', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:mapbox-gl-layer');
    assert.ok(transform);
  });
});
