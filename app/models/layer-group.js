import Model from 'ember-data/model';
import { attr, hasMany } from 'ember-decorators/data';
import { mapBy } from 'ember-decorators/object/computed';

export default class LayerGroupModel extends Model {
  @hasMany('layer') layers

  @attr('string') title
  @attr('string') legendIcon
  @attr('string') legendColor
  @attr('boolean') visible = false
  @attr('string') meta

  @mapBy('layers.@each', 'style.id') layerIds
}
