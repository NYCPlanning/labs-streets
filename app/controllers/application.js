import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class ApplicationController extends Controller {
  queryParams = ['amendments']

  amendments = true;

  initMapOptions = {
    style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
    zoom: 10,
    center: [-74.1197, 40.6976],
  }

  @action
  handleLayerClick(feature = { layer: {} }) {
    const { layer: { id: layerId } } = feature;

    // there will be many of these
    if (layerId === 'citymap-amendments-fill') {
      const { properties: { altmappdf = '' } } = feature;
      const clean = altmappdf.split('/').pop();
      window.open(`https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${clean}`);
    }
  }

  @action
  handleMapLoad(map) {
    window.map = map;

    const basemapLayersToHide = [
      'highway_path',
      'highway_minor',
      'highway_major_casing',
      'highway_major_inner',
      'highway_major_subtle',
      'highway_motorway_casing',
      'highway_motorway_inner',
      'highway_motorway_subtle',
      'highway_motorway_bridge_casing',
      'highway_motorway_bridge_inner',
      // 'highway_name_other',
      // 'highway_name_motorway',
    ];

    basemapLayersToHide.forEach(layer => map.removeLayer(layer));
  }
}
