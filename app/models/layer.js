import Model from 'ember-data/model';
import { computed } from '@ember-decorators/object';
import { attr, belongsTo } from 'ember-decorators/data';
import { alias } from 'ember-decorators/object/computed';
import { copy } from '@ember/object/internals';
import { set } from '@ember/object';
import { assign } from '@ember/polyfills';

export default class LayerModel extends Model {
  constructor(...args) {
    super(...args);
    this.delegateVisibility();
    this.addObserver('layerGroup.visible', this, 'delegateVisibility');
  }

  delegateVisibility() {
    const visible = this.get('layerGroup.visible');

    if (this.get('layerVisibilityType') === 'singleton') {
      if (this.get('position') === 1 && this.get('layerGroup.visible')) {
        this.set('visibility', true);
      } else {
        this.set('visibility', false);
      }
    } else {
      this.set('visibility', visible);
    }
  }

  @belongsTo('layer-group') layerGroup

  @attr('number', { defaultValue: -1 }) position;

  @computed('style.{paint,layout,filter}')
  get mapboxGlStyle() {
    return this.get('style');
  }

  @attr('string', { defaultValue: 'place_other' }) before

  @attr('string') displayName;

  @attr({ defaultValue: () => ({}) }) style

  @alias('style.paint') paint;

  @alias('style.layout') layout;

  // getter and setter for filter
  // accepts array
  @computed('style.filter')
  get filter() {
    return this.get('style.filter');
  }
  set filter(filter) {
    this.set('style', assign({}, this.get('style'), { filter }));
  }

  // getter and setter for visibility
  // accepts true or false
  // mapbox property that actually determines visibility
  // this also must check that parent visibility is true
  @computed('layout.visibility')
  get visibility() {
    return this.get('layout.visibility') === 'visible';
  }
  set visibility(value) {
    const parentVisibilityState = value && this.get('layerGroup.visible');
    const visibility = (parentVisibilityState ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }

  @alias('layerGroup.highlightable') highlightable;

  @alias('layerGroup.layerVisibilityType') layerVisibilityType;

  @attr('boolean', { defaultValue: false }) tooltipable

  @attr('string', { defaultValue: '' }) tooltipTemplate
}
