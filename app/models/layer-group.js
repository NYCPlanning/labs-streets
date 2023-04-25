import DS from 'ember-data';
import { alias } from '@ember/object/computed';
import LayerGroup from '@nycplanning/ember/models/layer-group';
import { inject as service } from '@ember/service';

const { hasMany, attr } = DS;
export default class LayerGroupModel extends LayerGroup {
  init(...args) {
    this._super(...args);

    // update registry for aggregate state service
    this.set('layerGroupService.layerGroupRegistry', this.get('layerGroupService.layerGroupRegistry').concat(this));
  }

  @service('layerGroups')
  layerGroupService

  @attr() meta
  @attr() legend
  @alias('legend.label') title

  @hasMany('source', { async: false }) sources
}
