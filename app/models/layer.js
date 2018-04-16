import Model from 'ember-data/model';
import { computed } from '@ember-decorators/object';
import { attr, belongsTo } from 'ember-decorators/data';
import { alias } from 'ember-decorators/object/computed';
import { copy } from '@ember/object/internals';
import { set } from '@ember/object';

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

  @attr('string', {
    defaultValue: 'place_other',
  }) before

  @belongsTo('layer-group') layerGroup

  @attr({
    defaultValue: () => ({}),
  }) style

  @alias('layerGroup.visible') visible;

  @alias('layerGroup.highlightable') highlightable;

  @alias('style.filter') filter;

  @alias('style.layout') layout;

  @alias('style.paint') paint;

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
