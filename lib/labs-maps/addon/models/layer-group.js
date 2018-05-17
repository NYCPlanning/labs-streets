import Model from 'ember-data/model';
import { attr, hasMany } from 'ember-decorators/data';
import { mapBy } from 'ember-decorators/object/computed';
import { computed } from '@ember-decorators/object';

export default class LayerGroupModel extends Model {
  @hasMany('layer') layers

  @attr('boolean', { defaultValue: true }) visible

  @attr('boolean', { defaultValue: false }) highlightable

  /*
  this property describes the visibility state
  of the associated layers. layer groups can have
    - singleton layers (only one or none layers are visible)
      the top-most layer is on by default
    - multi (many may be visible or none)
    - binary (all are visible or none are visible)
  */
  @attr('string', { defaultValue: 'binary' }) layerVisibilityType

  // singleton only
  @computed('layers.@each.visibility')
  get selected() {
    return this.get('layers').findBy('visibility', true);
  }
  set selected(id) {
    this.get('layers').setEach('visibility', false);
    this.get('layers').findBy('id', id).set('visibility', true);
  }

  @attr('string') title

  @attr('string', { defaultValue: '' }) titleTooltip

  @attr('string') legendIcon

  @attr('string') legendColor

  @attr('string') meta

  @attr() legendConfig

  @mapBy('layers', 'id') layerIds

  showOneLayer(id) {
    this.get('layers').forEach((layer) => {
      if (layer.get('id') === id) {
        layer.set('layout', {}/* visible */);
      }

      layer.set('layout', {}/* not visible */);
    });
  }
}
