import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

const testLayerGroup = {
  id: 'lower-manhattan',
  layers: [
    {
      layer: {
        'id': 'lower-manhattan-fill',
        'type': 'fill',
        'source': 'lower-manhattan',
        'paint': {
            'fill-color': '#ce9033',
            'fill-opacity': 0.8
        }
      },
    },
    {
      layer: {
        'id': 'lower-manhattan-line',
        'type': 'line',
        'source': 'lower-manhattan',
        'paint': {
            'line-width': 4,
            'line-color': 'black',
        }
      },
    },
  ],
};

const testLayerGroup2 = {
  id: 'lower-manhattan'
};

module('Unit | Model | layer group', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('layer-group', testLayerGroup));
    assert.ok(model);
  });

  skip('it returns all layer IDs', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('layer-group', testLayerGroup));
    assert.equal(model.get('layerIds.length'), 2);
  });

  skip('it handles models with no layers', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('layer-group', testLayerGroup2));
    assert.ok(model.get('layerIds'));
  });
});
