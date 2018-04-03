import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  layers: [],
  layerIds: computed('layers.@each', function() {
    const layers = this.get('layers');
    return layers.mapBy('layer.id');
  }),
});
