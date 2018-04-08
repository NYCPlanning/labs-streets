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

  highlightedFeature = null;
  highlightedFeatureLayer = {
    id: 'highlighted-feature',
    type: 'line',
    source: 'highlighted-feature',
    paint: {
      'line-color': '#555555',
      'line-opacity': 0.8,
      'line-width': {
        stops: [
          [8, 2],
          [11, 4],
        ],
      },
    },
  }

  @computed('highlightedFeature')
  get highlightedFeatureSource() {
    const feature = this.get('highlightedFeature');
    return {
      type: 'geojson',
      data: feature,
    };
  }

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

  @action
  handleMouseMove(e) {
    const [feature] = e.features;
    const map = this.get('map');

    if (feature) {
      // set the highlighted feature
      this.set('highlightedFeature', feature);
      map.getSource('highlighted-feature').setData(feature);
    } else {
      this.set('highlightedFeature', null);
    }

    map.getCanvas().style.cursor = (feature) ? 'pointer' : '';
  }

  // preload all sources
  _onLoad(map) {
    super._onLoad(map);

    const sources = this.get('sources');
    sources.forEach((source) => {
      map.addSource(source.id, source);
    });

    map.addSource('highlighted-feature', this.get('highlightedFeatureSource'));
  }
}
