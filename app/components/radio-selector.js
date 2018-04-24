import Ember from 'ember';
import { set } from '@ember/object';
import { copy } from '@ember/object/internals';
import { merge } from '@ember/polyfills';
import { next } from '@ember/runloop';

const hideLayer = (layer) => {
  const layerCopy = copy(layer, true);
  layerCopy.layer.layout = merge(layerCopy.layer.layout, { visibility: 'none' });
  set(layer, 'layer', layerCopy.layer);
};

const showLayer = (layer) => {
  const layerCopy = copy(layer, true);
  layerCopy.layer.layout = merge(layerCopy.layer.layout, { visibility: 'visible' });
  set(layer, 'layer', layerCopy.layer);
};


export default Ember.Component.extend({
  init(...args) {
    this._super(...args);

    next(() => {
      const layers = this.get('layers');
      const queryParams = this.get('queryParams');
      console.log(queryParams, 'QPS', layers.toArray());

      const matchedLayer = layers.find(layer => queryParams.get(layer.layer.id) === true);

      if (matchedLayer) {
        this.send('switchLayer', matchedLayer.layer.id);
      }
    });
  },

  layers: [],
  queryParams: null,
  actions: {
    switchLayer(id) {
      const layers = this.get('layers');
      const queryParams = this.get('queryParams');

      // turn all layers off, reset query params
      layers.forEach((layer) => {
        // show the selected layer
        if (layer.layer.id === id) {
          showLayer(layer);

          queryParams.set(layer.layer.id, true);
        } else { // hide all other layers
          hideLayer(layer);

          queryParams.set(layer.layer.id, false);
        }
      });
    },
  },
});
