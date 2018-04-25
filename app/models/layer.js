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
    this.addObserver('visible', this, 'delegateVisibility');
  }

  @belongsTo('layer-group') layerGroup

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
  @computed('layout.visibility')
  get visibility() {
    return this.get('layout.visibility') === 'visible';
  }
  set visibility(value) {
    const visibility = (value ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }

  @alias('layerGroup.visible') visible;

  @alias('layerGroup.highlightable') highlightable;

  @attr('boolean') tooltipable = false

  @attr('string') tooltipTemplate = ''

  setFilter(filter = []) {
    this.set('style', assign({}, this.get('style'), { filter }));
  }

  delegateVisibility() {
    const visible = this.get('visible');
    const visibility = (visible ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }
}
