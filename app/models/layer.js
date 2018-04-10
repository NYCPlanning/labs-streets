import Model from 'ember-data/model';
import { attr, belongsTo } from 'ember-decorators/data';
import { alias } from 'ember-decorators/object/computed';

export default class LayerModel extends Model {
  @belongsTo('layer-group') layerGroup
  @attr() style

  @alias('layerGroup.visible')
  get visible() {
    return this.get('layerGroup.visible');
  }

  @alias('layerGroup.highlightable')
  get highlightable() {
    return this.get('layerGroup.highlightable');
  }
}
