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
    this.inheritVisibility();
    this.addObserver('visible', this, 'inheritVisibility');
  }

  @attr('boolean') tooltipable = false
  @attr('string') tooltipTemplate = ''

  @computed('style.{paint,layout,filter}')
  get mapboxGlStyle() {
    return this.get('style');
  }

  @computed('layout.visibility')
  get layoutVisible() {
    return this.get('layout.visibility') === 'visible';
  }
  set layoutVisible(value) {
    const visibility = (value ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }

  @attr('string', { defaultValue: 'place_other' }) before

  @attr('string') displayName;

  @belongsTo('layer-group') layerGroup

  @attr({ defaultValue: () => ({}) }) style

  @alias('layerGroup.visible') visible;

  @alias('layerGroup.highlightable') highlightable;

  @computed('style.filter')
  get filter() {
    return this.get('style.filter');
  }
  set filter(filter) {
    this.set('style', assign({}, this.get('style'), { filter }));
  }

  @alias('style.layout') layout;

  @alias('style.paint') paint;

  setFilter(filter = []) {
    this.set('style', assign({}, this.get('style'), { filter }));
  }

  inheritVisibility() {
    const visible = this.get('visible');
    const visibility = (visible ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }
}
