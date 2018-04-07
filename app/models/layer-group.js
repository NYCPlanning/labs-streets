import Model from 'ember-data/model';
import { attr, hasMany } from 'ember-decorators/data';
import { mapBy } from 'ember-decorators/object/computed';

export default class LayerGroupModel extends Model {
  @hasMany('layer') layers = null;

  @attr('string') title = null;
  @attr('string') legendIcon = null;
  @attr('string') legendColor = null;
  @attr('boolean') visible = false;
  @attr('string') meta = null;
  @attr() layers = null;

  @mapBy('layers.@each', 'style.id') layerIds;
}
