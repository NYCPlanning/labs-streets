import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class ApplicationController extends Controller {
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

    const sources = this.get('model.sources');
    // const layerGroups = this.get('model.layerGroups');

    sources.forEach((source) => {
      map.addSource(source.id, source);
    });

    // layerGroups.forEach((layerGroup) => {
    //   const layers = layerGroup.get('layers');

    //   layers.forEach(({ style }) => {
    //     map.addLayer(style);
    //   });
    // });
  }
}
