import Ember from 'ember';

export default Ember.Component.extend({
  layers: [],
  queryParams: null,
  actions: {
    switchLayer(id) {
      const layers = this.get('layers');
      // turn all layers off, reset query params
      layers.forEach((layer) => {
        // show the selected layer
        if (layer.get('id') === id) {
          layer.set('layoutVisible', true);
        } else { // hide all other layers
          layer.set('layoutVisible', false);
        }
      });
    },
  },
});
