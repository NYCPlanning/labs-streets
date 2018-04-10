import Model from 'ember-data/model';
import { computed } from '@ember-decorators/object';
import { attr, belongsTo } from 'ember-decorators/data';
import { alias, oneWay } from 'ember-decorators/object/computed';

export default class LayerModel extends Model {
  @belongsTo('layer-group') layerGroup
  @attr() style

  @oneWay('style') originalStyle
  @alias('layerGroup.visible') visible
  @alias('layerGroup.highlightable') highlightable

  @computed('style.{paint,layout,filter}')
  get mapboxGlStyle() {
    return this.get('style');
  }

  @alias('style.filter') filter
  @alias('style.layout') layout
  @alias('style.paint') paint

  resetStyle() {
    this.set('style', this.get('originalStyle'));
  }
}
