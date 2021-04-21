import DS from 'ember-data';
import LayerGroup from 'ember-mapbox-composer/models/layer-group';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default LayerGroup.extend({
  init(...args) {
    this._super(...args);

    // update registry for aggregate state service
    this.set('layerGroupService.layerGroupRegistry', this.get('layerGroupService.layerGroupRegistry').concat(this));
  },

  layerGroupService: service('layerGroups'),

  meta: null,

  legend: null,

  title: alias('legend.label'),

  sources: DS.hasMany('source', { async: false }) 
});
