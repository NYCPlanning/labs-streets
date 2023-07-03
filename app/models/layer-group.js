import { hasMany, attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import LayerGroup from 'ember-mapbox-composer/models/layer-group';
import { service } from '@ember-decorators/service';

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
