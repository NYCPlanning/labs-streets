import mapboxGlMap from 'ember-mapbox-gl/components/mapbox-gl';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { alias } from 'ember-decorators/object/computed';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import { required, immutable } from '@ember-decorators/argument/validation';

export default class MainMapComponent extends mapboxGlMap {
  @required
  @argument
  @type('object')
  model = {};

  @alias('model.layerGroups')
  layerGroups;

  @alias('model.layers')
  layers;

  @alias('model.sources')
  sources;

  @required
  @immutable
  @argument
  @type(Action)
  onLayerClick;

  @computed('layers.@each.visible')
  get visibleLayers() {
    return this.get('layers')
      .filterBy('visible', true)
      .mapBy('id');
  }

  @action
  handleMouseClick(e) {
    const map = this.get('map');
    const visibleLayers = this.get('visibleLayers');
    const [feature] = map.queryRenderedFeatures(e.point, { layers: visibleLayers });

    const layerClickEvent = this.get('onLayerClick');
    if (layerClickEvent && feature) {
      layerClickEvent(feature);
    }
  }

  // preload all sources
  _onLoad(map) {
    super._onLoad(map);

    const sources = this.get('sources');
    sources.forEach((source) => {
      map.addSource(source.id, source);
    });
  }
}
