import Model from 'ember-data/model';
import { attr, hasMany } from 'ember-decorators/data';
import { mapBy } from 'ember-decorators/object/computed';

export default class LayerGroupModel extends Model {
  @hasMany('layer') layers

  @attr('boolean', { defaultValue: true }) visible

  @attr('boolean', { defaultValue: false }) highlightable

  // properties used to describe the visibility state
  // of the associated layers. layer groups can have
  //  - singleton layers (only one or none layers are visible)
  //  - multi (many may be visible or none)
  //  - binary (all are visible or none are visible)
  @attr('string', { defaultValue: 'binary' }) layerVisibilityType

  @attr('string') title

  @attr('string', { defaultValue: '' }) titleTooltip

  @attr('string') legendIcon

  @attr('string') legendColor

  @attr('string') meta

  @mapBy('layers', 'id') layerIds

  // hideAll() {}
  showOneLayer(id) {
    this.get('layers').forEach((layer) => {
      if (layer.get('id') === id) {
        layer.set('layout', {}/* visible */);
      }

      layer.set('layout', {}/* not visible */);
    });
  }
}
