import DS from 'ember-data';
import { computed } from '@ember/object';
import { attr } from 'ember-decorators/data';

export default DS.Model.extend({
  layerIds: computed('layers.@each', function() {
    const layers = this.get('layers');
    return layers.mapBy('style.id');
  }),
  @attr('string') title: null,
  @attr('string') legendIcon: null,
  @attr('string') legendColor: null,
  @attr('boolean') visible: false,
  @attr('string') meta: null,
  @attr() layers: null,
});
