import DS from 'ember-data';
import { attr, belongsTo } from 'ember-decorators/data';

const { Model } = DS;

export default class LayerModel extends Model {
  @belongsTo('layer-group') layerGroups = null;

  @attr() style = null;
}
