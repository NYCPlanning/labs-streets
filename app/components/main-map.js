import mapboxGlMap from 'ember-mapbox-gl/components/mapbox-gl';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';

const highlightedFeatureLayer = {
  type: 'line',
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
};

export default class MainMapComponent extends mapboxGlMap {
  @argument
  model = null;

  highlightedFeatureLayer = highlightedFeatureLayer;
  highlightedFeature = null;

  @computed('model.layerGroups.@each')
  get localLayers() {
    const layerGroups = this.get('model.layerGroups');
    return layerGroups
      .mapBy('layers')
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
  }

  @action
  handleMouseClick(e) {
    const map = this.get('map');
    const model = this.get('model');
    if (map && model) {
      const layers = this.get('localLayers').mapBy('style.id');
      const [feature] = map.queryRenderedFeatures(e.point, { layers });
      const { layer: { id: layerId } } = feature;

      if (layerId === 'citymap-amendments-fill') {
        const { properties: { altmappdf } } = feature;
        const clean = altmappdf.split('/').pop();
        window.open(`https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${clean}`);
      }
    }
  }

  // @action
  // handleMouseMove(e) {
  //   const layers = this.get('localLayers').mapBy('style.id');
  //   const feature = e.target.queryRenderedFeatures(e.point, { layers })[0];
  //   const map = this.get('map');

  //   if (feature) {
  //     // set the highlighted feature
  //     this.set('highlightedFeature', feature);
  //     map.getSource('highlighted-feature').setData(feature);
  //   } else {
  //     this.set('highlightedFeature', null);
  //   }

  //   map.getCanvas().style.cursor = feature ? 'pointer' : '';
  // }
}
