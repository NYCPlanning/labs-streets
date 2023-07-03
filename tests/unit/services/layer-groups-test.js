import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | layer-groups', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:layer-groups');
    assert.ok(service);
  });

  skip('it collects layer group configurations', function(assert) {
    let service = this.owner.lookup('service:layer-groups');
  });

  skip('it should return an array of visible layers', function(assert) {
    let service = this.owner.lookup('service:layer-groups');
  });
});
