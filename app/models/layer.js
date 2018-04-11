import Model from 'ember-data/model';
import { computed } from '@ember-decorators/object';
import { attr, belongsTo } from 'ember-decorators/data';
import { alias, oneWay } from 'ember-decorators/object/computed';

export default class LayerModel extends Model {
  constructor(...args) {
    super(...args);
    this.delegateVisibility();
    this.addObserver('visible', this, 'delegateVisibility');
  }

  @computed('style.{paint,layout,filter}')
  get mapboxGlStyle() {
    return this.get('style');
  }

  @belongsTo('layer-group') layerGroup
  @attr('mapbox-gl-layer', {
    defaultValue: () => ({}),
  }) style

  @oneWay('style') originalStyle
  @alias('layerGroup.visible') visible
  @alias('layerGroup.highlightable') highlightable

  @alias('style.filter') filter
  @alias('style.layout') layout
  @alias('style.paint') paint

  delegateVisibility() {
    const visible = this.get('visible');
    const visibility = (visible ? 'visible' : 'none');

    this.set('layout', {
      visibility,
    });
  }

  resetStyle() {
    this.set('style', this.get('originalStyle'));
  }
}
