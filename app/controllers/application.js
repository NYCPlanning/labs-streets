import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class ApplicationController extends Controller {
  @action
  handleMapLoad(map) {
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
