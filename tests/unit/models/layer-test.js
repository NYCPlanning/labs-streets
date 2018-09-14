import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | layer', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let layerGroup = run(() => store.createRecord('layer-group', {}));
    let model = run(() => store.createRecord('layer', { layerGroup }));
    assert.ok(model);
  });
});
