import mapboxGlMap from 'ember-mapbox-gl/components/mapbox-gl';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';

export default class MainMapComponent extends mapboxGlMap {
  @argument
  model = null;

  @action
  handleMouseClick(e) {
    const map = this.get('map');
    const model = this.get('model');
    if (map && model) {
      const [feature] = map.queryRenderedFeatures(e.point, { layers: ['citymap-amendments-fill'] });
      const { layer: { id: layerId } } = feature;

      if (layerId === 'citymap-amendments-fill') {
        const { properties: { altmappdf = '' } } = feature;
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
