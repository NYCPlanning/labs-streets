import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import LayerGroup from 'ember-mapbox-composer/models/layer-group';

export default class LayerGroupModel extends LayerGroup {
  @attr() meta
  @attr() legend
  @alias('legend.label') title
}
