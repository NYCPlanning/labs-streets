import Layer from 'ember-mapbox-composer/models/layer';

export default class LayerModel extends Layer {
  init(...args) {
    if (!this.get('layerGroup._firstOccurringLayer')) {
      this.set('layerGroup._firstOccurringLayer', this.get('id'));
      this.set('position', 1);
    }

    this._super(...args);
  }
}
