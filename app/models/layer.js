import Model from 'ember-data/model';
import { merge } from '@ember/polyfills';
import { attr, belongsTo } from 'ember-decorators/data';
import { alias } from 'ember-decorators/object/computed';

export default class LayerModel extends Model {
  constructor() {
    super();

    // inherit visibility from layer group
    // and apply as mapbox style spec.
    // check the transform for style
    // to add more
    const visible = this.get('visible');
    this.set('style.layout.visibility', (visible ? 'visible' : 'none'));
    const currentStyle = merge({}, this.get('style'));
    this.set('style', currentStyle);
  }

  @belongsTo('layer-group') layerGroup
  @attr('mapbox-gl-style') style

  @alias('layerGroup.visible') visible

  @alias('layerGroup.highlightable') highlightable;
}
