import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import LayerGroup from 'ember-mapbox-composer/models/layer-group';

export default LayerGroup.extend({
  meta: DS.attr(),
  legend: DS.attr(),
  title: alias('legend.label'),
});
