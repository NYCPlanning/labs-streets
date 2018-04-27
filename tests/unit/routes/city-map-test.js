import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | city-map', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:city-map');
    assert.ok(route);
  });
});
